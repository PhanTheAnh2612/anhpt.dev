---
title: Transactions, conflicts, and indexes
date: 2026-09-09
description: Make overlapping reservations safe under concurrent writes, inspect query plans, and add only the indexes the workload needs.
order: 90
category: databases
level: advanced
---

# Transactions, conflicts, and indexes

The core repository can race: two requests may both observe no overlap before either inserts. Production booking requires a serialized decision.

## Protect the check-and-write

Run the overlap query and insert in one immediate transaction. Keep it short and do not perform network calls inside it. Configure a reasonable busy timeout and translate an exhausted lock wait into a retryable service response.

SQLite has one writer at a time. That is often a good tradeoff for a small hotel workload, but measure before claiming it fits a larger deployment.

## Index the actual query

```sql title="migrations/004_overlap_index.sql"
CREATE INDEX reservations_room_dates_idx
  ON reservations(room_id, check_in, check_out)
  WHERE status IN ('booked', 'checked-in');
```

Use `EXPLAIN QUERY PLAN` on the overlap query before and after adding the index. Every index speeds some reads while adding storage and write work.

For Cloudflare deployment, D1 provides SQLite semantics through a Worker binding rather than a persistent local file. Recheck transaction and query behavior against D1 documentation; do not assume every Node SQLite driver behavior transfers unchanged.

## Checkpoint

Send two simultaneous requests for the same room and dates. Exactly one should create a reservation. Explain what serializes the decision and how the losing request is reported.

## Keep learning

- [SQLite transactions](https://www.sqlite.org/lang_transaction.html)
- [SQLite query planner](https://www.sqlite.org/queryplanner.html)
- [Cloudflare D1 overview](https://developers.cloudflare.com/d1/)
