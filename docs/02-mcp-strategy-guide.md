# Deep Research: MCP Servers & Chain Architecture for GitHub Repo Management

**Last Updated:** December 14, 2025  
**Purpose:** Comprehensive guide on MCP server selection, orchestration patterns, and best practices for AI-driven GitHub repository governance with CI/CD automation.

---

## Executive Summary

Model Context Protocol (MCP) servers act as **bridges between AI agents (Claude, Copilot) and external tools** (GitHub, filesystem, databases, CI/CD pipelines). For your use case—automating PR review, test validation, and pipeline coordination—you need a **carefully orchestrated chain of MCP servers** that work together seamlessly.

**Recommended MCP Stack for Your Use Case:**
1. **GitHub MCP Server** (official, by GitHub) → Repository, PR, issue management
2. **Filesystem MCP Server** (official) → Local specs/, test results, config access
3. **Git MCP Server** (by Anthropic) → Local commit history, branch operations
4. **Custom Pipeline MCP Server** (DIY or vendor) → GitHub Actions coordination, test result parsing
5. *(Optional)* **Database MCP Server** → Audit logs, PR metrics storage

---

## 📋 Document Highlights

## Core Sections

1. **MCP Architecture Fundamentals**
  - What MCP is and why it matters for your workflow
  - Client-server model diagram
  - Transport layers (Stdio vs HTTP/SSE)

2. **Recommended MCP Stack (5 Servers)**
  - ✅ **GitHub MCP** (official) → PR/issue/code management
  - ✅ **Filesystem MCP** (official) → specs/, tests/, config access
  - ✅ **Git MCP** (by Anthropic) → Local branch/commit operations
  - ✅ **Custom Pipeline MCP** (DIY) → GitHub Actions coordination + test results
  - ⏳ **Database MCP** (optional) → Audit logs & metrics

3. **MCP Orchestration Patterns**
  - **Pattern 1: Sequential/Reactive** (flexible but higher token cost)
  - **Pattern 2: Proactive Planning** (fast but less flexible)
  - **Pattern 3: Hybrid** (recommended for this use case)
  - Detailed workflow examples with code

4. **State Management (3 approaches)**
  - Resource Links (recommended)
  - Structured Plan Objects
  - Session-Based State

5. **Best Practices**
  - Security & access control
  - Error handling & resilience with code
  - Observability & debugging with JSON audit logs
  - Testing & integration tests (Python examples)
  - Performance optimization (caching, batching, parallelism)

6. **Complete Configuration Examples**
  - VS Code `.vscode/settings.json` with all 4 MCP servers configured
  - `.env` template
  - Custom Pipeline MCP server implementation (Node.js + Octokit)
  - `AGENTS.md` example with PR review workflow

7. **Deployment & Operations**
  - Step-by-step Remote-SSH setup
  - Ubuntu server dependency installation
  - Testing each MCP server in isolation

## Key Workflow Example

```text
User: "Review PR #42 and merge if tests pass"
  ↓
Step 1: GitHub MCP → fetch PR details, changed files
Step 2: Filesystem MCP → read specs/global-rules.md
Step 3: Git MCP → check commit history
Step 4: Pipeline MCP → trigger CI, poll test results
Step 5: GitHub MCP → post review, approve, merge if allowed
  ↓
Result: Fully audited, compliance-checked, auto-merged PR
```

---

## 🎯 Next Steps

1. Configure the 4 MCP servers in `.vscode/settings.json` (template provided)
2. Build the custom Pipeline MCP server (code in Part 2.4)
3. Create `AGENTS.md` at repo root (example in Part 5)
4. Test each MCP in VS Code Copilot Chat:
  ```text
  @github list repositories
  read specs/global-rules.md
  show recent commits
  trigger workflow ci.yml
  ```
5. Run integration tests to verify the chain works end-to-end

*This document is stored at `docs/02-mcp-strategy-guide.md`.*

## Part 1: MCP Architecture Fundamentals

### 1.1 What is MCP?

**Model Context Protocol** is a standardized, open protocol (JSON-RPC 2.0 based) that allows:
- **AI hosts** (Claude Desktop, VS Code Copilot, Cursor IDE) to **securely communicate** with external services
- **Stateful interactions** with tools, resources, and prompts
- **Composability**: multiple MCP servers can run in parallel, each with distinct responsibilities

