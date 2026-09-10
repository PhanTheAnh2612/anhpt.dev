---
title: Coordinate React route loaders and query caches
date: 2026-09-10
description: Give routers and query caches distinct jobs so React pages preload critical data without duplicate fetching, freshness rules, or ownership.
tags: ReactJS
thumbnail: /assets/journal/react-components/router-query-ownership.webp
---

# Coordinate React route loaders and query caches

A router knows where the user is going. A query cache knows whether a resource is fresh, shared, invalidated, or already in flight. They work well together when the route coordinates timing and the cache remains the authority for server data. Problems begin when both layers independently store the same result and decide when it is fresh.

![Parallel route data paths converge on one cache vault before supplying a ready interface.](/assets/journal/react-components/router-query-ownership.webp)

_Route intent starts work early; one cache owns resource identity, freshness, deduplication, and invalidation._

Recent [r/reactjs discussion about the TanStack ecosystem](https://www.reddit.com/r/reactjs/comments/1vsmglj/what_do_you_think_of_the_tanstack_ecosystem_for/) shows strong interest in Router and Query as a combined React data layer. The useful lesson is not that every project needs the entire ecosystem. It is that navigation and server-state ownership are different responsibilities.

## Decide whether one cache is enough

TanStack Router includes a route cache. It is a practical fit when data belongs mainly to one route, invalidation can be coarse, and the app does not need a rich mutation or persistent-cache model.

Add TanStack Query when resources are shared across routes, mutations need targeted invalidation, background refresh policies differ per query, or optimistic cache updates are central to the product. The official [TanStack Router data-loading guide](https://tanstack.com/router/latest/docs/guide/data-loading) documents the tradeoffs instead of declaring one universal stack.

Do not copy loader results into component state. Do not keep a Router result and Query result for the same resource as separate authorities.

## Let the route declare intent

For critical route data, the loader can ensure the query exists before rendering. Define the query once so the loader and component cannot drift:

```tsx title="src/routes/products.$productId.tsx"
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const productQuery = (productId: string) =>
  queryOptions({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  })

export const Route = createFileRoute('/products/$productId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQuery(params.productId)),
  component: ProductPage,
})

function ProductPage() {
  const { productId } = Route.useParams()
  const { data } = useSuspenseQuery(productQuery(productId))

  return <ProductDetails product={data} />
}
```

The route owns _when the destination needs the resource_. Query owns the key, request deduplication, cached value, and freshness. The component reads the same contract. TanStack's current [Router and Query integration guide](https://tanstack.com/router/latest/docs/integrations/query) also covers server-side rendering, dehydration, hydration, and streaming.

## Choose blocking and streaming deliberately

Await critical data when the destination cannot render meaningfully without it. Start non-critical data without blocking when the page shell can appear first and a local Suspense boundary explains the later reveal.

Do not prefetch every link merely because it is possible. Intent preloading can begin on focus, hover, or touch, but it spends bandwidth and may execute authorization or data work the user never consumes. Prefer destinations with a high probability of use and requests cheap enough to speculate on. See TanStack Router's [preloading strategies](https://tanstack.com/router/latest/docs/guide/preloading).

## Assign one freshness policy

When Query owns freshness, configure the Router integration so settled preload data does not compete with Query's `staleTime`. When Router owns the data, keep the smaller built-in model and avoid adding a second cache for fashion.

After a mutation, invalidate the resource contract that changed. Do not refetch the whole application or manually patch multiple copies of the same entity. If concurrent optimistic changes are possible, design reconciliation before the optimistic UI ships.

<!-- ::start:warning -->

Server rendering requires a fresh `QueryClient` per request. A process-global cache can leak one user's server data into another request. Follow the framework integration rather than exporting a server singleton.

<!-- ::end:warning -->

<!-- ::start:quest difficulty="advanced" -->

Trace one destination from link intent to rendered data. Name the query key, cache owner, freshness rule, blocking decision, error boundary, mutation invalidation, and request-scoped server cache. Remove any second layer that stores the same authoritative result.

<!-- ::end:quest -->

The next article uses this ownership model to place Suspense, optimistic updates, Actions, and server/client boundaries around understandable outcomes.
