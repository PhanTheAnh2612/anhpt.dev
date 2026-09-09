---
title: Move SQLite data to Cloudflare D1
date: 2026-09-09
description: Deploy the Hotel Manager's schema to D1 and expose a small Worker API while preserving the rules learned in NestJS.
order: 3
category: deployment
level: core
---

# Move SQLite data to Cloudflare D1

Cloudflare D1 is a managed serverless database with SQLite semantics. A local `.sqlite` file is not durable storage for an edge deployment, so production uses D1 through a Worker binding.

## Be clear about the runtime boundary

The NestJS application remains the local Node implementation used to learn modules, validation, services, and tests. The Cloudflare Worker is a thin production HTTP adapter that applies the same validated inputs, overlap rule, status transitions, and response contract. Do not claim the NestJS process itself is running in D1 or Pages.

If deploying NestJS unchanged is a requirement, use the advanced Container lesson or a conventional persistent Node host instead. That choice is intentionally outside the minimal core.

## Create and bind D1

```sh title="terminal"
pnpm wrangler d1 create hotel-manager
pnpm wrangler d1 migrations apply hotel-manager --local
pnpm wrangler d1 migrations apply hotel-manager --remote
pnpm wrangler types
```

Add the returned D1 binding to `wrangler.jsonc`, keep the generated binding types current, and query with prepared statements:

```ts title="worker/reservations.ts"
const overlap = await env.DB.prepare(
  `
  SELECT id FROM reservations
  WHERE room_id = ?1 AND status IN ('booked', 'checked-in')
    AND check_in < ?2 AND check_out > ?3 LIMIT 1
`,
)
  .bind(roomId, checkOut, checkIn)
  .first()
```

Apply migrations locally first. The `--remote` flag changes production data, so review the target and backup plan before running it.

## Checkpoint

Create one demo reservation through the deployed API, reload the frontend, and confirm it persists. Send an overlapping request and confirm it returns `409` without a second row.

## Keep learning

- [Cloudflare D1 getting started](https://developers.cloudflare.com/d1/get-started/)
- [Cloudflare D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
