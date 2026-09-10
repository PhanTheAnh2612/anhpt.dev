---
title: Combine tree shaking, budgets, and React virtualization
date: 2026-09-10
description: Reduce shipped modules safely, enforce route delivery budgets, and virtualize measured large collections without breaking semantics or navigation.
tags: ReactJS
thumbnail: /assets/journal/react-components/tree-shaking-virtualization.webp
---

# Combine tree shaking, budgets, and React virtualization

Tree shaking reduces unused module code. Performance budgets stop delivery cost from quietly returning. Virtualization limits how much of a large collection is mounted. These techniques act at different layers, so use the measurement that matches each one: bundle graph, network and CPU budget, then DOM and interaction cost.

![A careful gardener removes unused module branches while a viewport window reveals only the needed rows from a much taller data tower.](/assets/journal/react-components/tree-shaking-virtualization.webp)

_Remove code the route cannot reach, and mount only the records the viewport needs—without discarding product behavior._

## Make modules removable

Tree shaking depends on static module structure and bundler assumptions. Prefer ECMAScript imports and exports, import from side-effect-free entry points, and keep module initialization predictable. Avoid a broad barrel that imports every widget merely to re-export two names.

Package metadata such as `sideEffects` is a correctness promise. Marking a module side-effect-free when it installs styles, registers a plugin, or patches a global can make production behavior disappear. Inspect the production graph and run behavior tests after changing it.

## Replace PRPL with a measurable delivery plan

The older PRPL acronym—push or preload, render, pre-cache, lazy-load—contains useful instincts, but HTTP behavior, browser priorities, frameworks, and deployment platforms have changed. Keep the measurable decisions:

- deliver a useful route shell early;
- prioritize only critical resources;
- cache immutable assets with stable fingerprints;
- split optional code and data;
- prefetch safe likely navigation;
- verify the result in field data.

Do not optimize toward an acronym. Write route budgets for initial JavaScript, main-thread time, image weight, and first interaction, then enforce them in continuous integration or release review.

## Virtualize only when the DOM is the bottleneck

Pagination or “load more” may be simpler, more indexable, and easier for assistive technology. Virtualize when users need continuous access to a large client-side collection and measurement shows DOM, layout, or rendering cost.

TanStack Virtual is a headless virtualizer: it calculates the visible range while your application owns markup and styles. Its current [introduction](https://tanstack.com/virtual/latest/docs/introduction) demonstrates rendering visible items inside a full-size scroll surface.

## Prove that code disappeared

Compare the production graph before and after changing an import. A direct import helps only when the package exposes removable modules and the selected module does not pull the barrel back in.

```ts title="imports.ts"
// Risky when the barrel initializes every editor plugin.
import { MarkdownEditor } from '@acme/editors'

// Measurably better only if this entry is independently removable.
import { MarkdownEditor } from '@acme/editors/markdown'
```

Treat `sideEffects` as correctness metadata:

```json title="package.json"
{
  "sideEffects": ["**/*.css", "./src/register-editor-plugins.ts"]
}
```

After the change, inspect the built route chunk and run the editor path. A smaller bundle with missing registration or styles is a regression, not successful tree shaking.

## Make a route budget fail continuous integration

Keep the budget close to the artifact it protects. This small script deliberately fails when the main route crosses the declared compressed-byte limit:

```ts title="check-route-budget.ts"
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const file = process.argv[2]
const limit = Number(process.argv[3])
const bytes = gzipSync(readFileSync(file)).byteLength

if (bytes > limit) {
  throw new Error(`${file}: ${bytes} compressed bytes exceeds ${limit}`)
}
```

Production manifests are a better source than a hard-coded filename; the teaching point is that an exceeded budget produces a visible release failure with the responsible route attached.

## Virtualize one measured list

```tsx title="VirtualResults.tsx"
import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualResults({
  rows,
}: {
  rows: Array<{ id: string; name: string }>
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 44,
    getItemKey: (index) => rows[index].id,
    getScrollElement: () => viewportRef.current,
    overscan: 6,
  })

  return (
    <div
      aria-label="Search results"
      ref={viewportRef}
      role="list"
      style={{ height: 420, overflow: 'auto' }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            aria-posinset={item.index + 1}
            aria-setsize={rows.length}
            data-index={item.index}
            key={item.key}
            ref={virtualizer.measureElement}
            role="listitem"
            style={{
              position: 'absolute',
              transform: `translateY(${item.start}px)`,
              width: '100%',
            }}
          >
            {rows[item.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

<!-- ::start:architecture -->

```text
10,000 records in the data model
          ↓
virtualizer calculates visible range 240..267
          ↓
28 rows plus overscan mounted in the DOM
```

<!-- ::end:architecture -->

Filtering, selection, and “select all” still operate on `rows`, not `getVirtualItems()`. If focus may move outside the mounted range, define how keyboard navigation scrolls and restores that row before calling the interaction accessible.

## Preserve the scroll and accessibility contract

Use stable item keys, measure variable rows, and choose overscan that avoids blank flashes without mounting too much. Preserve focus when an item moves outside the virtual window. Announce counts and positions when the semantic control requires them, and test screen-reader navigation rather than assuming off-screen DOM is irrelevant.

Search, selection, and keyboard commands must operate on the data model, not only mounted nodes. “Select all” cannot mean “select the twelve visible rows.” Browser find-in-page and print behavior may be incomplete; provide an alternative when those tasks matter.

## Optimize in a reliable order

1. Remove unused dependencies and accidental broad imports.
2. Split optional route and feature code.
3. Enforce delivery and execution budgets.
4. Reduce expensive render work proven by profiling.
5. Virtualize large collections when mounted DOM remains the constraint.

<!-- ::start:quest difficulty="advanced" -->

Choose one heavy route and one large list. Inspect the production dependency graph, define an initial-delivery budget, then profile list interaction. Remove one unused branch and virtualize only if DOM cost remains measurable; verify focus, selection, find, and print requirements.

<!-- ::end:quest -->

The final article applies the same evidence-first discipline to a measured React Compiler rollout.
