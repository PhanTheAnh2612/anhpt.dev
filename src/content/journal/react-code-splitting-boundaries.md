---
title: Design React code-splitting boundaries that users feel
date: 2026-09-10
description: Split React code by route and optional capability, pair lazy components with stable Suspense states, and verify production chunks and waterfalls.
tags: ReactJS
thumbnail: /assets/journal/react-components/code-splitting-boundaries.webp
---

# Design React code-splitting boundaries that users feel

Code splitting is useful when it removes code from a critical interaction without adding a worse loading gap later. A good boundary follows navigation or an optional capability, has a stable loading state, and can be prefetched when intent is strong. A split per component usually creates bookkeeping and request overhead without helping the reader.

![A large application map is divided into a fast main route parcel and smaller optional capability parcels that arrive at deliberate gates.](/assets/journal/react-components/code-splitting-boundaries.webp)

_Split at user-visible transitions, then decide when each parcel should start travelling._

## Begin at routes

Routes are natural boundaries because navigation already changes the screen and provides a place for pending UI. An account editor does not need the charting code used only by analytics. Confirm that the router and bundler create separate production chunks; a dynamic import hidden behind a barrel may still pull shared code into the initial graph.

## Split expensive optional capabilities

Editors, maps, diagram renderers, export tools, and advanced settings are good candidates when most users do not need them immediately:

```tsx title="ReportPage.tsx"
const ChartEditor = lazy(() => import('./ChartEditor'))

export function ReportPage({ editing }: { editing: boolean }) {
  return (
    <ReportLayout>
      {editing ? (
        <Suspense fallback={<EditorSkeleton />}>
          <ChartEditor />
        </Suspense>
      ) : (
        <ReadOnlyChart />
      )}
    </ReportLayout>
  )
}
```

Declare `lazy` at module scope so React does not reset the component type and state. React’s [`lazy` reference](https://react.dev/reference/react/lazy) documents that the loader runs when the component is first rendered and its promise and resolved module are cached.

## Make the fallback part of the component contract

A fallback should preserve layout, accessible names, and surrounding controls. Avoid replacing an entire route with a spinner when one optional panel is downloading. Add an Error Boundary with a retry or alternative when the chunk cannot load after a deployment or network interruption.

## Watch the shared chunk

Splitting `ChartEditor` does not help if its charting library is also imported by the main route. Inspect the production bundle rather than trusting source folders. Common dependencies may belong in a shared cached chunk, but a huge shared chunk can make every route pay for the largest one.

Static imports communicate an unconditional dependency and enable early bundler analysis. Dynamic `import()` is an asynchronous expression for conditional or on-demand loading; the platform semantics are described by [MDN’s dynamic import reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

## Test navigation, not only totals

Measure initial transferred bytes, execution time, and the first use of the split capability. Test a cold cache, a warm cache, a slow connection, offline recovery, and navigation immediately after a deployment. A smaller entry bundle is not a win if the first important click stalls behind a serial code-and-data waterfall.

<!-- ::start:quest difficulty="intermediate" -->

Select one route or rarely used capability that dominates the initial bundle. Add one split with stable pending and error UI, inspect the production chunk graph, and compare both initial load and first-use latency.

<!-- ::end:quest -->

The next article decides whether a deferred parcel should load on visibility, interaction, or predicted navigation intent.
