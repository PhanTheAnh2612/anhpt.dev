---
title: Accessibility and browser security boundaries
date: 2026-09-09
description: Review keyboard, screen-reader, same-origin, and injection boundaries after the basic Hotel Manager works.
order: 90
category: fundamentals
level: advanced
---

# Accessibility and browser security boundaries

This optional lesson deepens two concerns that cut across every feature. Finish the core route first.

## Test behavior, not a checklist

Complete the main flow with only a keyboard. Test at 200% zoom, with reduced motion enabled, and with a screen reader if one is available. Automated checks help, but they cannot decide whether instructions or status messages make sense.

## Keep text as text

When rendering a guest name or booking note, assign it to `textContent` or let React escape it. Do not insert user content with `innerHTML`.

```ts title="render-message.ts"
const cell = document.createElement('td')
cell.textContent = reservation.guestName
```

## Understand origins

An origin combines scheme, host, and port. A browser page at `http://localhost:5173` calling `http://localhost:3000` crosses origins, so the API must deliberately configure Cross-Origin Resource Sharing (CORS). CORS does not authenticate a user and does not protect the API from non-browser clients.

The server must still validate input, authorize protected actions, limit abusive traffic, and avoid leaking internal error details.

## Checkpoint

Submit `<img src=x onerror=alert(1)>` as a message in a local test. It must appear as text and never execute. Then complete the form with only the keyboard.

## Keep learning

- [OWASP: Cross Site Scripting prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
