# ETL Pipeline UI Implementation Plan

## Goal

Build a production-ready UI for an ETL pipeline that allows developers to:

- upload files and URLs
- send them to Supabase storage through API routes
- review upload history and ingestion status
- trigger ingestion into the RAG backend
- monitor logs, failures, and retry states

This UI will integrate later with the backend repository `rag-backend`, but this phase focuses on the frontend application, its API boundary, and the user workflow.

## Current State

The current repository already has:

- Next.js App Router setup
- Tailwind 4 configured and working
- a basic `UploadForm`
- Jest test setup
- a Supabase client placeholder

The current repository does not yet match the desired target structure. We should build toward that structure in controlled stages rather than generating everything at once.

## Target Structure

```text
etl-rag-pipeline/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── upload/
│   │   ├── page.tsx
│   │   ├── UploadForm.tsx
│   │   └── UploadHistory.tsx
│   ├── ingest/
│   │   ├── page.tsx
│   │   └── IngestionLogs.tsx
│   ├── api/
│   │   ├── upload/route.ts
│   │   └── ingest/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── FileCard.tsx
│   ├── StatusBadge.tsx
│   └── Loader.tsx
├── lib/
│   ├── apiClient.ts
│   ├── supabaseClient.ts
│   └── types.ts
├── styles/globals.css
├── tests/
│   ├── upload.test.tsx
│   └── ingest.test.tsx
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.js
├── Dockerfile
└── README.md
```

## System Design

### 1. UI-first App Router architecture

We will use the Next.js App Router for:

- route-based screens like `/upload` and `/ingest`
- colocated UI and route logic
- server-backed API routes under `app/api`

Reason:
This keeps the frontend, API boundary, and route organization in one predictable structure while remaining easy to integrate with `rag-backend` later.

### 2. API boundary between UI and external systems

The UI should not talk directly to every external service from client components.

Instead:

- UI components call internal API routes
- API routes validate inputs
- API routes handle Supabase storage requests
- API routes later forward ingestion jobs to `rag-backend`

Reason:
This protects secrets, centralizes validation, and makes backend integration easier to swap or extend.

### 3. Typed domain model

We will define shared types for:

- uploadable asset
- upload request and response
- ingestion job
- ingestion status
- error payloads

Reason:
An ETL pipeline becomes hard to maintain quickly without consistent types across UI, API handlers, and tests.

### 4. Uploads and ingestion are separate concerns

We should model the flow in two steps:

1. upload asset to storage and register metadata
2. trigger ingestion and track processing state

Reason:
This separation mirrors real production pipelines. Upload failure and ingestion failure are different operational problems and should be visible independently.

### 5. Observability in the UI

The UI should expose:

- upload history
- file type
- source
- upload result
- ingestion result
- timestamps
- retry action

Reason:
A production ETL UI is not just about sending files. Developers need visibility into what happened and what failed.

### 6. Incremental extensibility for input sources

Inputs will eventually include:

- PDF
- DOC/DOCX
- XLS/XLSX
- TXT
- video
- URLs

Reason:
The data model and upload form should not be tightly coupled to only local file uploads. URLs and videos often need different validation and backend processing rules.

## Recommended Data Flow

```text
Developer UI
   |
   v
Upload page (`/upload`)
   |
   v
Next.js API route (`/api/upload`)
   |
   +--> Supabase bucket upload
   |
   +--> metadata response back to UI
   |
   v
Upload history / status
   |
   v
Ingest page (`/ingest`)
   |
   v
Next.js API route (`/api/ingest`)
   |
   +--> call `rag-backend`
   |
   +--> receive ingestion status / job id
   |
   v
Logs and knowledge-base pipeline tracking
```

## Staged Implementation Plan

### Stage 1: Foundation and typed project structure

Deliverables:

- create missing directories and files for the target UI structure
- define `lib/types.ts`
- define `lib/apiClient.ts`
- review `lib/supabaseClient.ts`
- create placeholder pages for `/upload` and `/ingest`
- create shared UI shell components like navbar and sidebar

Reason:
We need a stable structure before building behavior. This stage keeps later work from becoming scattered and inconsistent.

Exit criteria:

- routes render successfully
- shared types exist
- component and API file layout is in place

### Stage 2: Upload UI for local files and URLs

Deliverables:

