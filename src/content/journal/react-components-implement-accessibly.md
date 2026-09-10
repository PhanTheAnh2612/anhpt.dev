---
title: Implement accessible typed React components
date: 2026-09-10
description: Implement a React component contract with native HTML, focused TypeScript props, predictable events, refs, and verifiable interaction states.
tags: ReactJS
thumbnail: /assets/journal/react-components/accessible-implementation.webp
---

# Implement accessible typed React components

Implementation begins with the platform contract. Choose the native element, preserve its behavior, narrow only the props your component truly controls, and test the states a user can reach. Styling comes after semantics because CSS cannot recreate a button's keyboard and form behavior reliably.

![A craftsperson measures and forges a semantic control with focus, disabled, and error states.](/assets/journal/react-components/accessible-implementation.webp)

_Types measure the public contract; semantic HTML and visible focus keep the finished control usable._

## Extend a native contract deliberately

This field wraps a label, hint, and validation message while retaining ordinary input props:

<!-- ::start:code-example -->

```tsx title="TextField.tsx"
import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'

type TextFieldProps = Omit<
  ComponentPropsWithRef<'input'>,
  'aria-describedby' | 'aria-invalid'
> & {
  label: string
  hint?: string
  error?: string
}

export function TextField({
  label,
  hint,
  error,
  id,
  ref,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="text-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        {...inputProps}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        id={inputId}
        ref={ref}
      />
      {hint && <p id={hintId}>{hint}</p>}
      {error && <p id={errorId}>{error}</p>}
    </div>
  )
}
```

<!-- ::end:code-example -->

React 19 function components can receive `ref` as a prop, so `forwardRef` is no longer required for this React-19-only contract. A library supporting React 18 still needs a compatible public API. The [React `forwardRef` reference](https://react.dev/reference/react/forwardRef) documents the transition.

The component takes ownership of `aria-describedby` and `aria-invalid` because it generates the related nodes. The caller retains normal input capabilities such as `name`, `autoComplete`, `required`, `value`, and `onChange`.

## Keep event contracts unsurprising

Prefer native event names and payloads when the wrapper behaves like the native control. A higher-level component may expose domain intent:

```tsx
<QuantityPicker value={quantity} onValueChange={setQuantity} />
```

`onValueChange` communicates a number rather than leaking an internal input event. Document whether the callback fires for keyboard input, pointer input, reset, and programmatic changes. Do not fire parent callbacks during render.

## Implement all reachable states

For an interactive component, verify at least:

- default, hover, focus-visible, active, disabled, and read-only where relevant;
- empty, valid, and invalid content;
- pointer, keyboard, and assistive-technology paths;
- narrow layout and text zoom;
- pending behavior that does not erase the user's draft;
- unmount and ref cleanup.

Disabled controls are removed from normal keyboard interaction and often from submission. Sometimes `aria-disabled` plus explicit event prevention is the correct contract; sometimes it creates a focusable dead end. Choose from the workflow, not from appearance.

## Test behavior through the public surface

A focused test should render the component as a caller does, activate it like a user, and assert the resulting accessible state. Avoid tests that know internal Hook calls or class names unless those classes are the maintained contract.

Development Strict Mode may exercise extra render and setup/cleanup cycles. Fix code that cannot tolerate balanced setup and cleanup instead of suppressing the check. Render purity also prepares components for React Compiler and concurrent scheduling. Review [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure).

<!-- ::start:quest difficulty="intermediate" -->

Implement one field or button from its native element outward. Exercise it by keyboard, verify its accessible name and description, test its disabled or pending state, and confirm a parent can use its ref only when imperative access is part of the public contract.

<!-- ::end:quest -->

The next article separates render calculations and user events from the smaller set of synchronization work that belongs in an Effect.
