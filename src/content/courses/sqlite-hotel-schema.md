---
title: Design the hotel SQLite schema
date: 2026-09-09
description: Model rooms and reservations with keys, checks, date conventions, and constraints that preserve the Hotel Manager's essential rules.
order: 1
category: databases
level: core
---

# Design the hotel SQLite schema

SQLite stores a complete relational database in a file, which makes local setup small. Let the schema reject impossible values even when application code has a bug.

## Create the first migration

```sql title="migrations/001_initial.sql"
PRAGMA foreign_keys = ON;

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('single', 'double')),
  nightly_rate_cents INTEGER NOT NULL CHECK (nightly_rate_cents >= 0),
  out_of_service INTEGER NOT NULL DEFAULT 0 CHECK (out_of_service IN (0, 1))
);

CREATE TABLE reservations (
  id INTEGER PRIMARY KEY,
  guest_name TEXT NOT NULL CHECK (length(trim(guest_name)) BETWEEN 1 AND 80),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked'
    CHECK (status IN ('booked', 'checked-in', 'checked-out', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (check_in < check_out)
);
```

Store calendar dates as zero-padded ISO `YYYY-MM-DD` strings so lexical ordering matches date ordering. Store currency as integer cents, not a floating-point number.

SQLite foreign-key enforcement is connection-specific. Enable it for every connection rather than assuming the declaration alone is active.

## Seed non-sensitive demo data

```sql title="migrations/002_rooms.sql"
INSERT INTO rooms (number, type, nightly_rate_cents) VALUES
  ('101', 'single', 8500),
  ('102', 'double', 12500),
  ('201', 'double', 14500);
```

## Checkpoint

Apply the schema to a new database. Try duplicate room numbers, a negative rate, and check-out before check-in; each invalid write should fail.

## Keep learning

- [SQLite CREATE TABLE](https://www.sqlite.org/lang_createtable.html)
- [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html)
