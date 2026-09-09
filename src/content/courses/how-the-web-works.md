---
title: How a web application works
date: 2026-09-09
description: Follow one browser request from a URL to an HTTP response and create the files for a small Hotel Management application.
order: 1
category: fundamentals
level: core
---

# How a web application works

A web application is a conversation. The browser requests a resource, a server returns a response, and the browser turns HTML, CSS, and JavaScript into a page you can use. You only need this small model before writing code.

## Create the hotel project

Make a folder named `hotel-manager` with these files:

```text
hotel-manager/
├── index.html
├── styles.css
└── app.js
```

Open the folder in your editor. Use a small local server rather than double-clicking `index.html`; modules and network requests behave more like production over HTTP.

```sh title="terminal"
npx serve .
```

Visit the URL printed by the command. In browser DevTools, open Network and reload. The first request returns HTML. The HTML then points the browser to the stylesheet and script, creating more requests.

## Give each layer one job

- HTML describes the content and controls.
- CSS controls presentation and responsive layout.
- JavaScript responds to events and exchanges data.
- HTTP carries requests and responses between the browser and an API.

Status codes summarize an outcome: `200` means the request succeeded, `201` means a resource was created, `400` means the request was invalid, and `500` means the server failed unexpectedly.

<!-- ::start:note -->

The browser is not a trusted boundary. A user can inspect and change requests, so the API must validate every value again.
<!-- ::end:note -->

## Checkpoint

Serve the empty project, find the document request in DevTools, and identify its URL, method, status, and response content type.

## Keep learning

- [MDN: How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
