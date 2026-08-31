---
title: Developer tips & tricks
date: 2026-08-31
description: Improve the daily workflow with debugging, automation, and small habits.
order: 7
category: tips
---

# Developer tips & tricks

Collect practical techniques for browser DevTools, Git, terminal workflows, testing, and readable pull requests.

## First checkpoint

Automate checks that should produce the same result every time.

```json title="package.json"
{
  "scripts": {
    "verify": "pnpm run lint && pnpm run build"
  }
}
```

## Finish line

Create a short project checklist that makes the next release calmer.
