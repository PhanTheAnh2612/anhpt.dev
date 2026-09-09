---
title: Manage a reservation form
date: 2026-09-09
description: Build a typed reservation form from shadcn/ui fields, keep state minimal, and validate dates before calling the API.
order: 3
category: react
level: core
---

# Manage a reservation form

The reservation form owns values the user is actively editing. Availability and validation messages are derived from those values or returned by the API; they do not need duplicate state.

## Add the field primitives

```sh title="terminal"
pnpm dlx shadcn@latest add button input label native-select alert
```

Use native date inputs for this first version. A calendar popover can wait until the product needs blocked-date visualization or more complex navigation.

```tsx title="src/features/reservations/ReservationForm.tsx"
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ReservationForm() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const checkIn = String(data.get('checkIn'))
    const checkOut = String(data.get('checkOut'))
    if (checkOut <= checkIn) {
      setStatus('error')
      return
    }
    setStatus('saving')
    // The API call is added in the next lesson.
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="guestName">Guest name</Label>
        <Input id="guestName" name="guestName" required />
      </div>
      <div>
        <Label htmlFor="checkIn">Check-in</Label>
        <Input id="checkIn" name="checkIn" type="date" required />
      </div>
      <div>
        <Label htmlFor="checkOut">Check-out</Label>
        <Input id="checkOut" name="checkOut" type="date" required />
      </div>
      <Button disabled={status === 'saving'}>
        {status === 'saving' ? 'Saving…' : 'Create reservation'}
      </Button>
      <p role="status" aria-live="polite">
        {status === 'error' ? 'Check-out must be after check-in.' : ''}
      </p>
    </form>
  )
}
```

Client validation improves feedback but never replaces server validation. The server alone can decide whether another reservation already occupies the room.

## Checkpoint

Test valid dates, equal dates, reversed dates, missing values, and keyboard submission. Ensure the button communicates its saving state without removing its accessible name.

## Keep learning

- [React: Responding to events](https://react.dev/learn/responding-to-events)
- [React: Choosing state structure](https://react.dev/learn/choosing-the-state-structure)
