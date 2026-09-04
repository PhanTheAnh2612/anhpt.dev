---
title: Deploy your website
date: 2026-08-31
description: Connect GitHub, hosting, environment variables, and a custom domain.
order: 5
category: deployment
---

# Deploy your website

Turn the local project into a public site with repeatable builds, HTTPS, DNS, and basic observability.

## First checkpoint

Push the project to GitHub and make sure a clean checkout can install and build successfully.

<!-- ::start:terminal -->

```sh title="verify.sh"
pnpm install --frozen-lockfile
pnpm run build
```

<!-- ::end:terminal -->

<!-- ::start:warning -->

Keep secrets out of the repository and the browser bundle. Supply private deployment configuration through your hosting environment.
<!-- ::end:warning -->

## Finish line

Deploy to Cloudflare Workers, attach your domain, and verify the production URL on mobile and desktop.
