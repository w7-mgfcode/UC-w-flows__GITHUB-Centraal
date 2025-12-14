import { Octokit } from 'octokit';

export type RepoRef = {
  owner: string;
  repo: string;
};

export type WorkflowDispatchArgs = RepoRef & {
  workflow_id: string;
  ref: string;
  inputs?: Record<string, string>;
};

export type ListWorkflowRunsArgs = RepoRef & {
  workflow_id: string;
  branch?: string;
  status?: 'completed' | 'in_progress' | 'queued';
  per_page?: number;
};

export type GetWorkflowRunArgs = RepoRef & {
  run_id: number;
};

export type WorkflowRunSummary = {
  id: number;
  name: string | null;
  head_branch: string | null;
  head_sha: string;
  status: string | null;
  conclusion: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
};

export function createOctokit(authToken: string, userAgent: string, baseUrl?: string) {
  return new Octokit({ auth: authToken, userAgent, baseUrl });
}

export async function dispatchWorkflow(octokit: Octokit, args: WorkflowDispatchArgs): Promise<{ ok: true }> {
  await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
    owner: args.owner,
    repo: args.repo,
    workflow_id: args.workflow_id,
    ref: args.ref,
    inputs: args.inputs
  });

  return { ok: true };
}

export async function listWorkflowRuns(
  octokit: Octokit,
  args: ListWorkflowRunsArgs
): Promise<{ total_count: number; workflow_runs: WorkflowRunSummary[] }> {
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
    owner: args.owner,
    repo: args.repo,
    workflow_id: args.workflow_id,
    branch: args.branch,
    status: args.status,
    per_page: args.per_page ?? 20
  });

  return {
    total_count: data.total_count,
    workflow_runs: (data.workflow_runs ?? []).map((run: any) => ({
      id: run.id,
      name: run.name ?? null,
      head_branch: run.head_branch ?? null,
      head_sha: run.head_sha,
      status: run.status ?? null,
      conclusion: run.conclusion ?? null,
      html_url: run.html_url,
      created_at: run.created_at,
      updated_at: run.updated_at
    }))
  };
}

export async function getWorkflowRun(octokit: Octokit, args: GetWorkflowRunArgs): Promise<WorkflowRunSummary> {
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    owner: args.owner,
    repo: args.repo,
    run_id: args.run_id
  });

  return {
    id: data.id,
    name: (data as any).name ?? null,
    head_branch: data.head_branch ?? null,
    head_sha: data.head_sha,
    status: data.status ?? null,
    conclusion: data.conclusion ?? null,
    html_url: data.html_url,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}
