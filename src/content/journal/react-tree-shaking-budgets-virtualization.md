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
