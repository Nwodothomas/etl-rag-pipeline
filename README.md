# ETL RAG Pipeline UI

Frontend workspace for a staged ETL pipeline UI that lets developers:

- upload files and URLs into Supabase storage
- inspect upload history
- trigger ingestion jobs for the RAG knowledge pipeline
- monitor ingestion logs before backend integration is finalized

This repository currently focuses on the UI and API boundary layer. The future backend handoff target is `rag-backend`.

## Current Scope

Implemented today:

- Next.js App Router UI
- Tailwind 4 styling setup
- Supabase-backed upload route
- upload history from the API
- ingestion trigger flow
- ingestion logs workspace
- Jest coverage for core success and failure states

Not yet production-complete:

- persistent ingestion job storage
- real `rag-backend` job execution
- durable metadata persistence for URL uploads
- authentication and multi-user access control

## Project Structure

```text
app/
  api/
    ingest/route.ts
    upload/route.ts
  ingest/
    IngestionLogs.tsx
    IngestionTriggerPanel.tsx
    IngestionWorkspace.tsx
    page.tsx
  upload/
    UploadForm.tsx
    UploadHistory.tsx
    UploadWorkspace.tsx
    page.tsx
components/
lib/
tests/
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you need.

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Supported fallback:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Recommended for production:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `SUPABASE_STORAGE_HISTORY_PREFIX`
- `RAG_BACKEND_BASE_URL`

Notes:

- Do not commit `.env.local`.
- Use the service role key only on the server.
- URL uploads are currently registered through the API contract but are not yet persisted to a durable metadata store.

## Local Development

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Run type checking:

```bash
npm run typecheck
```

Run a production build:

```bash
npm run build
```

## Docker

This repo now includes a production-oriented multi-stage `Dockerfile`.

Build the image:

```bash
docker build -t etl-rag-pipeline-ui .
```

Run the container:

```bash
docker run --rm -p 3000:3000 --env-file .env.local etl-rag-pipeline-ui
```

The container uses Next.js standalone output for a smaller runtime image.

## Operational Notes

- Upload history is read from Supabase storage object listings.
- File uploads are stored in the configured Supabase bucket.
- Ingestion jobs are currently kept in memory for UI development and contract validation.
- Restarting the app clears the current ingestion job list.
- The ingestion API is intentionally shaped so `rag-backend` can replace the in-memory store later with minimal UI changes.

## Handoff Checklist

Before handing this project to another developer or deploying it:

- create `.env.local` from `.env.example`
- confirm the Supabase bucket exists
- confirm storage permissions for server-side upload access
- set `SUPABASE_SERVICE_ROLE_KEY` for production
- set `RAG_BACKEND_BASE_URL` before replacing the ingestion stub with the real backend handoff
- run `npm test`
- run `npm run lint`
- run `npm run typecheck`
- run `npm run build`

## Implementation Roadmap

The staged build plan and design rationale are documented in [ETL_PIPELINE_UI_IMPLEMENTATION.md](/Users/mac/etl-rag-pipeline/ETL_PIPELINE_UI_IMPLEMENTATION.md).
