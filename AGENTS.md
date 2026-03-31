<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Map For Agents

Use this map before editing:

- `src/components/Feed.js` - main client UI and local UX state.
- `src/app/api/posts/route.js` - create/list posts HTTP contract.
- `src/app/api/posts/[id]/like/route.js` - likes endpoint.
- `src/app/api/verify/route.js` - invite code verification.
- `src/lib/store.js` - persistence boundary (Redis or memory fallback).
- `src/lib/config.js` - categories, invite code, URL validation.

## Documentation Entry Points

- `docs/01-overview.md`
- `docs/02-architecture.md`
- `docs/03-persistence.md`
- `docs/04-api.md`
- `docs/05-frontend-flows.md`
- `docs/06-dev-workflow.md`
- `docs/07-ai-context.md`

## Working Rules

1. Respect layer boundaries:
   - UI in `src/app` and `src/components`
   - API contract in `src/app/api`
   - persistence in `src/lib/store.js`
2. If API payload/response changes, update `docs/04-api.md`.
3. If data model/persistence changes, update `docs/03-persistence.md`.
4. If user flow changes, update `docs/05-frontend-flows.md`.
5. Run `npm run test` after significant logic changes.
