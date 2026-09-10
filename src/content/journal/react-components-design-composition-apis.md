---
title: Design React component APIs with composition
date: 2026-09-10
description: Replace boolean-prop combinations with semantic variants, children, slots, and compound relationships that keep React APIs understandable.
tags: ReactJS
thumbnail: /assets/journal/react-components/composition-apis.webp
---

# Design React component APIs with composition

A component API is a set of valid sentences. If callers can request `compact`, `large`, `danger`, `quiet`, `withIcon`, `iconOnly`, and `loading` in contradictory combinations, the API accepts sentences nobody can explain. Composition keeps variation close to the content that varies.

![Interchangeable content and control tiles fit around one shared component shell.](/assets/journal/react-components/composition-apis.webp)

_A stable shell can accept meaningful pieces without becoming a matrix of unrelated switches._

![Conflicting boolean props converge on a MegaPanel, while a compositional Panel accepts explicit heading, actions, and children slots.](/assets/journal/react-components/diagrams/composition-vs-booleans.svg)

_On the left, independent switches create combinations the component must reconcile. On the right, the shell owns layout while callers provide semantically complete regions._

## Start with semantic variants

Use a small union when variants change the same component's presentation without changing its meaning:

```tsx title="Notice.tsx"
import { useId } from 'react'
import type { ReactNode } from 'react'

type NoticeProps = {
  tone?: 'info' | 'warning' | 'success'
  title: string
  children: ReactNode
}

export function Notice({ tone = 'info', title, children }: NoticeProps) {
  const headingId = useId()
  return (
    <section className={`notice notice--${tone}`} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}
```

The important distinction is that `tone` is one choice. Three booleans allow impossible combinations.

## Let content stay content

Pass JSX when a region genuinely accepts arbitrary React content:

```tsx title="Panel.tsx"
import type { ReactNode } from 'react'

type PanelProps = {
  heading: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function Panel({ heading, actions, children }: PanelProps) {
  return (
    <section className="panel">
      <header>
        <h2>{heading}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  )
}
```

This replaces brittle props such as `actionLabel`, `actionHref`, `actionIcon`, and `hideAction`. The caller owns the action semantics; the panel owns layout.

## Replace HOCs and render props by the concern they carried

Higher-order components (HOCs) and render props were common ways to reuse stateful behavior before Hooks. Do not convert them mechanically. Identify what the wrapper supplied:

- reusable stateful logic usually becomes a focused custom Hook;
- distant tree configuration may become a narrow Context;
- markup variation usually becomes `children` or a named slot;
- an external subscription may need `useSyncExternalStore`;
- a cross-cutting platform concern may remain a wrapper at the route or provider boundary.

```tsx title="use-permissions.ts"
export function usePermissions() {
  const session = useContext(SessionContext)
  return getPermissions(session.user, session.workspace)
}

function EditProjectButton() {
  const permissions = usePermissions()
  return permissions.canEditProject ? <button>Edit project</button> : null
}
```

This replaces a `withPermissions(EditProjectButton)` wrapper without adding an extra component layer. The Hook shares the calculation and Context access, not one hidden state instance. Keep an existing HOC when a third-party integration requires one or when it genuinely adapts a component type; legacy literacy is different from new-feature guidance.

Render props can still be useful when the reusable concern must decide _where_ caller-owned UI renders. For ordinary logic reuse, a Hook normally exposes the contract more directly. React’s current [custom Hooks guide](https://react.dev/learn/reusing-logic-with-custom-hooks) recommends purpose-specific Hooks instead of generic lifecycle abstractions.

## Use compound components for one coordinated control

Compound components fit parts that only make sense together, such as tabs and tab panels. Share the minimum coordination state through a private Context, keep correct roles and keyboard behavior inside the compound API, and reject orphan parts with a clear development error. Do not use the pattern merely to make unrelated components look namespaced.

Composition is not automatically better. A slot with a strict invariant may need a typed object or dedicated subcomponent. Preserve the smallest API that prevents invalid use without hiding normal HTML.

## Use compound components for shared behavior

Compound components can express a relationship such as tabs, menus, or an accordion:

```tsx
<Tabs defaultValue="details">
  <Tabs.List aria-label="Project sections">
    <Tabs.Trigger value="details">Details</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="details">...</Tabs.Panel>
  <Tabs.Panel value="activity">...</Tabs.Panel>
</Tabs>
```

The shared parent coordinates selection; named children make the allowed grammar visible. Do not build this only to avoid passing two props. It is justified when the relationship itself is reusable and the keyboard behavior can be implemented and tested once.

## Retire pattern names when ordinary composition explains the code

Render props and higher-order components still exist, especially in libraries and older code. For new application code, children, custom Hooks, and ordinary function composition usually express the same intent with fewer wrapper layers. Describe the behavior—“inject subscription data” or “share selection logic”—before reaching for the historical pattern name.

Container/presentational separation has the same status. Separating data orchestration from a pure view can be excellent. Requiring every feature to have paired `ThingContainer` and `ThingView` files is ceremony. Modern Hooks allow orchestration to be extracted by purpose rather than by a universal folder rule.

## Preserve the platform

A reusable button should normally render a real `button`; a link should render an anchor. Avoid polymorphic APIs that can silently produce invalid element/prop combinations. If a design-system primitive supports an `asChild` or `as` escape hatch, test semantics, refs, keyboard activation, and TypeScript inference for every supported host.

<!-- ::start:quest difficulty="intermediate" -->

Find a component with at least three boolean appearance props. List the invalid combinations, then replace them with one semantic variant union or one compositional slot. Confirm the rendered HTML remains appropriate for keyboard and screen-reader users.

<!-- ::end:quest -->

The next article implements one of these contracts with semantic HTML, TypeScript, focus behavior, and complete states.
