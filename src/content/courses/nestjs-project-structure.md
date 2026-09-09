---
title: Structure the NestJS hotel API
date: 2026-09-09
description: Create a NestJS API and separate room and reservation HTTP concerns into small modules, controllers, and services.
order: 1
category: nestjs
level: core
---

# Structure the NestJS hotel API

NestJS organizes an API around modules. Controllers translate HTTP requests and responses; providers hold application decisions. Start with rooms and reservations—guests can remain part of a reservation until the product needs independent guest profiles.

## Create the API

```sh title="terminal"
pnpm dlx @nestjs/cli new hotel-api --package-manager pnpm
cd hotel-api
pnpm nest generate module rooms
pnpm nest generate controller rooms
pnpm nest generate service rooms
pnpm nest generate module reservations
pnpm nest generate controller reservations
pnpm nest generate service reservations
pnpm start:dev
```

## Add the first endpoint

```ts title="src/rooms/rooms.controller.ts"
import { Controller, Get } from '@nestjs/common'
import { RoomsService } from './rooms.service'

@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  findAll() {
    return this.rooms.findAll()
  }
}
```

```ts title="src/rooms/rooms.service.ts"
import { Injectable } from '@nestjs/common'

@Injectable()
export class RoomsService {
  findAll() {
    return [{ id: 1, number: '101', type: 'single', status: 'available' }]
  }
}
```

Keep the temporary array only until the SQLite route. Do not create a generic repository layer before two consumers need one.

## Checkpoint

Request `GET http://localhost:3000/rooms`. Trace the call from controller to service and explain why the controller does not own the room array.

## Keep learning

- [NestJS first steps](https://docs.nestjs.com/first-steps)
- [NestJS controllers](https://docs.nestjs.com/controllers)
- [NestJS providers](https://docs.nestjs.com/providers)
