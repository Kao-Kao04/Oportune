# Deployment 3/5 — Database, CI & Deployment Pipeline

> Part of [deployment](../deployment.md) · ← [Previous](02-configuration-and-local-dev.md) · [Next](04-domain-jobs-and-push.md) →

## ✅ What to do with this file

- [ ] Provision managed PostgreSQL with separate staging/production databases.
- [ ] Enable automated backups **and** test a restore.
- [ ] Set up CI to run lint, typecheck, tests, build, and secret scanning on every PR.
- [ ] Follow the 10-step release flow; use backward-compatible migrations.

---

## 6. Database Setup

- Provision a managed PostgreSQL instance.
- Require encrypted connections where supported.
- Create separate databases or isolated schemas for staging and production.
- Configure a restricted application database user.
- Enable Row-Level Security on **every** table and test the policies; the public reads listings only through the `public_opportunities` view ([System Design Part 3](../system-design/03-data-model.md)).
- Apply versioned migrations during deployment.
- Add indexes for commonly queried fields, including opportunity status, category, deadline, and user-to-opportunity relationships.
- Enable automated backups and define retention.
- Test restoring a backup to a non-production environment.
- Do not use production data in seed scripts.

For serverless or highly concurrent hosting, use a database connection strategy suitable for the chosen provider.

## 7. Continuous Integration

Every pull request should run:

- Dependency installation from the lockfile
- Linting and formatting checks
- Type checking
- Unit and integration tests
- Build verification
- Dependency and secret scanning
- Migration validation where feasible

Require review for changes affecting authentication, authorization, Row-Level Security policies, reminder and expiry logic, personal data, and production configuration.

## 8. Deployment Pipeline

Recommended flow:

1. Developer creates a feature branch.
2. CI checks and tests the branch.
3. Pull request is reviewed and merged.
4. A preview deployment is created when supported.
5. Smoke tests run against preview.
6. A production release is deployed from a tagged or approved commit.
7. Database migrations run using a controlled deployment step.
8. Health checks and key workflows are verified.
9. Monitor errors and usage after release.
10. Roll back the application release if necessary; use a forward-fix or carefully planned database recovery for irreversible schema changes.

Prefer backward-compatible database migrations: add new nullable fields first, deploy compatible code, backfill if needed, and remove obsolete fields only in a later release.