- upgrade `UploadForm.tsx`
- support file and URL submission modes
- client-side validation for size, format, and required fields
- loading, success, and error states
- reusable status and loader components

Reason:
The upload interaction is the main entry point of the ETL workflow, so it must be reliable and understandable before wiring deeper backend behavior.

Exit criteria:

- developer can choose source type
- form validates correctly
- payloads are prepared consistently for API submission

### Stage 3: Upload API route and Supabase bucket integration

Deliverables:

- implement `app/api/upload/route.ts`
- accept multipart/form-data for files
- accept JSON for URL ingestion requests where appropriate
- upload files to Supabase bucket
- return structured upload metadata
- handle API errors cleanly

Reason:
This stage creates the real storage boundary and replaces the current placeholder logging behavior.

Exit criteria:

- uploaded file reaches Supabase
- response returns usable metadata
- UI reflects success and failure correctly

### Stage 4: Upload history and file state visibility

Deliverables:

- create `UploadHistory.tsx`
- build file cards and status badges
- show uploaded assets and their state
- support refresh or reload of history

Reason:
An ETL system without history becomes difficult to trust, debug, or operate.

Exit criteria:

- upload list is visible
- statuses are readable
- history component consumes consistent typed data

### Stage 5: Ingestion trigger and logs UI

Deliverables:

- create `/ingest` page
- create `IngestionLogs.tsx`
- implement `app/api/ingest/route.ts`
- define how UI sends selected upload metadata to `rag-backend`
- show ingestion progress, completion, and failure states

Reason:
Upload alone does not build a knowledge base. This stage connects stored assets to the actual RAG ingestion workflow.

Exit criteria:

- user can trigger ingestion
- UI shows ingestion results
- backend request contract is clearly defined

### Stage 6: Testing and failure handling

Deliverables:

- expand `tests/upload.test.tsx`
- add `tests/ingest.test.tsx`
- test happy path, validation failures, and API error states
- test status rendering and loading states

Reason:
ETL workflows are failure-prone by nature. Production readiness depends on proving behavior across edge cases, not just the happy path.

Exit criteria:

- core UI states are covered by tests
- critical failure scenarios are represented

### Stage 7: Production hardening

Deliverables:

- environment variable validation
- upload constraints and file-type policy
- clearer error messages
- empty states and retry flows
- README updates
- Dockerfile review

Reason:
The last mile is what makes the UI usable by a real team rather than only technically functional.

Exit criteria:

- local setup is documented
- configuration expectations are clear
- error handling is operator-friendly

## Design Decisions and Why They Matter

### Why keep `/api/upload` and `/api/ingest` inside this UI repo first?

Because it gives us a thin orchestration layer close to the UI. We can validate requests, protect credentials, and later redirect or proxy behavior to `rag-backend` with minimal UI churn.

### Why separate upload history from ingestion logs?

Because "file stored successfully" is not the same as "content ingested successfully." Operators need both signals independently.

### Why create shared components early?

Because status display, loading indicators, cards, and layout structure will repeat across pages. Early reuse improves consistency and reduces rewrites.

### Why use typed responses for API routes?

Because upload and ingestion flows involve many states. Typed contracts reduce accidental mismatches between components and routes.

### Why stage file types and source types deliberately?

Because PDFs, spreadsheets, videos, and URLs often require different validation, metadata, and processing rules. A staged approach avoids a fragile "one form handles everything badly" design.

## Risks to Watch Early

- Supabase bucket policies may block upload or download behavior
- file size limits may require chunking or signed upload flows later
- video ingestion may require asynchronous processing beyond normal file upload flow
- URL ingestion may need scraping, normalization, and deduplication rules
- backend contracts with `rag-backend` may evolve, so API boundaries should stay thin and typed

## Suggested Implementation Order

We should implement the project in this order:

1. Stage 1: foundation and project structure
2. Stage 2: upload UI interactions
3. Stage 3: upload API and Supabase integration
4. Stage 4: upload history UI
5. Stage 5: ingestion flow and logs
6. Stage 6: tests and reliability
7. Stage 7: production hardening and documentation cleanup

## What the Next Prompt Should Ask

Use the next prompt to say:

`Go ahead with Stage 1`

If you want, you can also be more specific:

`Go ahead with Stage 1 and explain every file you create before moving to Stage 2`
