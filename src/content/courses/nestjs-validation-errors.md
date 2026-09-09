---
title: Validate reservations at the API boundary
date: 2026-09-09
description: Validate reservation request bodies, express business conflicts clearly, and return stable HTTP errors without leaking internals.
order: 2
category: nestjs
level: core
---

# Validate reservations at the API boundary

Types disappear at runtime. A request can omit fields or send unexpected values, so validate it before the service makes booking decisions.

## Enable validation

```sh title="terminal"
pnpm add class-validator class-transformer
```

```ts title="src/main.ts"
app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173' })
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
```

```ts title="src/reservations/dto/create-reservation.dto.ts"
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateReservationDto {
  @IsString() @IsNotEmpty() @MaxLength(80) guestName!: string
  @IsInt() roomId!: number
  @IsDateString() checkIn!: string
  @IsDateString() checkOut!: string
}
```

Decorators validate shape. The service must still verify that check-out follows check-in, the room exists, and no active reservation overlaps the requested dates.

Use `BadRequestException` for invalid dates, `NotFoundException` for a missing room, and `ConflictException` when the room is already reserved. Do not send stack traces, SQL text, or secrets to the client.

## Define overlap once

Two half-open stays `[checkIn, checkOut)` overlap when `existing.checkIn < checkOut && existing.checkOut > checkIn`. This lets one guest check out on the day another checks in.

## Checkpoint

Try a valid request, missing guest name, reversed dates, unknown room, and overlapping stay. Confirm each response status and message helps the React UI choose its next state.

## Keep learning

- [NestJS validation](https://docs.nestjs.com/techniques/validation)
- [NestJS exception filters](https://docs.nestjs.com/exception-filters)
