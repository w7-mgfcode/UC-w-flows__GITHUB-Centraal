# Global Development Rules

## Workflow Policy (Non-Negotiable)
- Never push to `main`; always use short-lived branches and pull requests.
- Every PR must include: problem statement, test plan, and rollback plan.
- Every PR must pass required checks: lint, unit tests, and build (plus any security checks configured).
- Prefer small PRs (single concern) and avoid bundling unrelated changes.
- Require at least 1 human approval in addition to any AI reviews.
- When changes affect behavior, APIs, configs, or pipelines, update `specs/` in the same PR.

## Code Quality Standards
- All code must pass linting (`pylint` for Python, `eslint` for JavaScript)
- Minimum test coverage: 80%
- All functions require docstrings (Python) or JSDoc (JavaScript)
- No hardcoded secrets or API keys
- Maximum file size: 500 lines (aim for 200-300)
- DRY principle - no copy-paste code

## Git & PR Standards

### Branch Naming
```
feature/description       - New features
bugfix/description        - Bug fixes
hotfix/critical-fix       - Production hotfixes
release/version           - Release branches
docs/description          - Documentation only
test/description          - Test improvements
refactor/description      - Code refactoring
```

### Commit Messages
All commits must follow format:
```
[TYPE] Brief description of change

Optional: Longer explanation if needed
- List any related issues
- Explain reasoning if not obvious

Closes #123
```

**Types:** `[FEAT]` `[FIX]` `[DOCS]` `[TEST]` `[REFACTOR]` `[PERF]` `[SECURITY]`

### Pull Requests
- Title format: `[TYPE] Brief description`
- Description must include:
  - What changed
  - Why it changed
  - How to test
  - Links to related issues
- Minimum 1 approval required
- All CI checks must pass
- No merge conflicts

## Architecture Rules

### Code Organization
- **Separation of Concerns**: Components/modules have single responsibility
- **No Monoliths**: Break large files (>500 lines) into smaller modules
- **Testability**: Design code to be unit testable
- **Dependency Injection**: Pass dependencies explicitly, don't use globals

### SOLID Principles
- **S** - Single Responsibility: One reason to change
- **O** - Open/Closed: Open for extension, closed for modification
- **L** - Liskov Substitution: Derived classes usable as base classes
- **I** - Interface Segregation: Client-specific interfaces
- **D** - Dependency Inversion: Depend on abstractions

### Database & API
- Use migrations for schema changes
- API versions in URL: `/api/v1/`
- Consistent error response format
- Pagination for list endpoints (default 20, max 100)
- Rate limiting headers in responses

## Documentation Requirements

### README.md
- Module purpose
- Installation instructions
- Quick start example
- API documentation
- Configuration options

### Code Comments
- Comment "why", not "what"
- Explain complex algorithms
- Document assumptions
- Mark TODO/FIXME with deadline if possible

### API Documentation
- All endpoints documented
- Request/response examples
- Error codes explained
- Authentication method clear

### CHANGELOG.md
- Version number (semantic versioning)
- Release date
- Added, Fixed, Changed, Removed sections
- Link to full comparison

## Security Standards

### Code-Level Security
- Input validation on all external data
- Output encoding/escaping before rendering
- Never log sensitive data
- Use parameterized queries (SQL injection prevention)
- CSRF tokens for state-changing operations

### Secrets Management
- Never commit credentials
- Use `.env` files locally (add to `.gitignore`)
- Use secrets in GitHub Actions
- Rotate tokens regularly

### Dependencies
- Keep dependencies updated
- Monitor for security vulnerabilities
- Use dependency lock files (package-lock.json, poetry.lock)
- Scan dependencies regularly with `npm audit` or similar

### API Security
- HTTPS only in production
- API keys in headers, not URLs
- Rate limiting to prevent abuse
- CORS properly configured

## Testing Standards

### Unit Tests
- Minimum coverage: 80%
- Test happy path and error cases
- Mock external dependencies
- Use descriptive test names

### Integration Tests
- Test component interactions
- Use test fixtures/factories
- Clean up test data after each test

### E2E Tests
- Critical user workflows only
- Run on staging before production
- Clear success criteria

## Performance Standards

### Code Performance
- Database queries optimized (use indexes)
- API responses < 200ms (P95)
- Frontend bundle size < 500KB gzipped
- Images optimized and lazy-loaded

### Monitoring
- Error tracking (Sentry, etc.)
- Performance monitoring
- Log aggregation
- Alerting for critical issues

## Deployment Standards

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] No security warnings
- [ ] Database migrations prepared
- [ ] Deployment documented
- [ ] Rollback plan ready

### Rollback Procedures
- Plan for every deployment
- Keep previous version running
- Monitor metrics after deployment
- Quick rollback if needed

## Team Standards

### Code Reviews
- Review within 24 hours
- Be respectful and constructive
- Don't block for style preferences
- Approve when ready to merge

### Communication
- Use issue discussions for decisions
- Document discussions in PR comments
- Post-mortems for critical issues
- Knowledge sharing in wiki/docs

### Meetings
- Stand-ups: async-first, daily
- Planning: weekly
- Retrospectives: bi-weekly
- Architecture reviews: as needed
