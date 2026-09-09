---
title: Add typed browser behavior
date: 2026-09-09
description: Model rooms and reservations with TypeScript, submit data with Fetch, and handle success, empty, and failure states explicitly.
order: 4
category: fundamentals
level: core
---

# Add typed browser behavior

JavaScript connects the form to an API. TypeScript catches mismatched shapes while you edit, but runtime checks are still needed because network data is untrusted.

## Model the boundary

```ts title="reservation.ts"
export type Reservation = {
  id: number
  guestName: string
  roomId: number
  checkIn: string
  checkOut: string
  status: 'booked' | 'checked-in' | 'checked-out' | 'cancelled'
}

export type CreateReservation = Pick<
  Reservation,
  'guestName' | 'roomId' | 'checkIn' | 'checkOut'
>
```

## Send a request

```ts title="api.ts"
import type { CreateReservation, Reservation } from './reservation'

const API_URL = 'http://localhost:3000/reservations'

export async function createReservation(input: CreateReservation) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`)
  }

  return (await response.json()) as Reservation
}
```

`fetch` only rejects for network-level failures. Check `response.ok` before treating an HTTP error as success. A later lesson will replace the type assertion with shared validation at the API boundary.

## Represent every visible state

The interface needs ordinary, submitting, success, validation-error, network-error, empty-list, and populated-list states. Write down the message shown for each before adding animation or polish.

<!-- ::start:warning -->

Do not put API keys in browser code. Anything shipped to the browser can be read by visitors.
<!-- ::end:warning -->

## Checkpoint

Use DevTools to simulate offline mode. Submit the form and confirm the failure is explained, the form remains usable, and the entered message is not silently lost.

## Keep learning

- [MDN: Making network requests](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
