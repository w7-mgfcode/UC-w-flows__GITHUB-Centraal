import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { createOctokit, dispatchWorkflow, getWorkflowRun, listWorkflowRuns } from '../src/githubActions.js';

const token = 'test-token';

describe('githubActions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('dispatchWorkflow hits workflow_dispatch endpoint', async () => {
    const octokit = createOctokit(token, 'pipeline-mcp-tests');

    const scope = nock('https://api.github.com')
      .post('/repos/acme/repo/actions/workflows/ci.yml/dispatches', {
        ref: 'main',
        inputs: { foo: 'bar' }
      })
      .reply(204);

    const res = await dispatchWorkflow(octokit, {
      owner: 'acme',
      repo: 'repo',
      workflow_id: 'ci.yml',
      ref: 'main',
      inputs: { foo: 'bar' }
    });

    expect(res.ok).toBe(true);
    expect(scope.isDone()).toBe(true);
  });

  test('listWorkflowRuns maps response', async () => {
    const octokit = createOctokit(token, 'pipeline-mcp-tests');

    const scope = nock('https://api.github.com')
      .get('/repos/acme/repo/actions/workflows/ci.yml/runs')
      .query({ per_page: '20' })
      .reply(200, {
        total_count: 1,
        workflow_runs: [
          {
            id: 123,
            name: 'CI',
            head_branch: 'feature/x',
            head_sha: 'abc',
            status: 'completed',
            conclusion: 'success',
            html_url: 'https://github.com/acme/repo/actions/runs/123',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:10Z'
          }
        ]
      });

    const res = await listWorkflowRuns(octokit, {
      owner: 'acme',
      repo: 'repo',
      workflow_id: 'ci.yml'
    });

    expect(res.total_count).toBe(1);
    expect(res.workflow_runs[0].id).toBe(123);
    expect(res.workflow_runs[0].conclusion).toBe('success');
    expect(scope.isDone()).toBe(true);
  });

  test('getWorkflowRun maps response', async () => {
    const octokit = createOctokit(token, 'pipeline-mcp-tests');

    const scope = nock('https://api.github.com')
      .get('/repos/acme/repo/actions/runs/456')
      .reply(200, {
        id: 456,
        name: 'CI',
        head_branch: 'main',
        head_sha: 'deadbeef',
        status: 'completed',
        conclusion: 'failure',
        html_url: 'https://github.com/acme/repo/actions/runs/456',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:10Z'
      });

    const res = await getWorkflowRun(octokit, {
      owner: 'acme',
      repo: 'repo',
      run_id: 456
    });

    expect(res.id).toBe(456);
    expect(res.conclusion).toBe('failure');
    expect(scope.isDone()).toBe(true);
  });
});
