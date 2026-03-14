# Project: FixGuide Lab

A tech-support + student engineering projects site with community verification and an AI assistant.

## Non-negotiables
- Safety-first: OS guides must assume data-loss risk. For destructive steps, require backups and explicit user acknowledgement.
- No piracy or bypassing licensing/security protections.
- Accuracy discipline: never claim "tested" unless there is a test procedure + a recorded test run note. Everything must have a TestingStatus: Draft | InternallyTested | CommunityVerified.
- Accessibility: pages must meet basic a11y (semantic headings, focus states, alt text).
- Performance: aim for fast LCP and minimal JS on content pages.

## Architecture
- Frontend: Next.js (App Router), TypeScript, Tailwind, MDX for guides content, server components where possible.
- Backend: Supabase (Postgres, Auth, Storage). Use Row Level Security (RLS). Use edge-safe patterns.
- API: Next.js Route Handlers (/app/api/*) with Zod validation. Shared typed contract in /packages/contracts.
- Search: Postgres full-text + ilike search for MVP.
- AI: server-side API route with retrieval from guides + community notes, safety gate, source citation.

## Repo workflow
- Always inspect the current repo tree and existing code first.
- Work in small commits. Keep diffs reviewable.
- Add tests for critical logic (schema validation, API handlers, permission rules).

## Definition of Done
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass locally.
- Seed data exists so pages render.

## Coordination protocol
- Backend owns: database schema/migrations, auth policies, APIs, AI endpoint, moderation rules.
- Frontend owns: UI, routes, MDX rendering, forms, client UX, admin/mod screens.
- Shared contract: `/packages/contracts` (Zod schemas + TypeScript types)
- Breaking changes to shared contract require updating both contract + consuming code.
