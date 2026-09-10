---
title: Design React components from states, not screenshots
date: 2026-09-10
description: Turn a screen into explicit data, interaction, loading, empty, error, and success states before choosing React component boundaries.
tags: ReactJS
thumbnail: /assets/journal/react-components/design-from-states.webp
---

# Design React components from states, not screenshots

A screenshot shows one successful moment. A production component must also explain what happens before data arrives, when there is nothing to show, when input is invalid, when a request fails, and while the user tries again. Start with those states. Component names and file boundaries become easier after the behavior is visible.

![A developer arranges loading, content, success, and error panels into one interface blueprint.](/assets/journal/react-components/design-from-states.webp)

_The blueprint is the component contract: every meaningful state has a place before implementation begins._

## Replace the page-first checklist

Older React material often starts by drawing boxes around one mock and extracting anything reusable. That remains useful, but reuse is not the first question. Begin with the user task and the state model:

![A searchable people interface shown in initial, loading, empty, success, and recoverable error states.](/assets/journal/react-components/diagrams/interface-state-gallery.svg)

_The search control can stay stable while the result region explains each outcome. The text below defines the same states without relying on the diagram._

| Question                    | Example answer for a searchable people list           |
| --------------------------- | ----------------------------------------------------- |
| What can the user do?       | enter a query, clear it, open a result, retry         |
| What data is required?      | query, result records, request outcome                |
| Which states are visible?   | initial, loading, empty, results, error               |
| What must remain available? | query and previous results during refresh             |
| What is authoritative?      | the server owns people; the URL owns shareable search |

Avoid storing every row of that table as independent React state. Some values are derived. If `results.length === 0` already identifies an empty successful result, a second `isEmpty` state can contradict it.

React's current guidance is still to keep a single source of truth for each piece of state and to avoid redundant or contradictory state. See [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure).

## Model outcomes as a small union

A discriminated union makes impossible combinations harder to represent:

<!-- ::start:code-example -->

```ts title="search-state.ts"
type Person = { id: string; name: string }

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; previous: Person[] }
  | { status: 'success'; results: Person[] }
  | { status: 'error'; message: string; previous: Person[] }
```

<!-- ::end:code-example -->

This type does not decide whether a route loader, query cache, reducer, or local component owns the request. It gives each implementation the same visible contract. The UI can preserve useful content during a refresh instead of replacing the whole page with a spinner.

## Draw boundaries around decisions

Now identify pieces with a distinct responsibility:

```text
PeopleSearch
├─ SearchForm       owns accessible input and submit interaction
└─ SearchResults    renders one request outcome
   └─ PersonRow     renders one person action target
```

Do not extract `SearchTitle` merely because it is a rectangle. Extract when a boundary clarifies a responsibility, isolates change, supports a meaningful test, or is reused with the same semantics.

<!-- ::start:warning -->

“Reusable” is not the same as “configurable.” A component with twenty boolean props may be used in many places while remaining difficult to understand. Design the smallest truthful contract first.

<!-- ::end:warning -->

## Keep render logic pure

Components calculate UI from props, state, and context. They must not start requests, mutate shared data, or call non-idempotent code during render. React can render more than once, pause work, and discard an attempt. Purity is therefore a correctness rule, not a style preference. Review the current [Rules of React](https://react.dev/reference/rules).

Put interaction consequences in event handlers. Use Effects only to synchronize with an external system. If no external system is involved, derive the value during render rather than copying it through an Effect.

## Design checkpoint

<!-- ::start:quest difficulty="beginner" -->

Choose one existing screen and list its initial, loading, empty, success, validation, and recoverable-error states. Mark which values are authoritative and which are derived. Only then draw the component tree.

<!-- ::end:quest -->

The next article turns this state map into component boundaries and explicit ownership.
