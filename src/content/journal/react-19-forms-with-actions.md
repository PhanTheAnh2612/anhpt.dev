---
title: React 19 forms without the pending-state puzzle
date: 2026-09-03
description: Give Actions, useActionState, and useFormStatus one clear job each, with a client-only form you can actually try.
tags: react, forms, typescript
---

# React 19 forms without the pending-state puzzle

A useful form answers three questions: what am I submitting, is it still happening, and what should I do next? React 19 gives us smaller pieces for those answers. The interesting improvement is not deleting every state variable. It is making each variable responsible for one thing.

This preview uses a client-only display-name form. Its simulated request is deliberately visible in the file: paste it into a React 19 TypeScript app, render the default export, and try both a normal name and `admin`. Nothing is stored or sent anywhere.

## Give each API one job

The function passed to a form's `action` runs as a Transition and receives the submitted `FormData`. You do not need the usual `preventDefault()` wrapper. This is a React DOM capability, not a requirement to adopt Server Components. [React form reference](https://react.dev/reference/react-dom/components/form).

`useActionState` keeps the Action's returned result. Its callback receives **previous state first**, then the submission payload; forgetting that extra argument is an easy migration mistake. Here, the result is a status and a human-readable message. [useActionState reference](https://react.dev/reference/react/useActionState).

<!-- ::start:trainer-tip pose="teach" -->

Keep the editable draft separate from the submission result. An error describes the last attempt; it should not erase the user's next attempt.

<!-- ::end:trainer-tip -->

## A complete client demo

<!-- ::start:code-example -->

```tsx title="DisplayNameForm.tsx"
import { useActionState, useId, useState } from 'react'
import { useFormStatus } from 'react-dom'

type Result = {
  status: 'idle' | 'error' | 'success'
  message: string
}

async function saveName(_: Result, data: FormData): Promise<Result> {
  const value = data.get('displayName')
  const name = typeof value === 'string' ? value.trim() : ''

  if (name.length < 2) {
    return { status: 'error', message: 'Use at least two characters.' }
  }

  // Demo latency and rejection: no network request or persistence.
  await new Promise<void>((resolve) => setTimeout(resolve, 700))
  if (name.toLowerCase() === 'admin') {
    return { status: 'error', message: 'That name is reserved. Try another.' }
  }
  return { status: 'success', message: `Demo accepted: ${name}.` }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Checking name...' : 'Check name'}
    </button>
  )
}

export default function DisplayNameForm() {
  const id = useId()
  const [draft, setDraft] = useState('')
  const [result, formAction, pending] = useActionState<Result, FormData>(
    saveName,
    {
      status: 'idle',
      message: '',
    },
  )

  return (
    <form action={formAction}>
      <label htmlFor={id}>Display name</label>
      <input
        id={id}
        name="displayName"
        required
        minLength={2}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        readOnly={pending}
        aria-describedby={`${id}-result`}
        aria-invalid={!pending && result.status === 'error'}
      />
      <SubmitButton />
      <p id={`${id}-result`} role="status">
        {pending ? 'Checking your submission...' : result.message}
      </p>
    </form>
  )
}
```

<!-- ::end:code-example -->

The parent uses its pending flag to lock the draft during this small workflow. The button independently reads the surrounding form's status, which makes that button reusable without threading a prop through intermediate components. `useFormStatus` must run in a **descendant** of the form; calling it in the component that returns the form does not observe that form. [useFormStatus reference](https://react.dev/reference/react-dom/hooks/useFormStatus).

## Decide what failure means

Reserved names are expected outcomes, so the demo returns them as state. A real request adapter should distinguish validation responses, unavailable services, and unexpected programming errors. Avoid teaching the UI that every exception means “please choose another name.” React can route thrown Action errors to an Error Boundary; returned validation state stays with the form. [Action error handling](https://react.dev/reference/react/useActionState#handling-errors).

<!-- ::start:warning -->

An Action that resolves normally can reset uncontrolled fields, even when your returned object represents a validation error. This demo controls the input, so the draft remains available. Choose reset behavior deliberately before replacing an existing form. [Form reset behavior](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-an-action-prop).

<!-- ::end:warning -->

The browser's `required` and `minLength` checks improve feedback, but the Action still checks the value. When connecting a backend, repeat validation and authorization there; a disabled button is a user-interface convenience, not a security boundary. Also check non-success HTTP responses explicitly when using `fetch`.

## Try the unhappy path first

<!-- ::start:quest difficulty="beginner" -->

Submit `admin`, correct it without retyping the whole form, then submit a valid name using the keyboard. Check that pending copy appears, the result is announced, and the field stays readable. Replace only the simulated request after this interaction feels right.

<!-- ::end:quest -->

For a client-only app, stop here. Working without JavaScript needs an actual browser form endpoint or a framework-supported Server Function integration; changing a callback's name to “server action” does not provide one. Keep that architectural decision separate from this small form refactor.
