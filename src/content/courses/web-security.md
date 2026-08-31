---
title: Practical web security
date: 2026-08-31
description: Protect accounts, browser boundaries, secrets, and stored data.
order: 6
category: security
---

# Practical web security

Build on the deployed project with threat modeling, secure cookies, authorization, validation, and dependency care.

## First checkpoint

Treat every value crossing a trust boundary as untrusted input.

```ts title="permissions.ts"
const canEdit = session.userId === project.ownerId
if (!canEdit) throw new Error('Forbidden')
```

## Finish line

Document the website's main risks and close the highest-impact gaps.
