# GitHub Actions Workflows

This folder now contains the first automated CI/CD workflow set for the ETL RAG Pipeline UI.

## Files

- `ci.yml`
  Runs tests, lint, and typecheck on pull requests and pushes to `staging` and `main`

- `deploy-preview.yml`
  Deploys the `staging` branch to the Vercel Preview environment using the Vercel CLI

- `deploy-production.yml`
  Deploys the `main` branch to the Vercel Production environment using the Vercel CLI

## Required GitHub Secrets

Add these repository secrets before the deployment workflows can succeed:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Required Branch Strategy

- `staging`
  long-lived preview/staging branch on Vercel Free

- `main`
  production branch

## Notes

- On Vercel Free, `staging` is implemented as a Preview deployment, not a custom Vercel environment
- CI runs before deployment in each workflow
- Production deployment is restricted to `main`
