---
title: Model React events, reducers, middleware, and commands
date: 2026-09-10
description: Modernize Observer, Mediator, Middleware, and Command patterns with event handlers, pure reducers, service boundaries, and traceable effects.
tags: ReactJS
thumbnail: /assets/journal/react-components/events-reducers-commands.webp
---

# Model React events, reducers, middleware, and commands

React already provides a direct path for most interaction: an event handler describes what the user did, state records the result, and rendering calculates the next interface. Add a mediator, command bus, or middleware chain only when it owns a real boundary. Pattern names should explain complexity, not manufacture it.

![A user action enters a clear reducer console, producing a state card while one deliberate side-effect parcel exits through a service gate.](/assets/journal/react-components/events-reducers-commands.webp)

_Keep state transitions visible and pure; send unavoidable side effects through a named boundary._

## Start with a plain event handler

If a button affects its nearest state owner, call an ordinary function:

```tsx
function CartLine({ item, onQuantityChanged }: CartLineProps) {
  return (
    <button onClick={() => onQuantityChanged(item.id, item.quantity + 1)}>
      Add one
    </button>
  )
}
```

This is easier to follow than publishing a generic event and hoping an unseen subscriber reacts. Callback props keep the direction visible: data flows down; user intent flows to the owner.

## Use reducers for state transitions, not side effects

A reducer is useful when several events update related state or when transition rules deserve isolated tests:

```ts title="checkout-reducer.ts"
type CheckoutEvent =
  | { type: 'address.changed'; address: Address }
  | { type: 'submission.started' }
  | { type: 'submission.failed'; message: string }

function checkoutReducer(state: State, event: CheckoutEvent): State {
  switch (event.type) {
    case 'submission.started':
      return { ...state, status: 'submitting', error: null }
    case 'submission.failed':
      return { ...state, status: 'editing', error: event.message }
    default:
      return state
  }
}
```

Reducers must stay pure. They describe a transition; they do not send analytics, write storage, or call an API. The event name should describe what happened rather than which field to mutate.

## Put commands at capability boundaries

A command is valuable when the caller should request a capability without knowing transport details:

```ts
type SaveProfile = (draft: ProfileDraft) => Promise<Profile>

export function ProfileEditor({ saveProfile }: { saveProfile: SaveProfile }) {
  // The component owns editing states; the injected capability owns transport.
}
```

This is ordinary dependency injection, not a requirement for a global command bus. A route action, server function, mutation function, or service adapter can implement the capability. Keep success and failure visible in the component contract.

## Add middleware where work truly passes through a pipeline

Middleware earns its place at a shared transport or event boundary: authenticate a request, attach tracing, normalize an error, retry an idempotent operation, or redact a log. UI state updates rarely need a home-grown middleware framework.

A useful chain has an explicit input, output, order, and failure policy. Avoid middleware that mutates arbitrary objects or makes user actions trigger surprising global work. If order changes behavior, test the order.

## Treat pub/sub as infrastructure

Observer-style events remain appropriate for sources with multiple independent consumers: WebSocket messages, media queries, cross-tab messages, or an application telemetry stream. Wrap the subscription in a focused custom Hook or external-store adapter. Components should ask for `useConnectionStatus()` rather than know channel names and unsubscribe rules.

React’s [custom Hooks guidance](https://react.dev/learn/reusing-logic-with-custom-hooks) emphasizes concrete, high-level names and warns against generic lifecycle wrappers. A Hook shares stateful logic, not one shared state instance.

## A practical decision order

1. Direct callback for a local user interaction.
2. Reducer for related, testable state transitions.
3. Injected async capability for a server or platform command.
4. Middleware for a real shared pipeline.
5. Pub/sub only for independently subscribed infrastructure events.

<!-- ::start:quest difficulty="intermediate" -->

Trace one important click from accessible control to state transition and external effect. Remove any global event that has one known receiver. Make the remaining reducer pure and name the service boundary that owns the side effect.

<!-- ::end:quest -->

The next article keeps Prototype, Factory, Flyweight, and Module knowledge as JavaScript literacy while replacing their ritual forms with simpler modern tools.
