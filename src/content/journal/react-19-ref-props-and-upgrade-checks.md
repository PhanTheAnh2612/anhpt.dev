---
title: React 19 ref props and the migration details worth checking
date: 2026-09-03
description: Simplify a typed input ref, avoid callback-return traps, and upgrade React without turning every component into a rewrite.
tags: react, typescript, migration
---

# React 19 ref props and the migration details worth checking

The best React upgrade leaves the application easier to understand, not merely different. Ref-as-prop is a good example: it removes a wrapper from many function components, but it does not change why refs exist or make every component responsible for exposing its DOM.

Start with a narrow component that already promises imperative access, such as a text field. Keep its label, keyboard behavior, and accepted input props intact. This gives the migration a concrete behavioral contract: the parent can still focus the field.

## A smaller typed input

In React 19, function components can receive `ref` as a prop. `forwardRef` remains available, but is no longer necessary for this pattern. That does not make a React-19-only ref-prop implementation compatible with React 18 consumers. Check a published library's supported range before changing it. [forwardRef reference](https://react.dev/reference/react/forwardRef).

<!-- ::start:code-example -->

```tsx title="SearchField.tsx"
import { useId, useRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

type SearchFieldProps = ComponentPropsWithRef<'input'> & {
  label: string
}

function SearchField({ label, id, ref, ...inputProps }: SearchFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input {...inputProps} id={inputId} ref={ref} />
    </div>
  )
}

export default function SearchDemo() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section aria-label="Search field demo">
      <SearchField
        label="Search the journal"
        ref={inputRef}
        name="query"
        type="search"
        placeholder="React 19"
      />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus search
      </button>
    </section>
  )
}
```

<!-- ::end:code-example -->

This is a complete client demo. `ComponentPropsWithRef<'input'>` keeps the native input contract, including callback and object refs. The explicit `id` and `ref` come after the spread so their wiring is easy to audit. `useId` runs on every render even when a caller supplies an ID; there is no conditional Hook.

The null initial value matters. The DOM node is not present during the first render, and React sets the ref after committing it. Read or act on this DOM ref in an event or appropriate lifecycle code, not while computing JSX. [useRef reference](https://react.dev/reference/react/useRef).

<!-- ::start:trainer-tip pose="point" -->

Only expose an input ref if focusing or selecting it is part of the component's public contract. A shorter signature is not a reason to expose every internal element.

<!-- ::end:trainer-tip -->

## Callback refs now have meaningful returns

React 19 supports cleanup functions returned from callback refs. That makes accidental return values important: an assignment expression can return a DOM node when you intended to return nothing. The upgrade guide calls out this TypeScript break. Use a block body for assignments. [Ref callback migration](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#ref-cleanups-required).

When setup actually needs cleanup, make the pair explicit. This second standalone demo registers the mounted node and removes it on detach. The module-level callback has a stable identity, so rendering the component again does not create a new callback just to maintain the same registration.

```tsx title="RegisteredPanel.tsx"
const mountedPanels = new Set<HTMLDivElement>()

function registerPanel(node: HTMLDivElement | null) {
  if (!node) return
  mountedPanels.add(node)

  return () => {
    mountedPanels.delete(node)
  }
}

export default function RegisteredPanel() {
  return <div ref={registerPanel}>A panel with balanced registration.</div>
}
```

React uses the returned cleanup when detaching this ref. Development Strict Mode also exercises an extra setup/cleanup cycle; balanced registration is the goal, not suppressing that check. [DOM ref callback reference](https://react.dev/reference/react-dom/components/common#ref-callback).

## Upgrade in reviewable slices

<!-- ::start:warning -->

Do not mix a dependency upgrade, a ref-API rewrite, and a form behavior rewrite into one unreviewable change. A passing type-check cannot prove that focus still lands in the right place.

<!-- ::end:warning -->

For a React 18 application, the official guide recommends first moving to React 18.3 to surface migration warnings. Then align `react`, `react-dom`, and their TypeScript types, and verify the modern JSX transform. Check removed root APIs, function-component `defaultProps`, and argument-less `useRef()` calls before polishing component signatures. [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).

My review order is dependencies, compile errors, runtime checks, then optional simplification. Run the existing tests after each slice. Add a focused interaction check for the component being migrated: activate the focus button, confirm the actual input receives focus, unmount it, and look for leaked registrations or warnings.

<!-- ::start:quest difficulty="intermediate" -->

Choose one existing forwarded input. Preserve its public props, migrate it to ref-as-prop, and exercise both an object ref and a callback ref. Leave unrelated components alone until this contract is verified.

<!-- ::end:quest -->

Finally, keep framework changes separate. React 19's ref improvements do not require adopting Server Components. The React release notes distinguish the stable component model from the underlying framework/bundler integration APIs that do not follow normal minor-version compatibility guarantees. Follow your framework's supported integration rather than inventing one during an input refactor. [React 19 Server Components note](https://react.dev/blog/2024/12/05/react-19#react-server-components).
