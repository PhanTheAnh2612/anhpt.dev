---
title: Choose React Context, state, or an external store
date: 2026-09-10
description: Replace blanket Provider and Observer patterns with explicit state ownership, narrow Context values, and correct external-store subscriptions.
tags: ReactJS
thumbnail: /assets/journal/react-components/context-store-subscriptions.webp
---

# Choose React Context, state, or an external store

“Use a Provider” is not a state-management plan. Before choosing Context or a store, name the authoritative value, who changes it, how far it travels, and whether it exists inside or outside React. Most components need props or local state. Context solves distant access. An external store solves a different problem: subscribing React to mutable state owned elsewhere.

![Several component branches receive a focused signal from one provider while an external instrument connects through a single subscription adapter.](/assets/journal/react-components/context-store-subscriptions.webp)

_Distribution and ownership are separate decisions. Context distributes a value; it does not decide what that value means._

## Replace the old pattern names with ownership questions

The source material described Singleton, Provider, and Observer as separate patterns. In a modern React codebase, use their underlying questions:

| Older label | Question to ask now                                        | Usual React tool                                            |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| Singleton   | Must there be one instance per app, request, tab, or test? | module instance, provider instance, or dependency injection |
| Provider    | Which subtree needs the value?                             | props, composition, or Context                              |
| Observer    | Who owns the changing value and its subscription contract? | React state or `useSyncExternalStore`                       |

A module-level singleton can leak state between server requests and tests. A provider instance makes the lifetime visible in the tree and lets each request, test, or embedded widget receive a separate value.

## Prefer the smallest owner

Keep transient form input and disclosure state near the component that uses it. Lift state to the nearest common owner when siblings coordinate. Reach for Context when many distant descendants need the same value and composition would become awkward.

React explicitly recommends trying props or `children` composition before Context. Context is appropriate for cross-cutting values such as a theme, current account, or screen-level reducer—not every value that crosses two components. See [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context).

Split values with different change rates or audiences. A single `AppContext` containing user, theme, notifications, feature flags, and draft state makes unrelated consumers update together and hides which dependency a component actually needs.

```tsx title="tasks-context.tsx"
const TasksContext = createContext<Task[] | null>(null)
const TasksDispatchContext = createContext<Dispatch<TaskAction> | null>(null)

export function TasksProvider({ children }: PropsWithChildren) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
    </TasksContext>
  )
}
```

Separating state from dispatch lets command-only consumers avoid depending on the changing state value. React’s [reducer and Context guide](https://react.dev/learn/scaling-up-with-reducer-and-context) uses the same division.

## Subscribe to state outside React deliberately

Browser APIs, legacy event emitters, and third-party stores own mutable values outside React. `useSyncExternalStore` gives React a subscription function and a stable snapshot reader:

```tsx title="use-online-status.ts"
export function useOnlineStatus() {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener('online', notify)
      window.addEventListener('offline', notify)
      return () => {
        window.removeEventListener('online', notify)
        window.removeEventListener('offline', notify)
      }
    },
    () => navigator.onLine,
    () => true,
  )
}
```

The third function provides a server snapshot. `getSnapshot` must return the same cached value until the store changes; creating a fresh object on every read can cause repeated renders. React recommends built-in state when possible and reserves this Hook mainly for external integration. Review the full [`useSyncExternalStore` contract](https://react.dev/reference/react/useSyncExternalStore).

## Keep Context out of reusable leaf APIs

A reusable component that secretly reads application Context cannot be rendered honestly in another product surface, test, or Server Component boundary. Prefer props for product-specific data at the leaf and let a feature wrapper read Context. The wrapper adapts application ownership to a portable visual contract.

<!-- ::start:quest difficulty="intermediate" -->

Choose one broad provider. List each value, its owner, lifetime, change rate, and consumers. Move local values down, split unrelated Contexts, and use an external-store adapter only for state React does not own.

<!-- ::end:quest -->

The next article turns Observer, Mediator, Middleware, and Command vocabulary into reducers, events, and explicit side-effect boundaries.
