---
title: Release and operate the application
date: 2026-09-09
description: Add production checks, logs, rollback notes, data-handling boundaries, and a release checklist for the deployed Hotel Manager.
order: 4
category: deployment
level: core
---

# Release and operate the application

A successful upload is not the finish line. A release is ready when you can verify it, observe failures, protect data, and return to a known working version.

## Use a short release checklist

```text
[ ] Pull request checks pass
[ ] D1 migration reviewed and backed up when needed
[ ] Preview smoke test passes
[ ] Production frontend and API versions identified
[ ] Create, conflict, check-in, and check-out flows verified
[ ] Error logs contain no guest details or secrets
[ ] Rollback steps and responsible person recorded
```

Enable Cloudflare observability and log request IDs, route names, status codes, and durations. Do not log request bodies containing guest information. Add a `/health` response for process reachability, but test a real read separately when database health matters.

## Keep environments separate

Use invented data in previews. Production secrets belong in Cloudflare settings or secret bindings, not GitHub source or `VITE_` variables. Restrict which branch deploys production and avoid overlapping deployment runs.

For a schema change, rolling back code may not reverse data changes. Prefer backward-compatible migrations: add a nullable column, deploy code that understands both forms, backfill, then tighten constraints later.

## Checkpoint

Have another person follow the README from clone to local start, then use the release checklist against a preview. Simulate one API failure and confirm the UI message and server log are useful without exposing guest data.

## Keep learning

- [Cloudflare Workers observability](https://developers.cloudflare.com/workers/observability/)
- [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
