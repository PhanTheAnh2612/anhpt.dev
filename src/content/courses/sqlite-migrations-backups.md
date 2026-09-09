---
title: Run migrations and backups
date: 2026-09-09
description: Version SQLite schema changes, migrate a fresh database predictably, and verify a restore before calling the data durable.
order: 3
category: databases
level: core
---

# Run migrations and backups

Changing a schema by hand works once and becomes unreliable. Keep numbered SQL migrations in Git and record which ones each database has applied.

## Use a migration ledger

Create a `schema_migrations` table with a unique migration name. At startup or in a dedicated command, read migration files in order, wrap each file and ledger insert in a transaction, and stop on the first failure.

Never edit a migration that has already reached another environment. Add the next migration instead.

```sql title="migrations/003_booking_reference.sql"
ALTER TABLE reservations ADD COLUMN booking_reference TEXT;
CREATE UNIQUE INDEX reservations_booking_reference_idx
  ON reservations(booking_reference)
  WHERE booking_reference IS NOT NULL;
```

## Back up deliberately

Stop writes or use the driver's supported online backup API before copying a live database. A backup is unproven until you restore it to a different path, start the API against it, and verify room and reservation counts plus one known record.

Do not commit real hotel data or backup files. Keep only schema and invented seed records in Git.

## Checkpoint

Starting from no database file, apply every migration and run the API tests. Create a backup, restore it to a temporary location, and repeat the read checks.

## Keep learning

- [SQLite backup API](https://www.sqlite.org/backup.html)
- [SQLite ALTER TABLE](https://www.sqlite.org/lang_altertable.html)
