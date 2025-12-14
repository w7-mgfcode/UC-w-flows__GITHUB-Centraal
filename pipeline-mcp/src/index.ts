import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod';
import { readEnv } from './env.js';
import { createOctokit, dispatchWorkflow, getWorkflowRun, listWorkflowRuns } from './githubActions.js';

const env = readEnv(process.env);
const octokit = createOctokit(env.githubToken, env.userAgent, env.githubApiBaseUrl);

function resolveRepo(owner?: string, repo?: string): { owner: string; repo: string } {
  const finalOwner = owner ?? env.defaultOwner;
  const finalRepo = repo ?? env.defaultRepo;

  if (!finalOwner || !finalRepo) {
    throw new Error('Missing repo context: provide owner/repo or set GITHUB_OWNER and GITHUB_REPO');
  }

  return { owner: finalOwner, repo: finalRepo };
}

const server = new McpServer({
  name: 'pipeline-mcp',
  version: '0.1.0'
});

server.registerTool(
  'pipeline.dispatch_workflow',
  {
    title: 'Dispatch GitHub Actions Workflow',
    description: 'Triggers a GitHub Actions workflow_dispatch event for a workflow file or ID.',
    inputSchema: {
      owner: z.string().optional(),
      repo: z.string().optional(),
      workflow_id: z.string().describe('Workflow file name (e.g. ci.yml) or workflow ID'),
      ref: z.string().describe('Git ref (branch name, tag, or SHA)'),
      inputs: z.record(z.string()).optional()
    },
    outputSchema: {
      ok: z.boolean()
    }
  },
  async (args: { owner?: string; repo?: string; workflow_id: string; ref: string; inputs?: Record<string, string> }) => {
    const { owner, repo, workflow_id, ref, inputs } = args;
    const resolved = resolveRepo(owner, repo);
    const result = await dispatchWorkflow(octokit, {
      ...resolved,
      workflow_id,
      ref,
      inputs
    });

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      structuredContent: result
    };
  }
);

server.registerTool(
  'pipeline.list_workflow_runs',
  {
    title: 'List Workflow Runs',
    description: 'Lists recent workflow runs for a workflow file or ID.',
    inputSchema: {
      owner: z.string().optional(),
      repo: z.string().optional(),
      workflow_id: z.string(),
      branch: z.string().optional(),
      status: z.enum(['completed', 'in_progress', 'queued']).optional(),
      per_page: z.number().int().min(1).max(100).optional()
    },
    outputSchema: {
      total_count: z.number().int(),
      workflow_runs: z.array(
        z.object({
          id: z.number().int(),
          name: z.string().nullable(),
          head_branch: z.string().nullable(),
          head_sha: z.string(),
          status: z.string().nullable(),
          conclusion: z.string().nullable(),
          html_url: z.string(),
          created_at: z.string(),
          updated_at: z.string()
        })
      )
    }
  },
  async (args: {
    owner?: string;
    repo?: string;
    workflow_id: string;
    branch?: string;
    status?: 'completed' | 'in_progress' | 'queued';
    per_page?: number;
  }) => {
    const { owner, repo, workflow_id, branch, status, per_page } = args;
    const resolved = resolveRepo(owner, repo);
    const result = await listWorkflowRuns(octokit, {
      ...resolved,
      workflow_id,
      branch,
      status,
      per_page
    });

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      structuredContent: result
    };
  }
);

server.registerTool(
  'pipeline.get_workflow_run',
  {
    title: 'Get Workflow Run',
    description: 'Fetches a single workflow run by run_id.',
    inputSchema: {
      owner: z.string().optional(),
      repo: z.string().optional(),
      run_id: z.number().int()
    },
    outputSchema: {
      id: z.number().int(),
      name: z.string().nullable(),
      head_branch: z.string().nullable(),
      head_sha: z.string(),
      status: z.string().nullable(),
      conclusion: z.string().nullable(),
      html_url: z.string(),
      created_at: z.string(),
      updated_at: z.string()
    }
  },
  async (args: { owner?: string; repo?: string; run_id: number }) => {
    const { owner, repo, run_id } = args;
    const resolved = resolveRepo(owner, repo);
    const result = await getWorkflowRun(octokit, {
      ...resolved,
      run_id
    });

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      structuredContent: result
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