**Key Benefit:** Your AI agent (e.g., Copilot Agent in VS Code) can now:
- Read your GitHub issues
- Fetch your test results from CI/CD
- Check your specs in the repo
- Create/update PRs with automated reviews baked in
- Validate branch policies without manual intervention

### 1.2 MCP Architecture: Client-Server Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     MCP Host                                    │
│          (Claude Desktop, VS Code, Cursor IDE)                 │
└──────┬──────────────────────────────────────────────────────┬───┘
       │                                                      │
       │ JSON-RPC 2.0 Messages                              │
       │ (Stdio or HTTP/SSE)                                │
       │                                                      │
  ┌────▼────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐
  │ GitHub  │  │Filesystem│  │   Git    │  │  Pipeline  │
  │   MCP   │  │   MCP    │  │   MCP    │  │  MCP (DIY) │
  │ Client  │  │ Client   │  │ Client   │  │ Client     │
  └────┬────┘  └────┬─────┘  └────┬─────┘  └────────────┘
       │            │             │              │
  ┌────▼────┐  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
  │ GitHub  │  │Local FS  │  │ Git Repo │  │ GitHub   │
  │  API    │  │(specs/)  │  │(local)   │  │Actions   │
  │(remote) │  │(tests/)  │  │          │  │(REST API)│
  └─────────┘  └──────────┘  └──────────┘  └──────────┘

Legend:
- MCP Clients: Handle session management, tool invocation
- MCP Servers: Expose tools, resources, prompts to the host
```

### 1.3 Transport Layers

**Stdio Transport** (local, optimal performance):
- Direct process-to-process communication
- No network overhead
- Used for local tools (Filesystem, Git)
- Example: `command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "/path"]`

**HTTP/SSE Transport** (remote or high-security):
- Client sends JSON-RPC via HTTP POST
- Server streams responses via Server-Sent Events
- Used for remote services (GitHub API)
- Authentication: OAuth, Personal Access Tokens, API Keys

---

## Part 2: Recommended MCP Servers for Your Stack

### 2.1 GitHub MCP Server (Official)

**Status:** Official, maintained by GitHub  
**Language:** Go (reference implementation)  
**Purpose:** Manage repositories, PRs, issues, code scanning, discussions  
**Authentication:** OAuth or Personal Access Token (PAT)

#### Features
- **Repository Management:**
  - List repositories
  - Create/fork repositories
  - Search code across repos
  
- **PR/Issue Operations:**
  - Create, update, close PRs
  - Add comments/reviews to PRs
  - Fetch PR diff, commit messages
  - Manage PR labels, milestones, assignees
  
- **Code Operations:**
  - Read file contents
  - Create/update files atomically (batch commit)
  - Retrieve commit history
  
- **Security Integration:**
  - Access code scanning alerts (GitHub Advanced Security)
  - Retrieve secret scanning results
  - List SBOM data

#### Configuration Example
```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "type": "http"
    }
  }
}
```

**Setup (VS Code):**
1. Install GitHub Copilot extension
2. Settings → Integrations → Add MCP Server
3. Select "GitHub" from marketplace
4. Authenticate with GitHub account (OAuth)
5. Test: Use Copilot Chat → `@github list my repositories`

#### Best Practices
- **Use repository-specific tokens** for sensitive repos (reduce blast radius)
- **Scope PAT to minimal permissions:** `repo:read`, `pull_requests:write`, `issues:read`
- **Cache PR/issue metadata locally** to reduce API rate-limit pressure (GitHub allows 5,000 requests/hour)
- **Use PR templates** (`.github/pull_request_template.md`) to pre-populate issue context for the AI agent

---

### 2.2 Filesystem MCP Server (Official)

**Status:** Official, by Anthropic  
**Language:** TypeScript  
**Purpose:** Secure read/write access to local files and directories  
**Transport:** Stdio (local only)

#### Features
- **File Operations:**
  - List directory contents
  - Read files (with line numbers)
  - Write/create files
  - Edit files (replace old text with new)
  - Move, delete, search files
  - Get file metadata
  
- **Batch Operations:**
  - Create multiple files in a single operation
  - Search across multiple files with regex

#### Configuration Example
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/my-repo/specs",
        "/home/user/my-repo/tests",
        "/home/user/my-repo/.github"
      ]
    }
  }
}
```

**Restrict to specific directories** (security):
- Pass only the paths the agent needs access to
- `/home/user/my-repo/specs` → for reading AGENTS.md, global-rules.md, pipeline.md
- `/home/user/my-repo/tests` → for reading test outputs, coverage reports
- `/home/user/my-repo/.github` → for reading/writing CI configs

