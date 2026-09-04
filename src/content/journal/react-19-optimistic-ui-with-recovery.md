---
title: Optimistic React 19 interfaces that tell the truth
date: 2026-09-03
description: Make a bookmark feel immediate with useOptimistic, then handle rejection without pretending the save succeeded.
tags: react, state-management, user-experience
---

# Optimistic React 19 interfaces that tell the truth

An optimistic interface makes a prediction. A trustworthy interface labels that prediction and explains when it was wrong. The speed boost is valuable only if the user can still tell the difference between “looks saved” and “is saved.”

For a first experiment, use a reversible, low-stakes interaction such as bookmarking an article. Keep checkout confirmation and other consequential workflows out of your first optimism refactor. The point is to learn the state model before layering it onto a complicated product promise.

## Two values, not two sources of truth

The confirmed value records the last accepted result. The optimistic value temporarily projects the requested change while an Action runs. `useOptimistic` derives that temporary view from its base value; it is not a persistence layer and does not make the request itself. Its reducer must remain pure. [useOptimistic reference](https://react.dev/reference/react/useOptimistic).

<!-- ::start:remember -->

Rollback repairs the screen, not the network. If a request times out after a server accepted it, the outcome may be unknown. Reconcile with the server before confidently reporting that nothing changed.

<!-- ::end:remember -->

## A demo with a real failure branch

This complete React 19 client component simulates both acceptance and rejection. The checkbox controls the next simulated response. It does not talk to a server, and reloading discards the bookmark.

<!-- ::start:code-example -->

```tsx title="OptimisticBookmark.tsx"
import { startTransition, useOptimistic, useState, useTransition } from 'react'

async function simulateSave(next: boolean, reject: boolean): Promise<boolean> {
  await new Promise<void>((resolve) => setTimeout(resolve, 900))
  if (reject) throw new Error('Simulated rejection')
  return next
}

export default function OptimisticBookmark() {
  const [confirmed, setConfirmed] = useState(false)
  const [rejectNext, setRejectNext] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, runAction] = useTransition()
  const [displayed, predict] = useOptimistic(
    confirmed,
    (_current: boolean, next: boolean) => next,
  )

  function toggleBookmark() {
    if (pending) return
    const next = !confirmed
    const shouldReject = rejectNext
    setError(null)

    runAction(async () => {
      predict(next)
      try {
        const saved = await simulateSave(next, shouldReject)
        startTransition(() => setConfirmed(saved))
      } catch {
        startTransition(() => {
          setError('Demo rejected the change. Your previous choice is intact.')
        })
      }
    })
  }

  return (
    <section aria-label="Bookmark demo">
      <label>
        <input
          type="checkbox"
          checked={rejectNext}
          disabled={pending}
          onChange={(event) => setRejectNext(event.target.checked)}
        />
        Reject the next save
      </label>
      <button
        type="button"
        aria-pressed={displayed}
        disabled={pending}
        onClick={toggleBookmark}
      >
        {displayed ? 'Bookmarked' : 'Bookmark'}
      </button>
      <p role="status">
        {pending
          ? 'Saving your choice...'
          : (error ??
            (confirmed ? 'Bookmark saved in this demo.' : 'Not saved.'))}
      </p>
    </section>
  )
}
```

<!-- ::end:code-example -->

The optimistic setter runs inside the Action, before the `await`. On acceptance, the confirmed state adopts the result. On rejection, the base value stays unchanged; when the Action finishes, the temporary prediction disappears. The separate error message explains why. This is the same recovery principle documented for optimistic deletion. [Optimistic error recovery](https://react.dev/reference/react/useOptimistic#optimistic-delete-with-error-recovery).

## Keep the async boundary visible

The nested `startTransition` calls are intentional. Updates after an `await` currently need another wrapper to be marked as Transitions. The outer `useTransition` gives us the pending indicator; the standalone `startTransition` function does not provide one. [startTransition caveats](https://react.dev/reference/react/startTransition#caveats).

Do not move `predict(next)` into an ordinary click handler outside the Action. Also do not replace the confirmed value before the simulated request returns. That would erase the distinction the example relies on: a rejected prediction must have a reliable value to fall back to.

<!-- ::start:note -->

The disabled button deliberately permits one request at a time. This is an interaction choice, not a general solution to concurrent writes. Multiple tabs, background refreshes, and retries still need a data-layer policy.

<!-- ::end:note -->

## What changes with a real API?

Use the server's accepted value as the base, especially if it normalizes or rejects changes. Keep expected business rejections distinct from connection failures. For retried mutations, consider an idempotency key or a request that sets an explicit value instead of blindly toggling it. Those choices belong in the API contract, not inside the optimistic reducer.

If your application already owns this value in a query cache, coordinate with that cache rather than maintaining an unrelated permanent copy in component state. Write down who updates the confirmed record and when it is refreshed. A tiny ownership note can prevent hours of debugging a bookmark that mysteriously flips back.

<!-- ::start:challenge difficulty="intermediate" -->

Accept a save, then reject the opposite change. Confirm that the button immediately previews the new choice, returns to the previously accepted choice, announces the rejection, and becomes usable again. Repeat with keyboard activation and slow simulated latency.

<!-- ::end:challenge -->

The success criterion is not “the button changed instantly.” It is “the button changed instantly, and every eventual outcome remained understandable.”
