# Vercel Automated Deployment Plan

## Purpose

This document defines the planned CI/CD and deployment model for the ETL RAG Pipeline UI using:

- GitHub
- GitHub Actions
- Vercel Free

This document now reflects the implemented first-pass workflow structure for CI, preview deployment, and production deployment.

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

### Deployment structure

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

### Deployment file roles

- `.github/workflows/README.md`
  explains the planned workflow set before executable YAML files are added

- `.github/workflows/ci.yml`
  runs tests, lint, and typecheck on pull requests and protected branches

- `.github/workflows/deploy-preview.yml`
  deploys the `staging` branch to the Vercel Preview environment through GitHub Actions

- `.github/workflows/deploy-production.yml`
  deploys the `main` branch to the Vercel Production environment through GitHub Actions

- `docs/deployment/VERCEL_AUTOMATED_DEPLOYMENT.md`
  explains the deployment model, branch strategy, and Vercel environment mapping

- `docs/deployment/GITHUB_VERCEL_SETUP_CHECKLIST.md`
  gives the operational setup checklist for GitHub and Vercel

- `.env.example`
  defines the deployment-time environment variable template

- `Dockerfile`
  defines the container build path for production runtime packaging

- `next.config.ts`
  enables standalone output for deployment packaging

- `README.md`
  provides project-level setup and handoff guidance

## Current Constraint

For the Vercel Free plan, we should plan around two real Vercel environments:

- `Preview`
- `Production`

True custom environments such as a separate named `staging` environment are not available on Free. For now, `staging` should be implemented as a controlled branch-based preview workflow.

## Recommended Deployment Model

### Branch Strategy

- `main`
  Production branch
  Merges here trigger the Production deployment on Vercel.

- `staging`
  Pre-production integration branch
  Pushes here trigger a Preview deployment on Vercel and act as the team's staging URL for QA.

- `feature/*`
  Feature work branches
  Pushes and pull requests trigger Preview deployments on Vercel for isolated review.

## Environment Mapping

### 1. Local

- Developer machine
- uses `.env.local`

### 2. Preview

- Used for `staging`
- Used for pull requests
- Used for feature branches
- deployed automatically by Vercel Git integration

### 3. Production

- Triggered from `main`
- served from the production domain

## Free Plan Staging Interpretation

Because Free does not provide a custom `staging` environment, the `staging` branch should be treated as:

- a long-lived Preview deployment
- the team’s QA deployment
- the final checkpoint before merge to `main`

This means:

- `staging` is not a separate Vercel environment type
- `staging` still runs inside Vercel Preview
- `main` remains the only Production deployment source

## Proposed CI/CD Flow

### Pull Request Flow

1. Developer creates a feature branch.
2. Developer opens a pull request into `staging` or `main`.
3. GitHub Actions run validation checks.
4. Vercel can still create a Preview deployment through Git integration if enabled.
5. Reviewers test the Preview URL.

### Staging Flow

1. Approved feature work is merged into `staging`.
2. GitHub Actions run validation checks again on `staging`.
3. `deploy-preview.yml` deploys the `staging` branch to the Vercel Preview environment.
4. QA validates the `staging` preview URL.

### Production Flow

1. Validated changes are merged from `staging` into `main`.
2. GitHub Actions run validation checks on `main`.
3. `deploy-production.yml` deploys `main` to Production.
4. Production domain updates automatically.

## Recommended GitHub Actions Responsibilities

The first workflow set should eventually cover:

- install dependencies
- run tests
- run lint
- run typecheck
- optionally run build

Implemented workflow split:

- `ci.yml`
  Runs on pull requests and pushes to `staging` and `main`

- `deploy-preview.yml`
  Deploys the `staging` branch to Vercel Preview using the Vercel CLI

- `deploy-production.yml`
  Deploys the `main` branch to Vercel Production using the Vercel CLI

## Workflow Strategy

This repository now uses:

- Use GitHub Actions for quality gates
- Use GitHub Actions + Vercel CLI for explicit preview and production deployments

Why:

- gives deployment logic inside the repository
- keeps `staging` and `main` behavior explicit
- works with the Vercel Free plan using Preview and Production

## Required GitHub Secrets

The implemented workflows require:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Where these values come from

- `VERCEL_TOKEN`
  create it in:
  `Vercel Dashboard -> Settings -> Tokens`

- `VERCEL_ORG_ID`
  read it from `.vercel/project.json` after running `vercel link`

- `VERCEL_PROJECT_ID`
  read it from `.vercel/project.json` after running `vercel link`

### GitHub location for storing them

Add them in:

`GitHub repository -> Settings -> Secrets and variables -> Actions`

## Required Vercel Environment Variables

Preview and Production should both eventually define:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_STORAGE_BUCKET`

Production should additionally use:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RAG_BACKEND_BASE_URL`

Preview may use:

- preview-safe Supabase credentials and bucket values
- non-production backend URL if backend preview is introduced later

## Recommended Protection Rules

### GitHub

- protect `main`
- protect `staging`
- require pull requests
- require passing CI before merge

Recommended required status check:

- `quality-checks`

### Vercel

- connect GitHub repository
- set `main` as Production branch
- configure Preview and Production environment variables

## Exact Deployment Ownership Recommendation

Because this repository now includes:

- `ci.yml`
- `deploy-preview.yml`
- `deploy-production.yml`

the recommended deployment ownership is:

- GitHub Actions performs deployments
- Vercel Git auto-deploy should not be the active deployment source at the same time

Reason:

- otherwise the same push may create duplicate deployments
- one deployment can come from Vercel Git integration
- another deployment can come from GitHub Actions using the Vercel CLI

## Recommended Choice

For this repository, prefer:

- GitHub Actions for deployment
- Vercel as the hosting platform only

### Practical setup

1. Import the repository into Vercel once
2. Configure environment variables in Vercel
3. Capture `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
4. Add GitHub Actions secrets
5. Disconnect Git-triggered deployment from Vercel if you want a single deployment path

### If you keep Git connected

If Git remains connected and active for deployments, be aware:

- `staging` pushes can create Vercel Git preview deployments
- GitHub Actions can also create preview deployments
- `main` pushes can create Vercel Git production deployments
- GitHub Actions can also create production deployments

That is why using one deployment source is the safer operational model.

## Rollback Strategy

For the initial rollout:

- rollback application code by reverting the merge and redeploying
- use Vercel deployment history for quick recovery
- do not rely on in-memory ingestion job state for operational recovery

## Important Limitation Today

The ingestion store is currently in memory only. That means deployment or server restarts clear ingestion job history. Before calling the system fully production-ready, ingestion jobs should move to a durable backend or database.

## Suggested Rollout Order

1. Connect GitHub repo to Vercel
2. Configure Preview and Production environment variables in Vercel
3. Protect `main` and `staging` branches in GitHub
4. Add GitHub Actions repository secrets for Vercel
5. Decide whether GitHub Actions will be the only deployment owner
6. Validate Preview deployment from `staging`
7. Validate production deployment from `main`

## Decision Summary

For Vercel Free:

- use `main` for Production
- use `staging` branch as the QA/staging branch
- treat `staging` as a Preview deployment, not a separate custom Vercel environment
- use GitHub Actions for checks and deployments
- use `staging` as the branch-based preview/staging flow
- use `main` as the production deployment flow
