---
title: Connect NestJS to SQLite
date: 2026-09-09
description: Add a focused repository with prepared SQLite statements and keep database rows from leaking through the NestJS service boundary.
order: 2
category: databases
level: core
---

# Connect NestJS to SQLite

The service should express hotel rules; a repository should execute SQL. For this small app, a direct SQLite driver is easier to understand than an object-relational mapper.

## Install the driver

```sh title="terminal"
pnpm add better-sqlite3
pnpm add -D @types/better-sqlite3
```

Create one database provider, enable foreign keys, and close it during application shutdown. Resolve the path from validated configuration.

## Prepare queries

```ts title="src/reservations/reservations.repository.ts"
@Injectable()
export class ReservationsRepository {
  constructor(@Inject('SQLITE') private readonly db: Database.Database) {}

  findOverlap(roomId: number, checkIn: string, checkOut: string) {
    return this.db
      .prepare(
        `
      SELECT id FROM reservations
      WHERE room_id = ?
        AND status IN ('booked', 'checked-in')
        AND check_in < ?
        AND check_out > ?
      LIMIT 1
    `,
      )
      .get(roomId, checkOut, checkIn)
  }
}
```

Place values in parameters, never concatenate guest input into SQL. Map `snake_case` database rows to the API's `camelCase` response shape in one clear place.

The overlap lookup and insert must eventually run in one transaction; the advanced lesson handles concurrency. The core version is appropriate for one local process while you learn the flow.

## Checkpoint

Restart the API and confirm reservations remain. Submit a guest name containing an apostrophe and verify it is stored as data without changing the SQL statement.

## Keep learning

- [SQLite C API binding concepts](https://www.sqlite.org/c3ref/bind_blob.html)
- [NestJS custom providers](https://docs.nestjs.com/fundamentals/custom-providers)
