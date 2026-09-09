---
title: Deploy the React app to Cloudflare
date: 2026-09-09
description: Connect GitHub to Cloudflare Pages, configure the Hotel Manager frontend, and verify production and preview builds safely.
order: 2
category: deployment
level: core
---

# Deploy the React app to Cloudflare

Cloudflare Pages can build the React app whenever GitHub changes. This lesson deploys the frontend; the next lesson handles durable SQLite-compatible data.

## Connect the repository

In Cloudflare, create a Pages application and connect only the required GitHub repository. Configure:

```text
Production branch: main
Root directory: apps/web
Build command: pnpm build
Build output: dist
```

Set `VITE_API_URL` to the public API origin after the next lesson. It is visible in browser code and must never contain a credential.

Push a feature branch and open a pull request. Cloudflare should create a preview deployment without changing production. Check the exact output directory produced by your Vite configuration instead of copying a preset blindly.

## Verify the public interface

- Load the main URL and a direct nested route.
- Create a reservation against non-sensitive demo data.
- Test 390-pixel and laptop layouts.
- Complete the flow with a keyboard.
- Confirm HTTPS and that no `.env` or source map exposes secrets.

<!-- ::start:warning -->

Choose Git integration or Direct Upload deliberately. A Git-integrated Pages project cannot later be converted to Direct Upload; create another project if the deployment model changes.
<!-- ::end:warning -->

## Checkpoint

Merge a visible text change and confirm GitHub records a passing check, Cloudflare produces a new deployment, and the production URL identifies the expected commit.

## Keep learning

- [Cloudflare Pages: React](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