#### Best Practices
- **Never expose `/home/user` root** or system directories
- **Use read-only mounts** (via Docker) for sensitive config directories
- **Validate file writes** against allowed patterns (e.g., only `.md` in specs/, only `.yml` in `.github/workflows/`)
- **Archive old test results** (don't keep >100 files in test output dir, wastes context tokens)

---

### 2.3 Git MCP Server (by Anthropic)

**Status:** Official, maintained by Anthropic  
**Language:** Python  
**Purpose:** Git operations on local repositories  
**Transport:** Stdio (local only)

#### Features
- **Repository Discovery:**
  - List all repositories in a directory (via `GIT_REPOS_PATH`)
  
- **Commit Operations:**
  - Get commit history (hash, author, date, message)
  - Retrieve commit details (files changed, diff)
  
- **Branch Management:**
  - List branches
  - Create/delete branches
  - Get current branch
  
- **Tagging:**
  - Create lightweight or annotated tags
  - List tags
  - Delete tags
  
- **Stash & Rebase:**
  - Stash changes
  - Apply stash
  - Interactive rebase (complex, but powerful)

#### Configuration Example
```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"],
      "env": {
        "GIT_REPOS_PATH": "/home/user/my-repos"
      }
    }
  }
}
```

**Setup on Ubuntu:**
```bash
# Install Python MCP server
pip install mcp-server-git

# Configure GIT_REPOS_PATH in .env or shell
export GIT_REPOS_PATH="/home/user/my-repos"
```

#### Best Practices
- **Set `GIT_REPOS_PATH` narrowly** (e.g., `/home/user/my-repos`, not `/home/user`)
- **Use for local branch inspection** (don't fetch from remote; let GitHub MCP handle that)
- **Combine with GitHub MCP** for a two-step workflow:
  1. Git MCP checks local branches and commit history
  2. GitHub MCP pushes/opens PR on remote
- **Protect `main` and `develop` branches** (Git MCP respects `.gitprotect` files if you add them)

---

### 2.4 Custom Pipeline MCP Server (DIY or Vendor)

**Status:** Custom/Community  
**Purpose:** GitHub Actions coordination, test result parsing, CI/CD status polling  
**Transport:** HTTP (calls GitHub Actions REST API)

#### Why Custom?
- **No off-the-shelf MCP server** fully covers GitHub Actions + test result aggregation
- **You control the logic:** fetch action runs, parse logs, post results back to PR

#### What It Should Expose (Tools)
```
1. get_latest_workflow_runs(repo, workflow_id, limit=5)
   → Returns: [{ id, name, status, created_at, conclusion }]

2. get_workflow_run_logs(repo, run_id)
   → Returns: { logs, status, failure_reason, duration_seconds }

3. trigger_workflow(repo, workflow_id, branch, inputs={})
   → Returns: { run_id, status }

4. get_test_results(repo, run_id)
   → Returns: { passed: N, failed: N, skipped: N, details: [...] }

5. post_pr_check_status(repo, pr_number, check_name, status, details)
   → Adds status check to PR; required by branch protection rules

6. aggregate_code_review(repo, pr_number, coderabbit_comment, sourcery_comment)
   → Combines multiple AI review tools' output into single PR comment
```

#### Simplified Implementation (Node.js + Octokit)
```javascript
// custom-pipeline-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const server = new Server({
  name: 'pipeline-server',
  version: '1.0.0',
});

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      {
        name: 'get_latest_workflow_runs',
        description: 'Fetch latest GitHub Actions workflow runs for a repo',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            workflow_id: { type: 'string' },
            limit: { type: 'number', default: 5 },
          },
          required: ['owner', 'repo', 'workflow_id'],
        },
      },
      {
        name: 'post_pr_check_status',
        description: 'Post a check status to a PR (required for branch protection)',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            repo: { type: 'string' },
            pr_number: { type: 'number' },
            check_name: { type: 'string' },
            status: { enum: ['pending', 'success', 'failure'] },
            details: { type: 'string' },
          },
          required: ['owner', 'repo', 'pr_number', 'check_name', 'status'],
        },
      },
    ],
  })
);

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    if (request.params.name === 'get_latest_workflow_runs') {
      const { owner, repo, workflow_id, limit } = request.params.arguments;
      const resp = await octokit.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id,
        per_page: limit,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp.data.workflow_runs.map(run => ({
              id: run.id,
              name: run.name,
              status: run.status,
              conclusion: run.conclusion,
              created_at: run.created_at,
              html_url: run.html_url,
            })), null, 2),
          },
        ],
      };
    }
    if (request.params.name === 'post_pr_check_status') {
      const { owner, repo, pr_number, check_name, status, details } = request.params.arguments;
      // Use check runs API to post status
      const resp = await octokit.checks.create({
        owner,
        repo,
        name: check_name,
        head_sha: (await octokit.pulls.get({ owner, repo, pull_number: pr_number })).data.head.sha,
        status: status === 'pending' ? 'in_progress' : 'completed',
        conclusion: status === 'pending' ? undefined : status,
        output: { title: check_name, summary: details },
      });
      return {
        content: [{ type: 'text', text: `Check posted: ${resp.data.html_url}` }],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

#### Configuration
```json
{
  "mcpServers": {
    "pipeline": {
      "command": "node",
      "args": ["/path/to/custom-pipeline-mcp-server.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    }
  }
}
```

#### Best Practices
- **Rate-limit awareness:** GitHub Actions API allows 5,000 requests/hour; batch queries
- **Async operation:** Don't block Copilot Chat waiting for a 10-minute workflow; return "triggered, check status later"
- **Error recovery:** If GitHub API is down, gracefully degrade (cache last known state)
- **Audit logging:** Log all check postings for compliance

---

## Part 3: MCP Chain Architecture & Orchestration Patterns

### 3.1 What is MCP Chaining?

**MCP Chaining** = connecting the output of one MCP server as input to another, forming a **workflow or pipeline**.

**Example Workflow:**
```
User asks Copilot Agent:
  "Review the PR #42, run tests, and merge if all pass"

Step 1 (GitHub MCP)
  → Fetch PR #42 details, target branch, changed files

Step 2 (Filesystem MCP)
  → Read specs/global-rules.md to understand review criteria
  → Read tests/test-suite.md to understand what "all pass" means

Step 3 (Git MCP)
  → Get commit history of PR branch vs main
  → Identify files changed in this PR

Step 4 (Pipeline MCP)
  → Trigger CI workflow: "github.com/owner/repo/actions/workflows/ci.yml"
  → Poll workflow run until completion (wait max 30min)
  → Fetch test results (pass/fail counts)

Step 5 (GitHub MCP)
  → Post PR comment with review: "✅ All tests passed. Details: ..."
  → If tests passed AND PR changes comply with global-rules.md:
     - Approve PR (post review with APPROVE verdict)
     - Trigger merge (if branch protection is satisfied)
  → If tests failed:
     - Suggest fixes based on logs
     - Request changes (post review with REQUEST_CHANGES verdict)

Result:
  → User sees PR auto-merged or auto-reviewed with reasoning
  → Everything logged in specs/pr-audit.log
```

### 3.2 Orchestration Patterns

#### Pattern 1: Sequential/Reactive Chaining (Most Flexible, Higher Token Cost)

**Flow:** Agent reasons step-by-step; each MCP server invocation leads to the next.

```
Agent: "Get PR details"
  ↓ GitHub MCP.get_pr() → PR details + file list
Agent: "Read the global rules to understand what to check"
  ↓ Filesystem MCP.read_file("specs/global-rules.md") → Rules
Agent: "Check if PR violates rules"
  ↓ Agent logic (in-context reasoning)
Agent: "Run tests"
  ↓ Pipeline MCP.trigger_workflow() → Workflow started
Agent: "Poll until done"
  ↓ Pipeline MCP.poll_workflow_status() → Still running...
  ↓ [repeat until complete]
Agent: "Post review comment"
  ↓ GitHub MCP.create_pr_review() → Comment posted
```

**Pros:**
- Flexible: agent can adapt based on each result
- Debuggable: easy to see why agent made each decision
- Error recovery: agent can catch failures and retry

**Cons:**
- Higher token cost (multiple reasoning steps)
- Slower (round-trip latency for each step)

**Use When:** PR logic is complex, exceptions are common, you need full observability.

---

#### Pattern 2: Proactive Planning (Lower Token Cost, Deterministic)

**Flow:** Agent creates a "plan" once, then executes it step-by-step.

```
Agent: "Create a plan to review and merge PR #42"
  ↓ Agent generates plan (JSON structure):
  {
    "steps": [
      { "id": "step1", "tool": "github", "action": "get_pr", "params": { "pr": 42 } },
      { "id": "step2", "tool": "filesystem", "action": "read_file", "params": { "path": "specs/global-rules.md" } },
      { "id": "step3", "tool": "pipeline", "action": "trigger_workflow", "depends_on": "step1" },
      { "id": "step4", "tool": "pipeline", "action": "poll_workflow", "depends_on": "step3", "timeout_sec": 1800 },
      { "id": "step5", "tool": "github", "action": "post_review", "depends_on": ["step2", "step4"] }
    ]
  }

Execution:
  step1 → GitHub MCP.get_pr() ✓
  step2 → Filesystem MCP.read_file() ✓
  step3 → Pipeline MCP.trigger_workflow() ✓
  step4 → [waits for step3] Pipeline MCP.poll_workflow() ✓
  step5 → [waits for step2 & step4] GitHub MCP.post_review() ✓
```

**Pros:**
- Lower token cost (plan once, execute many times)
- Faster (parallel execution where dependencies allow)
- Reproducible: same plan always produces same result

**Cons:**
- Less flexible: can't adapt to unexpected errors
- Requires explicit dependency tracking

**Use When:** PR workflow is predictable, you prioritize speed and cost, you have high volume.

---

#### Pattern 3: Hybrid (Recommended for Your Use Case)

**Flow:** Plan the high-level flow, but allow agent reasoning within each major phase.

```
Phase 1: Analyze PR (Deterministic Planning)
  → Generate plan: fetch PR, read rules, read architecture docs
  
Phase 2: Run Tests (Deterministic Execution)
  → Trigger CI, poll with timeout
  
Phase 3: Post Review (Reactive Reasoning)
  → Based on test results, decide:
      - If all pass: approve and suggest merge
      - If fail: analyze logs, suggest fixes, request changes
      - If timeout: escalate to human

Audit Trail:
  → Log plan → Log phase execution → Log final decision
```

**Pros:**
- Balances speed (deterministic phases) with flexibility (reactive decisions)
- Clear audit trail for compliance
- Handles exceptions gracefully

**Cons:**
- Slightly more complex to implement

---

### 3.3 State Management Patterns

**Challenge:** MCP servers are stateless; how do you pass data between steps?

#### Option A: Resource Links (Recommended)

Tool outputs include URIs that other tools understand:

```json
// GitHub MCP output:
{
  "pr_id": "pr_abc123",
  "resource_link": "github://owner/repo/pulls/42"
}

// Pipeline MCP tool accepts resource_link:
post_pr_check_status({
  "resource_link": "github://owner/repo/pulls/42",
  "check_name": "integration-tests",
  "status": "success"
})

// Filesystem MCP output:
{
  "file_path": "specs/global-rules.md",
  "resource_link": "file:///home/user/my-repo/specs/global-rules.md"
}
```

**Pros:** Clean, URI-based, easy to reason about

---

#### Option B: Structured Plan Objects

Agent creates a plan object that explicitly maps outputs to inputs:

```json
{
  "plan_id": "plan_xyz",
  "tasks": {
    "fetch_pr": {
      "tool": "github",
      "action": "get_pr",
      "params": { "owner": "myorg", "repo": "myproject", "pr_number": 42 }
    },
    "check_rules": {
      "tool": "filesystem",
      "action": "read_file",
      "params": { "path": "specs/global-rules.md" }
    },
    "run_ci": {
      "tool": "pipeline",
      "action": "trigger_workflow",
      "params": {
        "workflow_file": ".github/workflows/ci.yml",
        "branch": "tasks.fetch_pr.outputs.head_branch"  // Explicit mapping!
      }
    }
  }
}
```

**Pros:** Explicit, traceable, no ambiguity

---

#### Option C: Session-Based State (Most Secure)

Server stores state on behalf of client; client receives opaque token:

```
Client: "Save these PR details for later"
Server: "Stored. Token: sess_abc123"

[Later...]

Client: "Retrieve state for sess_abc123"
Server: "Here's the PR data"
```

**Pros:** Server controls data lifecycle, GDPR-friendly, scalable

**Cons:** Requires server-side storage

---

## Part 4: Best Practices for MCP-Driven Repo Management

### 4.1 Security & Access Control

1. **Principle of Least Privilege**
   - GitHub PAT: scoped to `repo:read`, `pull_requests:write`, `issues:read` only
   - Filesystem: restrict to `/specs`, `/tests`, `/.github` only
   - Never expose secrets or SSH keys to MCP servers

2. **Rate Limiting**
   - GitHub API: 5,000 requests/hour per token
   - Implement local caching of PR metadata (1-hour TTL)
   - Batch queries: fetch all issues once instead of one-by-one

3. **Audit Logging**
   - Every MCP tool invocation → log to `specs/mcp-audit.log`
   - Format: `[ISO8601] {agent_id} {tool} {action} {result} {duration_ms}`
   - Periodically archive old logs (keep last 90 days)

4. **Token Rotation**
   - Store PAT in `.env` (never in code or docs)
   - Rotate PAT quarterly
   - Use GitHub's fine-grained PATs (narrower scopes than classic PAT)

---

### 4.2 Error Handling & Resilience

```javascript
// Pseudocode: Resilient MCP chain execution
async function executePRReview(pr_number) {
  const plan = {
    steps: [
      { id: 'fetch_pr', tool: 'github', ... },
      { id: 'run_tests', tool: 'pipeline', ... },
      { id: 'post_review', tool: 'github', ... },
    ],
  };

  for (const step of plan.steps) {
    try {
      const result = await invokeToolWithRetry(step, { maxRetries: 3, backoffMs: 1000 });
      logAudit({ step_id: step.id, status: 'success', result });
    } catch (err) {
      logAudit({ step_id: step.id, status: 'failed', error: err.message });
      
      if (step.id === 'run_tests' && err.code === 'TIMEOUT') {
        // Gracefully degrade: post "tests in progress, check manually"
        await github.post_pr_comment({ pr: pr_number, message: '⏳ Tests still running...' });
        return { status: 'in_progress', escalate_to_human: false };
      }
      
      if (step.id === 'fetch_pr') {
        // Critical error: escalate
        return { status: 'failed', escalate_to_human: true, reason: err.message };
      }
    }
  }
}
```

---

### 4.3 Observability & Debugging

**What to Log:**
1. **Inputs:** What parameters did the agent pass to each MCP tool?
2. **Outputs:** What did each tool return?
3. **Reasoning:** Why did the agent make each decision?
4. **Timeline:** How long did each step take?
5. **Failures:** What errors occurred, and how were they handled?

**Log Structure:**
```json
{
  "timestamp": "2025-12-14T11:30:00Z",
  "session_id": "sess_abc123",
  "user": "developer@example.com",
  "action": "review_pr",
  "pr_number": 42,
  "steps": [
    {
      "step_id": "fetch_pr",
      "tool": "github",
      "start_ms": 0,
      "duration_ms": 250,
      "status": "success",
      "result": { "pr_id": "pr_xyz", "author": "john.doe", "files_changed": 5 }
    },
    {
      "step_id": "run_tests",
      "tool": "pipeline",
      "start_ms": 250,
      "duration_ms": 45000,
      "status": "success",
      "result": { "passed": 127, "failed": 0, "duration_sec": 43 }
    }
  ],
  "final_decision": "approve_and_merge",
  "audit_notes": "All tests passed, changes comply with global-rules.md"
}
```

---

### 4.4 Testing & Validation

**Test Each MCP Server in Isolation:**

```bash
# Test GitHub MCP
> copilot chat: "@github list my repositories"
# Should return list of repos

# Test Filesystem MCP
> copilot chat: "read specs/global-rules.md"
# Should return file contents

# Test Git MCP
> copilot chat: "show recent commits in my-repo"
# Should return last 5-10 commits

# Test Pipeline MCP
> copilot chat: "trigger workflow ci.yml on branch main"
# Should return workflow run ID
```

**Integration Tests:**

```python
# test_mcp_chain.py
import asyncio
from mcp_client import MCPClient

async def test_pr_review_chain():
    """Test the full PR review workflow"""
    client = MCPClient()
    
    # Setup
    pr_number = 42
    
    # Step 1: Fetch PR
    pr = await client.invoke_tool('github', 'get_pr', {'pr_number': pr_number})
    assert pr['id'] == 'pr_xyz'
    
    # Step 2: Read rules
    rules = await client.invoke_tool('filesystem', 'read_file', {'path': 'specs/global-rules.md'})
    assert 'PR must include test' in rules
    
    # Step 3: Trigger CI
    run = await client.invoke_tool('pipeline', 'trigger_workflow', {
        'workflow_id': 'ci.yml',
        'branch': pr['head_branch']
    })
    assert run['status'] in ['in_progress', 'queued']
    
    # Step 4: Poll until done (max 30sec for test)
    for _ in range(30):
        status = await client.invoke_tool('pipeline', 'get_workflow_status', {'run_id': run['id']})
        if status['conclusion']:  # completed
            break
        await asyncio.sleep(1)
    
    assert status['conclusion'] == 'success'
    
    # Step 5: Post review
    review = await client.invoke_tool('github', 'post_pr_review', {
        'pr_number': pr_number,
        'verdict': 'APPROVE',
        'body': '✅ All checks passed'
    })
    assert review['state'] == 'APPROVED'
    
    print("✅ PR review chain test passed")

if __name__ == '__main__':
    asyncio.run(test_pr_review_chain())
```

---

### 4.5 Performance Optimization

**Reduce Context Token Usage:**
1. **Summarize file contents** before sending to agent
   - Don't send entire `global-rules.md`; extract relevant sections
   - Example: Agent asks "Does PR #42 change database schema?" → Pre-extract schema rules only

2. **Cache immutable data**
   - GitHub org info, branch protection rules, team membership → refresh hourly
   - Store in Redis or local SQLite

3. **Batch operations**
   - Instead of: list 50 repos one-by-one
   - Use: GitHub API pagination, fetch all at once

4. **Parallel MCP invocations**
   - GitHub MCP and Filesystem MCP are independent → invoke both simultaneously
   - Wait for both to complete before proceeding

---

## Part 5: Example MCP Chain Configuration

**Complete configuration for your setup (VS Code + Ubuntu server SSH):**

### `.vscode/settings.json` (on Ubuntu server or local via Remote-SSH)

```json
{
  "[python]": {
    "defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python"
  },
  "github.copilot.enable": {
    "*": true,
    "plaintext": true,
    "markdown": true
  },
  "modelContextProtocol": {
    "servers": {
      "github": {
        "type": "http",
        "url": "https://api.githubcopilot.com/mcp/",
        "auth": "oauth"
      },
      "filesystem": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "${workspaceFolder}/specs",
          "${workspaceFolder}/tests",
          "${workspaceFolder}/.github"
        ]
      },
      "git": {
        "command": "uvx",
        "args": ["mcp-server-git"],
        "env": {
          "GIT_REPOS_PATH": "${workspaceFolder}"
        }
      },
      "pipeline": {
        "command": "node",
        "args": ["${workspaceFolder}/.mcp-servers/pipeline-server.js"],
        "env": {
          "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
        }
      }
    }
  }
}
```

### `.env` (root of repo)

```bash
# GitHub MCP authentication
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Copilot instructions
COPILOT_SYSTEM_PROMPT="You are RepoOps Copilot. Your job is to automate PR review, testing, and validation. Always consult specs/ before making decisions."
```

### `.mcp-servers/pipeline-server.js` (custom pipeline MCP)

See **Section 2.4** for full implementation.

### `AGENTS.md` (root of repo)

```markdown
# Repo Agent Operating Rules

## Mission
Automate PR review, testing, and merging using GitHub MCP, Git MCP, Filesystem MCP, and Pipeline MCP.

## Tools Available
- **GitHub MCP:** Fetch PRs, post reviews, manage issues
- **Filesystem MCP:** Read specs/, global-rules.md, pipeline config
- **Git MCP:** Check commit history, branch info
- **Pipeline MCP:** Trigger CI, fetch test results, post checks

## Core Workflow

### When user asks: "Review PR #42"
1. Fetch PR details (GitHub MCP)
2. Read specs/global-rules.md to understand criteria (Filesystem MCP)
3. Check if PR violates any rules
4. Trigger CI workflow (Pipeline MCP)
5. Wait for tests (max 30 min)
6. Post review with reasoning (GitHub MCP)

### When user asks: "Merge PR #42 if tests pass"
1. Same as "Review PR #42"
2. If all tests pass AND PR complies with rules:
   - Post APPROVE review (GitHub MCP)
   - Trigger merge (if branch protection allows)
3. If tests fail:
   - Post REQUEST_CHANGES review with suggestions
   - Do NOT auto-merge

## Non-Negotiables
- Always read specs/global-rules.md before making decisions
- Never merge without running CI
- Never approve PRs that violate branch protection rules
- Log all actions to specs/mcp-audit.log
- If uncertain, escalate to human

## Emergency Escalation
If any of the following occur, immediately notify user and DO NOT proceed:
- GitHub API returns 5xx error
- Tests timeout after 30 minutes
- Branch protection rules change unexpectedly
- PR author is not in CODEOWNERS

## Commands to Support
- "review pr #N" → Execute review workflow
- "merge pr #N if tests pass" → Full PR review + merge
- "run tests on branch main" → Trigger CI on main
- "show recent deployments" → Fetch recent workflow runs
- "update pr #N with test results" → Post test summary to PR

## Success Metrics
- PR review completes within 5 minutes
- 95% of auto-merges are correct (no broken main)
- 0 false-positive approvals
```

---

## Part 6: Recommended MCP Stack Summary

| MCP Server | Purpose | Transport | Maintenance | Token Cost |
|--|--|--|--|--|
| **GitHub** | PR/issue/code management | HTTP (OAuth) | Official/Stable | Low (cached) |
| **Filesystem** | specs/, test results, config | Stdio | Official/Stable | Low |
| **Git** | Local commit history, branches | Stdio | Official/Stable | Low |
| **Pipeline (Custom)** | CI/CD coordination, test results | HTTP (PAT) | DIY | Medium (polling) |
| **Database (Optional)** | PR metrics, audit logs | HTTP/Stdio | DIY | Medium |

**Recommended Setup:**
- ✅ Start with GitHub + Filesystem + Git (official, stable)
- ✅ Add custom Pipeline MCP for CI/CD (build in phases)
- ⏳ Later: Add Database MCP for metrics/audit (once pipeline stable)

---

## Part 7: Deployment & Operations

### Step 1: Set Up VS Code Remote-SSH

**On Ubuntu Server:**
```bash
sudo apt-get update
sudo apt-get install openssh-server openssh-client
sudo systemctl start ssh
sudo systemctl enable ssh

# Verify
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
```

**On Local Workstation:**
```bash
# Add to ~/.ssh/config
Host ubuntu-server
  HostName 192.168.1.100  # Your Ubuntu LAN IP
  User your_username
  IdentityFile ~/.ssh/id_ed25519
  Port 22
```

**In VS Code:**
1. Install "Remote - SSH" extension
2. Ctrl+Shift+P → "Remote-SSH: Connect to Host" → Select `ubuntu-server`
3. Open Folder → `/home/your_username/my-repo`
4. VS Code now runs locally; Copilot + MCP run on server

---

### Step 2: Install Dependencies on Ubuntu Server

```bash
# Node.js (for MCP servers)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python (for Git MCP)
sudo apt-get install -y python3 python3-venv python3-pip

# Git
sudo apt-get install -y git

# VS Code
sudo apt-get install -y code

# Verify MCP servers
npm list -g @modelcontextprotocol/server-filesystem
pip list | grep mcp-server-git
```

---

### Step 3: Configure MCP in VS Code (Remote)

Copy `.vscode/settings.json` from **Section 5** to remote server.

Test:
```bash
# In VS Code terminal (on remote)
code . --inspect-extensions
# Should show MCP servers loading
```

---

### Step 4: Test Each MCP Server

In VS Code Copilot Chat:
```
@github list my repositories
[Should return list of repos]

read specs/global-rules.md from filesystem
[Should return file contents]

show recent commits in this repo
[Should return last 5-10 commits]
```

---

## Conclusion & Next Steps

**Your MCP Stack is:**
1. **GitHub MCP** (official) → PR/issue management
2. **Filesystem MCP** (official) → specs/ access
3. **Git MCP** (official) → Local git operations
4. **Custom Pipeline MCP** (DIY) → CI/CD automation
5. *(Optional)* **Database MCP** → Audit logs & metrics

**Best Practices:**
- Use hybrid orchestration (plan + react)
- Cache immutable data
- Log everything for audit
- Test each MCP in isolation before chaining
- Monitor token usage & GitHub API rate limits
- Rotate tokens quarterly

**Immediate Action Items:**
1. Set up VS Code Remote-SSH to Ubuntu server ✅
2. Install Node.js, Python, MCP CLI tools ✅
3. Configure MCP servers in `.vscode/settings.json` ✅
4. Create custom Pipeline MCP server ✅
5. Write integration tests ✅
6. Deploy to production with audit logging ✅

---

**References:**
- [MCP Documentation](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server)
- [VS Code MCP Support](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [Advanced MCP Patterns](https://www.getknit.dev/blog/advanced-mcp-agent-orchestration-chaining-and-handoffs)

