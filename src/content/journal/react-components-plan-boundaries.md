---
title: Plan React component boundaries and state ownership
date: 2026-09-10
description: Plan a React component tree by responsibility, state ownership, update frequency, and dependency direction before creating files.
tags: ReactJS
thumbnail: /assets/journal/react-components/plan-boundaries.webp
---

# Plan React component boundaries and state ownership

Planning a React component is the act of assigning decisions. Decide who owns each changing value, which component renders it, and how an interaction requests an update. A component tree is useful only when those answers are clearer after drawing it.

![A developer builds a component tree with one glowing state owner feeding several child panels.](/assets/journal/react-components/plan-boundaries.webp)

_One value has one owner; children receive the value and send events back through explicit contracts._

## Classify the data before placing state

Use four buckets:

1. **Server data** comes from an API or database. Let the route or query layer own fetching, caching, invalidation, and retries.
2. **URL state** must survive reloads or be shareable: filters, selected tabs, pagination, and search terms often belong here.
3. **Form state** represents an editable draft and validation workflow.
4. **Ephemeral interface state** is local and disposable: a disclosure, hover preview, or focused row.

Calling all four “global state” erases useful differences. A state library cannot decide the correct lifetime for you.

## Put ownership at the narrowest useful boundary

If two siblings must agree, move their shared value to their closest common parent. If a value is used only by one leaf, keep it there. React describes this as choosing a single source of truth, not putting all state in one central store. See [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).

```tsx title="ProductExplorer.tsx"
import { useState } from 'react'

type Product = { id: string; name: string; category: string }

export function ProductExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const visible = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section>
      <SearchField value={query} onValueChange={setQuery} />
      <ProductList products={visible} />
    </section>
  )
}
```

`visible` is derived and does not need another state variable. `SearchField` is controlled because the parent coordinates the query and results. A standalone field could instead own its draft; controlled and uncontrolled are design choices, not quality rankings.

![PeopleSearch owns query state, passes values down to SearchField and SearchResults, and receives an update event from SearchField.](/assets/journal/react-components/diagrams/props-and-events-flow.svg)

_Props carry the current query and derived results down. `onQueryChange(next)` carries user intent up to the one owner; siblings do not synchronize with each other._

## Replace container/presentational labels with explicit contracts

Older React guidance often split “container” components that fetched data from “presentational” components that received props. The useful constraint remains: portable views should not know product-specific transport. The names are less important than the dependency direction.

A route or feature component may coordinate URL state, cached server data, and mutations. A view component receives the smallest render-and-interaction contract. Custom Hooks can extract reusable stateful logic without adding a wrapper layer, but they do not remove the need to decide who owns the state. Keep the split when it makes testing and reuse clearer; do not create paired files for every leaf by convention.

## Treat tree position as state identity

React associates state with a component's position in the rendered tree. Keeping the same component in the same position preserves its state; changing its type or `key` creates a new identity and resets that state. Use a stable domain ID for list keys, and use an intentional key when switching records should reset an editable draft. Never generate keys during render.

This identity rule is part of the state plan, not a warning to fix after implementation. Decide whether a tab, form, or panel should preserve its local state before you decide where it renders. See [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state).

## Separate change rates when it helps

A slowly changing theme, a frequently updated form draft, and cached server records have different consumers and invalidation rules. Do not place them into one context object merely because Context avoids prop passing. A changed provider value can re-render every consumer, and a broad context hides which data a component depends on.

Prefer ordinary props for nearby relationships. Use context for stable cross-cutting dependencies such as a theme, locale, or scoped service. Use an external store when data exists outside React and must support subscription; React provides `useSyncExternalStore` for that contract.

## Plan errors and pending work at the same time

Mark boundaries for these outcomes on the tree:

- a route-level load that blocks the whole view;
- a local refresh that should retain existing content;
- a mutation with a button-level pending state;
- a render error caught by an Error Boundary;
- an expected validation result returned as data.

Suspense can coordinate supported async sources and code loading, but it does not detect a request started in an Effect. Use your framework or data layer's supported integration and place the fallback where replacing content makes sense. See the [Suspense reference](https://react.dev/reference/react/Suspense).

## Write a boundary note

Before implementation, add one sentence per component:

```text
ProductExplorer owns the query because both controls and results need it.
SearchField owns keyboard and label behavior but not the current query.
ProductList derives presentation from an already-filtered collection.
```

If the note needs “and” five times, the boundary may contain multiple responsibilities. If two notes describe the same decision, state may be duplicated.

<!-- ::start:quest difficulty="intermediate" -->

For one feature, classify every changing value as server, URL, form, or ephemeral state. Assign one owner and one update path to each. Delete any state that can be calculated from current inputs.

<!-- ::end:quest -->

The next article designs component APIs that preserve these boundaries without turning every variation into a prop.
