---
title: Render the room dashboard
date: 2026-09-09
description: Turn typed room data into small React components and a responsive shadcn/ui table with clear status labels.
order: 2
category: react
level: core
---

# Render the room dashboard

The dashboard answers one question first: which rooms are available, occupied, or out of service? Keep the data model independent from its visual presentation.

## Define the room model

```ts title="src/features/rooms/types.ts"
export type RoomStatus = 'available' | 'occupied' | 'out-of-service'

export type Room = {
  id: number
  number: string
  type: 'single' | 'double'
  status: RoomStatus
  nightlyRate: number
}
```

## Render a plain table first

Add the shadcn/ui Table if you did not add it in setup:

```sh title="terminal"
pnpm dlx shadcn@latest add table badge
```

Use `TableHeader` and `TableHead` so column meanings are available to assistive technology. Format money for display without changing the stored number.

```tsx title="src/features/rooms/RoomTable.tsx"
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Room } from './types'

export function RoomTable({ rooms }: { rooms: Room[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.number}</TableCell>
            <TableCell>{room.type}</TableCell>
            <TableCell>
              <Badge variant="outline">{room.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

For the small dataset in this course, shadcn/ui's plain Table is enough. Do not add TanStack Table, pagination, sorting, or column configuration until real requirements justify them.

## Checkpoint

Render at least three room states and an empty state. At 390 pixels wide, confirm the user can still associate every value with its column or switch to a stacked room-card presentation.

## Keep learning

- [shadcn/ui Table](https://ui.shadcn.com/docs/components/radix/table)
- [React: Rendering lists](https://react.dev/learn/rendering-lists)
