import http from 'node:http';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport, getDefaultEnvironment } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('pipeline-mcp (stdio integration)', () => {
  afterEach(() => {
  });

  it(
    'exposes tools and can call pipeline.list_workflow_runs',
    async () => {
      const expectedPayload = {
        total_count: 1,
        workflow_runs: [
          {
            id: 123,
            name: 'CI',
            head_branch: 'main',
            head_sha: '0123456789abcdef0123456789abcdef01234567',
            status: 'completed',
            conclusion: 'success',
            html_url: 'https://github.com/acme/demo/actions/runs/123',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:01:00Z'
          }
        ]
      };

      let requestCount = 0;
      const mockServer = http.createServer((req, res) => {
        const base = `http://${req.headers.host}`;
        const url = new URL(req.url ?? '/', base);

        if (
          req.method === 'GET' &&
          url.pathname === '/repos/acme/demo/actions/workflows/ci.yml/runs' &&
          url.searchParams.get('per_page') === '5' &&
          url.searchParams.get('branch') === 'main'
        ) {
          requestCount += 1;
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(expectedPayload));
          return;
        }

        res.statusCode = 404;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ error: 'not found', method: req.method, path: url.pathname, query: url.search }));
      });

      await new Promise<void>((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
      const addr = mockServer.address();
      if (!addr || typeof addr === 'string') {
        throw new Error('Failed to start mock server');
      }
      const githubApiBaseUrl = `http://127.0.0.1:${addr.port}`;

      const client = new Client({
        name: 'pipeline-mcp-integration-test',
        version: '0.1.0'
      });

      const tsxCliPath = path.resolve(process.cwd(), 'node_modules/tsx/dist/cli.mjs');
      const transport = new StdioClientTransport({
        command: process.execPath,
        args: [tsxCliPath, 'src/index.ts'],
        cwd: process.cwd(),
        env: {
          ...getDefaultEnvironment(),
          GITHUB_TOKEN: 'test_token',
          GITHUB_API_BASE_URL: githubApiBaseUrl,
          MCP_USER_AGENT: 'pipeline-mcp-integration-test'
        }
      });

      try {
        await client.connect(transport);

        const toolsList = await client.listTools();
        const toolNames = toolsList.tools.map((t) => t.name);
        expect(toolNames).toContain('pipeline.list_workflow_runs');

        const result = await client.callTool({
          name: 'pipeline.list_workflow_runs',
          arguments: {
            owner: 'acme',
            repo: 'demo',
            workflow_id: 'ci.yml',
            branch: 'main',
            per_page: 5
          }
        });

        const firstText = (result as any)?.content?.[0]?.text;
        const parsed = JSON.parse(firstText ?? 'null');
        expect(parsed).toMatchObject(expectedPayload);
        expect(requestCount).toBe(1);
      } finally {
        await client.close();
        await new Promise<void>((resolve, reject) =>
          mockServer.close((err) => (err ? reject(err) : resolve()))
        );
      }
    },
    15000
  );
});
