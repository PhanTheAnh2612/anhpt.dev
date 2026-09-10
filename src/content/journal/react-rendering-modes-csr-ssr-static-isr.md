---
title: Choose CSR, SSR, static rendering, or ISR by route
date: 2026-09-10
description: Select a React rendering mode from freshness, personalization, cacheability, infrastructure, and interaction requirements instead of one app-wide rule.
tags: ReactJS
thumbnail: /assets/journal/react-components/rendering-modes.webp
---

# Choose CSR, SSR, static rendering, or ISR by route

Client-side rendering (CSR), server-side rendering (SSR), static rendering, and Incremental Static Regeneration (ISR) are delivery choices, not competing identities for an entire application. Choose per route—and sometimes per region—using content freshness, personalization, cacheability, infrastructure, and interaction needs.

![Four route gates send content through browser rendering, request-time rendering, build-time shelves, and a timed regeneration workshop.](/assets/journal/react-components/rendering-modes.webp)

_The route’s data contract chooses the delivery path; React components can still share the same visual system._

## Compare the actual constraints

| Mode               | HTML is produced               | Strong fit                                     | Main cost                                         |
| ------------------ | ------------------------------ | ---------------------------------------------- | ------------------------------------------------- |
| CSR                | in the browser                 | authenticated tools, highly interactive shells | useful content waits for JavaScript and data      |
| SSR                | for each request               | personalized or request-fresh pages            | server latency and capacity on every miss         |
| Static             | during a build                 | stable public content                          | updates require a new build                       |
| ISR / revalidation | ahead of time, refreshed later | large public catalogs with bounded staleness   | cache invalidation and platform-specific behavior |

These names do not guarantee performance. An SSR route can wait on slow data; a static route can ship too much JavaScript; a CSR dashboard can feel excellent after a small cached shell loads.

## Ask five questions per route

1. Can different users safely receive the same HTML?
2. How stale may the content be—seconds, minutes, a deployment, or never?
3. Must the first response contain indexable or immediately readable content?
4. Which interactions truly require client JavaScript?
5. Can the deployment target run request-time code and share a cache correctly?

Static rendering is the default candidate for documentation and journal posts. Request-time SSR fits user-specific or rapidly changing HTML. CSR can be correct for a private application whose valuable state begins after authentication. ISR fits public pages that can accept a declared freshness window.

## Treat ISR as a cache policy

ISR is not a React core API. Frameworks define how regeneration is triggered, cached, and deployed. Next.js describes ISR as updating static content without rebuilding the whole site, while noting runtime and adapter limits in its current [ISR guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration).

Document the stale-content promise in product language: “price may be up to five minutes old” is more useful than “revalidate is 300.” Decide what happens during regeneration failure and how urgent corrections invalidate cached pages.

## Do not duplicate server and client truth

Server-rendered HTML and the first client render must agree. Locale, time, random values, browser-only APIs, and user state are common mismatch sources. Pass a stable snapshot or defer browser-only output to a deliberate client boundary. React treats hydration mismatches as bugs in the [`hydrateRoot` reference](https://react.dev/reference/react-dom/client/hydrateRoot).

## Mix modes at useful boundaries

A product page may use a cached static shell, request-time inventory, and client-side cart interaction. Modern frameworks can compose these strategies, but every boundary adds a cache and failure mode. Start with the coarsest route-level choice that meets the requirement, then split only when measurement or freshness demands it.

<!-- ::start:quest difficulty="intermediate" -->

Choose three routes in one application. Record audience, freshness tolerance, personalization, cache key, first-response content, and client interaction. Select a rendering mode for each and write the invalidation or failure behavior in one sentence.

<!-- ::end:quest -->

The next article coordinates route intent and query-cache ownership so rendering does not create two competing data sources.
