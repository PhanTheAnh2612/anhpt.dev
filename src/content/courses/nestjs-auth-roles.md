---
title: Authentication and staff roles
date: 2026-09-09
description: Add staff sessions, authorization guards, audit events, and abuse controls only when the Hotel Manager leaves a trusted demo environment.
order: 90
category: nestjs
level: advanced
---

# Authentication and staff roles

A publicly reachable hotel system must not allow anonymous reservation changes. This optional route requires deliberate security design, so the core course uses local/demo data and does not pretend to be ready for real guest information.

## Separate identity from permission

Authentication establishes which staff member made a request. Authorization decides whether that identity may perform the action. A front-desk role might manage stays; an administrator might also change rooms and staff accounts.

Use a guard to require an authenticated principal, then a second policy or guard to evaluate the action. Enforce authorization on the server even if the React interface hides unavailable buttons.

## Protect the session

Prefer a mature identity provider or well-reviewed library. Use HTTPS, HttpOnly secure cookies, CSRF protection for cookie-authenticated mutations, short-lived sessions, rate limits, and session rotation after privilege changes. Never store raw passwords.

Record who changed a reservation, what operation occurred, and when. Keep audit records free of unnecessary sensitive guest data.

## Checkpoint

In a local test environment, prove an anonymous request is rejected, a front-desk user cannot change staff roles, and an administrator can. Confirm each denial is enforced by the API rather than only the interface.

## Keep learning

- [NestJS authentication](https://docs.nestjs.com/security/authentication)
- [NestJS authorization](https://docs.nestjs.com/security/authorization)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
