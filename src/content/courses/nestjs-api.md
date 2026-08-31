---
title: Your first NestJS API
date: 2026-08-31
description: Add a small, structured API only when the website truly needs one.
order: 3
category: nestjs
---

# Your first NestJS API

Learn modules, controllers, services, validation, and configuration through a tiny guestbook API.

## First checkpoint

Keep HTTP handling in controllers and application decisions in services.

```ts title="health.controller.ts"
@Get('health')
health() {
  return { status: 'ok' }
}
```

## Finish line

Expose a validated endpoint that your React page can read.
