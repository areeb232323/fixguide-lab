# API Contract

All request/response types are defined in `/packages/contracts/src/schemas.ts` using Zod.

## Guides

### GET /api/guides
Query: `?query=&difficulty=&os=&tag=&page=1&limit=20`
Response: `{ data: Guide[], total: number, page: number, limit: number }`

### GET /api/guides/[slug]
Response: `{ data: Guide, comments: Comment[] }`

## Projects

### GET /api/projects
Query: `?query=&difficulty=&costMax=&tag=&page=1&limit=20`
Response: `{ data: Project[], total: number, page: number, limit: number }`

### GET /api/projects/[slug]
Response: `{ data: Project, parts: Part[], comments: Comment[] }`

## Comments

### POST /api/comments
Auth: Required
Body: `{ body: string, target_type: "guide"|"project"|"comment", target_id: uuid }`
Response: `{ data: Comment }` (201)

## Votes

### POST /api/votes
Auth: Required (idempotent upsert)
Body: `{ target_type: "guide"|"project"|"comment", target_id: uuid, value: 1|-1 }`
Response: `{ data: Vote }`

## Reports

### POST /api/reports
Auth: Required
Body: `{ target_type, target_id, reason: ReportReason, details: string }`
Response: `{ data: Report }` (201)

## Moderation

### GET /api/mod/queue
Auth: Moderator+
Query: `?status=pending&page=1&limit=20`
Response: `{ data: Report[], total: number, page: number, limit: number }`

### POST /api/mod/actions
Auth: Moderator+
Body: `{ report_id: uuid|null, action_type: ModActionType, target_type, target_id, reason: string }`
Response: `{ data: ModeratorAction }` (201)

## AI Assistant

### POST /api/ai/chat
Auth: Optional (rate-limited)
Body: `{ message: string, context_type?: "guide"|"project", context_id?: uuid }`
Response:
```json
{
  "answer_markdown": "...",
  "citations": [{ "type": "guide|project|note|official", "title": "...", "url_or_id": "..." }],
  "safety_warnings": ["..."],
  "follow_up_questions": ["..."]
}
```

## Error Responses
- 400: `{ error: string, details?: ZodFlattenedError }`
- 401: `{ error: "Authentication required" }`
- 403: `{ error: "Insufficient permissions" }`
- 404: `{ error: "... not found" }`
- 429: `{ error: "Too many requests..." }` + Retry-After header
- 500: `{ error: "Database error" | "..." }`
