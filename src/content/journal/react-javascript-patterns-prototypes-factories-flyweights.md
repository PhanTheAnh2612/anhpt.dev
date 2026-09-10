---
title: Read legacy JavaScript patterns without copying them
date: 2026-09-10
description: Understand Prototype, Factory, Flyweight, Mixin, and Module code while preferring functions, ES modules, composition, normalized data, and measurement.
tags: ReactJS
thumbnail: /assets/journal/react-components/javascript-patterns-literacy.webp
---

# Read legacy JavaScript patterns without copying them

Prototype, Factory, Flyweight, Mixin, and Module are still useful vocabulary when reading libraries and older applications. They are not a checklist for a modern React feature. Translate each pattern into the problem it solved, then choose the smallest current language or React mechanism that preserves that benefit.

![Old mechanical pattern stamps sit beside a modern set of small modules, functions, and shared data tiles on a tidy workbench.](/assets/journal/react-components/javascript-patterns-literacy.webp)

_Keep the concepts as reading skills; do not reproduce their ceremony when the language already provides the mechanism._

## Prototype: know the runtime, prefer clear data

JavaScript objects still inherit through prototypes, and classes are built on that model. React props and state should usually be plain serializable data rather than mutable class instances. Plain data crosses server/client boundaries, cache layers, tests, and developer tools with fewer surprises.

Use a class when object identity and methods represent a real domain or platform object. Do not create a class hierarchy just to share render behavior. Functions, Hooks, and composition express React behavior more directly.

## Factory: centralize a construction invariant

A factory is simply a function that creates a valid value or configured dependency. It is useful when construction has defaults, validation, or environment-specific adapters:

```ts
export function createSearchClient(options: SearchClientOptions): SearchClient {
  const transport = options.transport ?? createFetchTransport()
  return {
    search: (query) => transport.get('/search', { query }),
  }
}
```

Avoid a factory that merely renames an object literal. React 19 removed the old `createFactory` API; use JSX for elements. The [React legacy API reference](https://react.dev/reference/react/legacy) documents that replacement.

## Flyweight: share data before sharing component instances

The historical Flyweight pattern reduces memory by sharing intrinsic data. In React, do not cache element objects or reuse mutable component instances. Normalize repeated domain data by ID, share immutable configuration, deduplicate large resources in a cache, and render the view needed for the current item.

For a list with ten thousand records, the first performance question is often how many DOM nodes are mounted—not whether repeated strings share an object. Virtualization renders a moving window and usually produces a larger practical win. Measure memory and interaction cost before adding a custom object pool.

## Mixin: compose capabilities explicitly

Mixins copy behavior into an object or class and can hide name collisions and dependencies. Replace them with:

- a plain function for pure calculation;
- a focused custom Hook for stateful React logic;
- an injected service for an external capability;
- component composition for UI structure.

If a Hook only renames `useEffect` as `useMount`, it hides dependency semantics rather than creating a capability. React recommends purpose-specific Hooks such as `useOnlineStatus` or `useChatRoom` in [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).

## Module: make the dependency direction visible

ECMAScript modules already provide private module scope and explicit imports and exports. Prefer named exports for deliberate public APIs, avoid barrels that erase dependency direction, and keep side effects out of module initialization when possible. These choices also help test isolation and dead-code elimination.

## Translate before refactoring

When you encounter a named pattern, write one sentence:

> This code uses **pattern** so that **constraint** remains true when **change** happens.

Then preserve the constraint with simpler tools. The goal is not to delete a term from history; it is to avoid carrying an old implementation shape into a different runtime and component model.

<!-- ::start:quest difficulty="intermediate" -->

Find one factory, class hierarchy, mixin, or shared-object cache in an older React feature. State the invariant it protects. Replace only the ceremony that no longer protects that invariant, and keep a test for the behavior.

<!-- ::end:quest -->

The next article organizes these functions, adapters, components, and tests by feature and dependency direction.
