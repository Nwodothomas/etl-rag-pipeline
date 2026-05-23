# GitHub and Vercel Setup Checklist

## Goal

Set up automated validation and deployment for:

- preview deployments
- staging branch preview flow
- production deployment

## Deployment File Structure

### Current deployment-related structure

```text
etl-rag-pipeline/
├── .github/
│   └── workflows/
│       ├── README.md
│       ├── ci.yml
│       ├── deploy-preview.yml
│       └── deploy-production.yml
├── docs/
│   └── deployment/
│       ├── GITHUB_VERCEL_SETUP_CHECKLIST.md
│       └── VERCEL_AUTOMATED_DEPLOYMENT.md
├── .env.example
├── Dockerfile
├── next.config.ts
└── README.md
```

### Workflow structure

```text
etl-rag-pipeline/
├── .github/
│   └── workflows/
│       ├── README.md
│       ├── ci.yml
│       ├── deploy-preview.yml
│       └── deploy-production.yml
```

### What each deployment file is for

- `.github/workflows/README.md`
  planning note for the workflow folder

- `ci.yml`
  quality gates for pull requests and protected branches

- `deploy-preview.yml`
  optional future workflow for preview deployment control

- `deploy-production.yml`
  optional future workflow for production deployment control

- `.env.example`
  environment template for local, preview, and production setup

- `Dockerfile`
  container packaging for deployable runtime output

## GitHub Repository Setup

- create `staging` branch
- keep `main` as production branch
- enable branch protection on `main`
- enable branch protection on `staging`
- require pull requests for protected branches
- require status checks before merge

## Exact GitHub Secrets Setup

Add these repository secrets in:

`GitHub repository -> Settings -> Secrets and variables -> Actions -> New repository secret`

### Required secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### How to get `VERCEL_TOKEN`

1. Log in to Vercel.
2. Open:
   `Vercel Dashboard -> Settings -> Tokens`
3. Create a token for GitHub Actions deployment use.
4. Copy it once and save it as `VERCEL_TOKEN` in GitHub.

### How to get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

Use the Vercel CLI after linking the project locally:

```bash
npm i -g vercel
vercel login
vercel link
```

After linking, inspect `.vercel/project.json` locally. It will contain:

- `orgId`
- `projectId`

Copy those values into GitHub Actions secrets:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Exact Vercel Environment Variable Setup

Open:

`Vercel Dashboard -> Your Project -> Settings -> Environment Variables`

### Preview variables

Set these for the `Preview` environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `RAG_BACKEND_BASE_URL`

Recommended preview values:

- use a preview-safe Supabase project or preview-safe bucket
- use a non-production backend URL if backend preview exists

### Production variables

Set these for the `Production` environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `RAG_BACKEND_BASE_URL`

Recommended production values:

- production Supabase project URL
- production public anon key
- production service role key
- production storage bucket
- production backend base URL

### Optional variables

If needed later:

- `SUPABASE_STORAGE_HISTORY_PREFIX`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## Vercel Project Setup

- import the GitHub repository into Vercel
- confirm framework is detected as Next.js
- confirm production branch is `main`
- confirm Preview deployments are enabled
- add environment variables for Preview
- add environment variables for Production

## Recommended Vercel Deployment Mode

Because this repository now contains GitHub Actions deployment workflows, the recommended mode is:

- use GitHub Actions for deployment
- do not rely on Vercel Git auto-deploy at the same time

Reason:

- keeping both enabled can create duplicate deployments
- the same commit may deploy once from GitHub Actions and once from Vercel Git integration

### Recommended choice

Use one deployment source only:

1. Preferred now:
   GitHub Actions deploys Preview and Production

2. Avoid:
   GitHub Actions deployment plus Vercel Git auto-deployment together

### How to avoid duplicate deployments

Use one of these approaches:

#### Option A: Disconnect Git from Vercel after initial import

1. Open:
   `Vercel Dashboard -> Your Project -> Settings -> Git`
2. Disconnect the connected Git repository
3. Keep using the project through `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN`
4. Let GitHub Actions become the only deployment path

This is the cleanest option for the workflows currently implemented.

#### Option B: Keep Git connected but disable Git-triggered builds where possible

If you want to keep repository linkage for visibility, review:

`Vercel Dashboard -> Your Project -> Settings -> Git`

Look for Git deployment behavior and build-trigger settings. If those remain active while GitHub Actions also deploys, duplicate deployments can still happen.

For this reason, Option A is the safer recommendation.

## Branch Protection Guidance

Open:

`GitHub repository -> Settings -> Branches -> Add branch protection rule`

### `staging` branch rule

Recommended settings:

- Branch name pattern: `staging`
- Require a pull request before merging
- Require approvals
- Require status checks to pass before merging
- Select required check:
  `quality-checks`
- Restrict direct pushes if your team workflow requires it

### `main` branch rule

Recommended settings:

- Branch name pattern: `main`
- Require a pull request before merging
- Require approvals
- Require status checks to pass before merging
- Select required check:
  `quality-checks`
- Restrict direct pushes
- Optionally require linear history

## Deployment Trigger Mapping

### Preview deployment

- branch: `staging`
- workflow: `.github/workflows/deploy-preview.yml`
- Vercel target: `Preview`

### Production deployment

- branch: `main`
- workflow: `.github/workflows/deploy-production.yml`
- Vercel target: `Production`

### CI validation

- workflow: `.github/workflows/ci.yml`
- runs on pull requests and pushes for `staging` and `main`

## Preview Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `RAG_BACKEND_BASE_URL`

## Production Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `RAG_BACKEND_BASE_URL`

## GitHub Actions Secrets

Add these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Validation Steps

- add GitHub Actions secrets
- link the project locally with `vercel link` and confirm IDs
- configure Preview environment variables in Vercel
- configure Production environment variables in Vercel
- decide on deployment ownership:
  prefer GitHub Actions only
- disconnect Git deployment from Vercel if using Actions as the only deploy path
- push a feature branch and confirm Vercel Preview URL is created
- open a pull request and confirm `CI` runs
- merge to `staging` and confirm `Deploy Preview` runs
- merge to `main` and confirm `Deploy Production` runs
- verify upload and ingestion screens load in Preview and Production
