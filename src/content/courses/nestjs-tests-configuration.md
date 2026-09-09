---
title: Test and configure the hotel API
date: 2026-09-09
description: Separate configuration from code and test the reservation rules plus one complete HTTP flow before adding persistence.
order: 4
category: nestjs
level: core
---

# Test and configure the hotel API

Tests protect business decisions that are easy to break: date overlap, room availability, and status transitions.

## Keep configuration explicit

```sh title="terminal"
pnpm add @nestjs/config
```

Load `ConfigModule.forRoot({ isGlobal: true })` in `AppModule`. Document these local values in `.env.example` but never commit `.env`:

```dotenv title=".env.example"
PORT=3000
WEB_ORIGIN=http://localhost:5173
DATABASE_PATH=./data/hotel.sqlite
```

## Test at two useful levels

A service test calls the reservation service with an in-memory fake store and checks rules quickly. One end-to-end test starts the Nest application and sends HTTP requests to prove routing, validation, and error mapping work together.

```ts title="reservations.service.spec.ts"
it('rejects an overlapping active reservation', async () => {
  await service.create(firstStay)
  await expect(service.create(overlappingStay)).rejects.toThrow(
    ConflictException,
  )
})
```

Avoid tests that only assert Nest decorators exist. Test returned data and observable failures.

## Checkpoint

Run the suite from a clean checkout. Include successful booking, same-day turnover, overlap, unavailable room, invalid transition, and missing-field cases.

## Keep learning

- [NestJS testing](https://docs.nestjs.com/fundamentals/testing)
- [NestJS configuration](https://docs.nestjs.com/techniques/configuration)
