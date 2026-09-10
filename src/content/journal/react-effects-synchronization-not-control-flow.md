---
title: Use React Effects for synchronization, not control flow
date: 2026-09-10
description: Decide whether React logic belongs in render, an event handler, a route loader, or an Effect—and avoid fragile state synchronization.
tags: ReactJS
thumbnail: /assets/journal/react-components/effects-synchronization.webp
---

# Use React Effects for synchronization, not control flow

`useEffect` is not broken, and avoiding every Effect is not a useful goal. The problem is using an Effect as general application control flow. React defines an Effect as synchronization between a rendered component and an external system. Calculations belong in render; work caused by a user action belongs in its event handler.

![A UI-state instrument connects to an external display with one deliberate cable while unused tangled cables remain outside the active system.](/assets/journal/react-components/effects-synchronization.webp)

_One explicit synchronization process is easier to reason about than a chain of Effects correcting each other's state._

A recent [r/reactjs discussion about the real problem with `useEffect`](https://www.reddit.com/r/reactjs/comments/1w69xon/whats_the_real_problem_with_useeffect_in_react/) repeatedly returned to the same failure modes: derived state, stale closures, missing cleanup, dependency fights, and requests that race. Community discussion is a signal, not the API contract; the contract comes from React's [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) guidance.

## Choose the owner before the Hook

Use this decision order:

| Cause                                                                           | Place the logic                         |
| ------------------------------------------------------------------------------- | --------------------------------------- |
| Compute UI from current props or state                                          | Render                                  |
| Respond to a click, submit, or keyboard action                                  | Event handler or Action                 |
| Load data required by a destination                                             | Framework route or server data boundary |
| Keep React aligned with a browser API, subscription, timer, or non-React widget | Effect                                  |

The distinction is causal. Sending a message belongs in the submit handler because the user caused it. Maintaining a chat connection belongs in an Effect because the connection must match whether the room is rendered and which room is selected.

## Derive values during render

This Effect creates a temporary invalid state and an extra render:

```tsx title="FilteredProducts.tsx"
const [visibleProducts, setVisibleProducts] = useState(products)

useEffect(() => {
  setVisibleProducts(products.filter((product) => product.name.includes(query)))
}, [products, query])
```

Calculate the value directly instead:

```tsx title="FilteredProducts.tsx"
const visibleProducts = products.filter((product) =>
  product.name.includes(query),
)
```

If the calculation is measurably expensive, optimize it after profiling. Do not use state plus an Effect as a cache. React's [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) covers the same test for resetting state, notifying parents, and transforming data.

## Put interaction consequences together

If a button changes local state and notifies a parent, do both in the handler that owns the interaction:

```tsx title="QuantityButton.tsx"
function increment() {
  const nextQuantity = quantity + 1
  setQuantity(nextQuantity)
  onQuantityChange(nextQuantity)
}
```

Do not set `quantity`, wait for an Effect, then notify the parent. That separates one event into multiple commits and makes intermediate states observable. The same rule prevents Effect chains that transform state A into B, then B into C.

## Make each synchronization process reversible

A legitimate Effect should describe setup and cleanup as one balanced process:

```tsx title="use-online-status.ts"
useEffect(() => {
  function updateStatus() {
    setIsOnline(navigator.onLine)
  }

  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
  updateStatus()

  return () => {
    window.removeEventListener('online', updateStatus)
    window.removeEventListener('offline', updateStatus)
  }
}, [])
```

Development Strict Mode runs an extra setup-and-cleanup cycle to expose processes that cannot reconnect safely. Treat that as a test of symmetry. Do not disable the check to hide a leaked subscription.

Dependencies are not scheduling preferences. Every reactive value read by the Effect is a dependency. If the dependency list causes unwanted reruns, restructure the Effect, move event-specific logic to an event handler, or create stable inputs; do not silence the linter.

<!-- ::start:quest difficulty="intermediate" -->

Audit one component with multiple Effects. Label each block as render calculation, user event, route data, or external synchronization. Move the first three to their proper owners, then verify every remaining Effect can run setup, cleanup, and setup again without a visible bug.

<!-- ::end:quest -->

The next article chooses among local state, Context, and external-store subscriptions by ownership and lifetime.
