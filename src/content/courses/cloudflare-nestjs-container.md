---
title: Run NestJS in a Cloudflare Container
date: 2026-09-09
description: Evaluate the paid Cloudflare Containers route for an unchanged NestJS process without treating container disk as durable SQLite storage.
order: 90
category: deployment
level: advanced
---

# Run NestJS in a Cloudflare Container

Cloudflare Containers can run a conventional Node server, but this is not the minimal route. It requires the Workers Paid plan, a Docker image, a routing Worker, rollout planning, and a separate durable database strategy.

## Package the API

Build NestJS for production, run it as a non-root user, listen on the container port and all interfaces, and include only production dependencies in the final image. A Worker receives `/api/*` requests and forwards them to one or more container instances.

Do not store the production SQLite database on the container filesystem. Instances can sleep, restart, or scale, and instance-local disk does not provide the shared durable booking source the application needs. Keep D1 behind a Worker API or choose a database/runtime combination designed for the container architecture.

## Understand deployment behavior

When `image` points to a Dockerfile, `wrangler deploy` builds and pushes the image and starts a rollout. The first container can take minutes to become ready, and a successful deploy can precede completion of the rollout. Test the Worker and a route that reaches NestJS.

Workers Builds can build a production Dockerfile from GitHub. Use a separate staging Worker for container previews; Durable Object-backed Container Workers do not provide ordinary preview URLs.

## Checkpoint

Document why the team needs NestJS unchanged, how persistent data is reached, what a cold start looks like, how health is checked, and how a failed image is rolled back. If those answers add no value over the D1 Worker adapter, keep the core architecture.

## Keep learning

- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Static frontend with a container backend](https://developers.cloudflare.com/containers/examples/container-backend/)
- [Deploy Cloudflare Containers](https://developers.cloudflare.com/containers/guides/deploy/)
