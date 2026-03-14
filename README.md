# FixGuide Lab

Tech support guides, student engineering projects, community verification, and an AI assistant.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, MDX
- **Backend**: Supabase (Postgres, Auth, Storage), Next.js Route Handlers
- **Validation**: Zod (shared contracts in `/packages/contracts`)
- **Testing**: Vitest
- **CI**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- A Supabase project (free tier works)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Setup

```bash
pnpm install
pnpm dev
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations in order:
   - `supabase/migrations/00001_initial_schema.sql`
   - `supabase/migrations/00002_rls_policies.sql`
3. Run the seed data: `supabase/seed.sql`

Or use the Supabase CLI:

```bash
npx supabase db push
npx supabase db seed
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Run tests |

## Project Structure

```
app/
  page.tsx             Home (hero, featured content, mission)
  guides/              Guide listing + detail pages
  projects/            Project listing + detail pages
  about/               About page
  safety/              Safety guidelines
  code-of-conduct/     Community guidelines
  signin/              Sign in (mock auth)
  profile/             User profile + activity
  contribute/          Draft submission form
  moderation/          Report queue + mod actions
  api/
    guides/            GET list, GET [slug]
    projects/          GET list, GET [slug]
    comments/          POST create
    votes/             POST upsert
    reports/           POST create
    mod/queue/         GET moderation queue
    mod/actions/       POST moderator action
    ai/chat/           POST AI assistant
components/
  site-chrome.tsx      Header + Footer
  site-ui.tsx          Shared UI primitives
  interactive-widgets.tsx  Client-side step/parts/code widgets
  mdx-components.tsx   MDX component map
  mdx-renderer.tsx     Server-side MDX renderer
  comment-form.tsx     Community note submission
  vote-buttons.tsx     Helpful/unhelpful voting
  report-dialog.tsx    Content reporting modal
  ai-chat-panel.tsx    Floating AI assistant chat
  mobile-nav.tsx       Mobile navigation drawer
  mod-action-buttons.tsx  Moderation action buttons
src/content/
  guides/              5 MDX tech support guides
  projects/            5 MDX engineering projects
lib/
  auth.ts            Auth helpers + role checks
  api-utils.ts       Zod body/query parsing
  logger.ts          Structured request logging
  rate-limit.ts      In-memory rate limiter
  supabase/          Supabase client helpers
  ai/
    safety.ts        AI safety gate (risk detection)
    retrieval.ts     Context retrieval for AI
packages/
  contracts/src/
    enums.ts         Shared enums (roles, status, etc.)
    schemas.ts       Zod schemas for all API contracts
supabase/
  migrations/        SQL schema + RLS policies
  seed.sql           Sample data
__tests__/           Vitest tests
```

## API Surface

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/guides` | GET | Public | List guides with filters |
| `/api/guides/[slug]` | GET | Public | Guide detail + comments |
| `/api/projects` | GET | Public | List projects with filters |
| `/api/projects/[slug]` | GET | Public | Project detail + parts + comments |
| `/api/comments` | POST | Required | Create comment/note |
| `/api/votes` | POST | Required | Upvote/downvote (idempotent) |
| `/api/reports` | POST | Required | Report content |
| `/api/mod/queue` | GET | Moderator+ | View report queue |
| `/api/mod/actions` | POST | Moderator+ | Take moderation action |
| `/api/ai/chat` | POST | Optional | AI assistant with retrieval |

## Roles

| Role | Can Read | Can Comment/Vote | Can Create Content | Can Moderate |
|------|----------|------------------|--------------------|--------------|
| guest | Published | No | No | No |
| user | Published | Yes | No | No |
| contributor | Published + own drafts | Yes | Yes | No |
| moderator | All | Yes | Yes | Yes |
| admin | All | Yes | Yes | Yes |
