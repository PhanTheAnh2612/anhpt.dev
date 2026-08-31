---
title: PostgreSQL basics
date: 2026-08-31
description: Store application data with a simple schema and safe queries.
order: 4
category: databases
---

# PostgreSQL basics

Move from temporary in-memory data to tables, keys, constraints, migrations, and parameterized queries.

## First checkpoint

Model the rules in the database instead of relying only on application code.

```sql title="projects.sql"
create table projects (
  id bigint generated always as identity primary key,
  title text not null
);
```

## Finish line

Persist and retrieve the guestbook or project data used by your website.
