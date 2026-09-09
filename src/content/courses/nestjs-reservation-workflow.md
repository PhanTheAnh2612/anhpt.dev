---
title: Implement the reservation workflow
date: 2026-09-09
description: Create reservations and explicit check-in, check-out, and cancellation transitions without turning the API into generic CRUD.
order: 3
category: nestjs
level: core
---

# Implement the reservation workflow

Hotel actions have rules. Model them as named operations rather than exposing unrestricted updates to every reservation field.

## Design the endpoints

```text
GET    /rooms
GET    /reservations?from=2026-09-09&to=2026-09-10
POST   /reservations
PATCH  /reservations/:id/check-in
PATCH  /reservations/:id/check-out
PATCH  /reservations/:id/cancel
```

```ts title="src/reservations/reservations.controller.ts"
@Post()
create(@Body() input: CreateReservationDto) {
  return this.reservations.create(input)
}

@Patch(':id/check-in')
checkIn(@Param('id', ParseIntPipe) id: number) {
  return this.reservations.changeStatus(id, 'checked-in')
}
```

The service permits `booked → checked-in → checked-out` and `booked → cancelled`. Reject impossible transitions with `409 Conflict`. Repeat requests should not silently create a second reservation.

## Keep room and reservation status distinct

A room marked out of service cannot accept a stay. Occupancy for a date range comes from reservations; avoid permanently copying it into the room row unless you have a carefully synchronized operational need.

## Checkpoint

Create a reservation, check it in, check it out, and attempt the same check-in again. Confirm the final request fails without changing stored state.

## Keep learning

- [NestJS route parameters](https://docs.nestjs.com/controllers#route-parameters)
- [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
