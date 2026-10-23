# Deployment 1/5 — Purpose, Environments & Prerequisites

> Part of [deployment](../deployment.md) · [Next](02-configuration-and-local-dev.md) →

## ✅ What to do with this file

- [ ] Set up three environments: Local, Preview/Staging, Production.
- [ ] Go through the prerequisites list and tick off each item before deploying.
- [ ] Never copy real student data into local or staging.
- [ ] Create a Google OAuth client and VAPID (web push) keys for each environment.

---

## 1. Purpose and Status

This guide describes a proposed deployment process for the Student Opportunity Hub. It is not evidence that the application has already been built or deployed.

The exact commands depend on the final framework, hosting provider, and repository structure. Confirm those decisions before using provider-specific commands.

## 2. Recommended Environments

Maintain separate environments:

- **Local:** development with local or disposable test data
- **Preview/Staging:** integration testing using test accounts and test provider credentials
- **Production:** real users, protected secrets, backups, and monitoring

Never copy production student data into local development or preview environments unless there is a documented, authorized, privacy-safe process.

## 3. Prerequisites

Before deployment, confirm:

- Application repository and a protected main branch
- A chosen hosting provider
- Managed PostgreSQL database
- Authentication configuration (Supabase Auth with Google sign-in; OAuth client per environment)
- Web push VAPID key pair per environment
- Transactional email provider and verified sender domain
- Domain name and DNS access
- Secret management for production credentials
- Database migration process
- Error monitoring and uptime checks
- Backup and restore procedure
- Privacy policy, terms, support contact, and account deletion process
- Breach response plan (NPC 72-hour notification) and a named privacy contact

Payments are out of scope for now; there is no payment provider to set up.

No AI provider is needed for the MVP. Phase 2 adds an AI provider API key (server-side only, with a spending cap) and a private Supabase Storage bucket. Phase 3 adds Google Play and Apple developer accounts and a Firebase project for native push.

