---
title: Put the hotel project on GitHub
date: 2026-09-09
description: Create a reviewable Git history, protect secrets and hotel data, and make every pull request prove the application still builds.
order: 1
category: deployment
level: core
---

# Put the hotel project on GitHub

Git records changes; GitHub hosts the repository and collaboration workflow. Keep the React app, Nest API, and migrations in one repository while the project is small.

## Use a simple repository shape

```text
hotel-manager/
├── apps/web/
├── apps/api/
├── migrations/
├── .env.example
├── .gitignore
└── README.md
```

Ignore `.env`, SQLite database files, backups, build output, and dependencies. Commit the lockfile, migration SQL, and invented seed data.

```sh title="terminal"
git init
git add .
git commit -m "Create hotel manager foundation"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/hotel-manager.git
git push -u origin main
```

## Add one verification workflow

Run install, type checking, tests, and builds for pull requests. Pin the Node and pnpm versions used locally. Keep deployment separate until this workflow is green.

Never upload real guest records to GitHub, issues, test fixtures, or screenshots. Names, contact details, stay dates, and notes may be personal data.

## Checkpoint

Clone the repository into a different directory, copy `.env.example` to `.env`, install with the frozen lockfile, create a fresh database, run tests, and start both applications.

## Keep learning

- [GitHub: Create a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitHub Actions](https://docs.github.com/en/actions)
