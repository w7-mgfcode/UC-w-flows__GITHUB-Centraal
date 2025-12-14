export type PipelineMcpEnv = {
  githubToken: string;
  defaultOwner?: string;
  defaultRepo?: string;
  githubApiBaseUrl?: string;
  userAgent: string;
};

export function readEnv(env: NodeJS.ProcessEnv): PipelineMcpEnv {
  const githubToken = env.GITHUB_TOKEN || '';
  if (!githubToken) {
    throw new Error('Missing required env var: GITHUB_TOKEN');
  }

  return {
    githubToken,
    defaultOwner: env.GITHUB_OWNER || undefined,
    defaultRepo: env.GITHUB_REPO || undefined,
    githubApiBaseUrl: env.GITHUB_API_BASE_URL || undefined,
    userAgent: env.MCP_USER_AGENT || 'pipeline-mcp/0.1.0'
  };
}
