---
title: Design async React components across client and server
date: 2026-09-10
description: Place loading, Suspense, Actions, optimistic state, errors, and server-client boundaries where users can understand every async outcome.
tags: ReactJS
thumbnail: /assets/journal/react-components/async-boundaries.webp
---

# Design async React components across client and server

Async component design is not “fetch, then render.” It is the placement of waiting, stale content, optimistic predictions, expected failures, unexpected errors, and retry controls. Those decisions belong near the interaction they explain, while data access belongs at the architectural boundary that can cache and secure it.

![Data parcels cross a bridge through loading, success, optimistic, empty, and retry checkpoints.](/assets/journal/react-components/async-boundaries.webp)

_A truthful async interface distinguishes predicted, pending, confirmed, empty, and failed outcomes._

## Load at the route or server boundary

Prefer your framework's route loader, server data API, or supported query integration over fetching initial page data in a mount Effect. Framework data APIs can coordinate requests with navigation, streaming, caching, redirects, status codes, and error handling.

![Initial data flows from a framework loader to a client component; user intent creates an optimistic projection, runs a server mutation, returns a confirmed result, and refreshes authoritative data.](/assets/journal/react-components/diagrams/client-server-async-boundary.svg)

_The browser may predict a reversible result, but validation, authorization, persistence, and the authoritative refresh remain server concerns. Expected rejections return to the workflow; unexpected failures go to an error boundary._

Client Effects remain appropriate for synchronization with external systems, not as a universal lifecycle replacement. If an event causes a request, begin it from the event or an Action. React's [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) explains the distinction.

## Put Suspense around a meaningful reveal

Suspense shows a fallback while supported code or data sources suspend. Place the boundary around content that can reasonably appear together:

```tsx
<main>
  <ProductSummary product={product} />
  <Suspense fallback={<ReviewsSkeleton />}>
    <ProductReviews productId={product.id} />
  </Suspense>
</main>
```

Do not wrap every leaf in a spinner. Too many independent fallbacks make the page flicker; one giant boundary hides useful content. Suspense does not detect a fetch started inside an Effect. Use a supported framework or cached promise integration. See the current [Suspense reference](https://react.dev/reference/react/Suspense).

## Treat mutations as workflows

A mutation needs at least pending, accepted, expected rejection, unexpected failure, and retry behavior. React 19 Actions and `useActionState` can keep a returned result with the submission. `useOptimistic` can project a reversible result while the authoritative request runs.

The prediction must remain distinguishable from confirmation. For a complete example, see [Optimistic React 19 interfaces that tell the truth](/journal/react-19-optimistic-ui-with-recovery). For form result and pending-state boundaries, see [React 19 forms without the pending-state puzzle](/journal/react-19-forms-with-actions).

<!-- ::start:warning -->

Rollback repairs the screen, not the network. A timeout can leave the outcome unknown after the server accepted a request. Reconcile before promising the user that nothing changed.

<!-- ::end:warning -->

## Keep secrets and heavy work on the server

Server Components can read server resources and send rendered output without shipping their implementation to the browser. Client Components own interactive state and browser APIs. Compose them rather than treating either side as the whole application.

In React 19, Server Components are stable, while the underlying bundler/framework integration APIs do not follow the same minor-version compatibility promise. Adopt them through a supported framework. Also remember that `"use server"` marks Server Functions; it is not a Server Component declaration. See the [Server Components reference](https://react.dev/reference/rsc/server-components).

## Profile before adding memoization

Purity, small state ownership, and sensible data boundaries come before `useMemo`, `useCallback`, or `memo`. Measure a real interaction with the React Profiler, then optimize the identified work.

React Compiler is now stable and can automatically memoize compatible components and values. It does not make impure code correct, and it does not remove the need to profile network, rendering, or list-scale problems. Existing manual memoization should be removed only with careful testing. See the [React Compiler introduction](https://react.dev/learn/react-compiler/introduction).

## Finish with outcome tests

For one async feature, verify:

- initial server or route load;
- retained content during refresh;
- empty success;
- expected validation rejection;
- unavailable service and retry;
- optimistic acceptance and rollback;
- navigation or unmount while work is pending;
- keyboard focus and announcement after every outcome.

<!-- ::start:quest difficulty="advanced" -->

Trace one mutation from button activation to authoritative persistence. Label the pending indicator, optimistic projection, validation result, unexpected-error boundary, retry path, cache invalidation, and final focus destination. Any missing label is an unresolved component contract.

<!-- ::end:quest -->

The next article connects these async outcomes to streaming HTML, hydration, Suspense, and Server Component boundaries.
