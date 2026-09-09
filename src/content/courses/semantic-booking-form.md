---
title: Build a semantic booking form
date: 2026-09-09
description: Mark up an accessible reservation form and room list that remain understandable before CSS or JavaScript loads.
order: 2
category: fundamentals
level: core
---

# Build a semantic booking form

Start with the content and browser behavior you want. The Hotel Manager needs a heading, a reservation form, and a room-status list.

## Write useful HTML

```html title="index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hotel Manager</title>
    <link rel="stylesheet" href="styles.css" />
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <main>
      <h1>Hotel Manager</h1>
      <p>Create a reservation and review room availability.</p>

      <form id="reservation-form">
        <label for="guest-name">Guest name</label>
        <input id="guest-name" name="guestName" required maxlength="80" />

        <label for="room">Room</label>
        <select id="room" name="roomId" required>
          <option value="">Choose an available room</option>
        </select>

        <label for="check-in">Check-in</label>
        <input id="check-in" name="checkIn" type="date" required />

        <label for="check-out">Check-out</label>
        <input id="check-out" name="checkOut" type="date" required />

        <button type="submit">Create reservation</button>
        <p id="form-status" role="status" aria-live="polite"></p>
      </form>

      <section aria-labelledby="rooms-heading">
        <h2 id="rooms-heading">Rooms</h2>
        <ul id="room-list"></ul>
      </section>
    </main>
  </body>
</html>
```

Labels give controls accessible names and enlarge the useful click target. `required` and `maxlength` provide a helpful first validation layer. The live status region can announce a result without moving keyboard focus.

## Test before styling

Use Tab and Shift+Tab to visit every control. Submit an empty form and confirm the browser explains what is missing. Zoom to 200% and check that content remains readable.

<!-- ::start:remember -->

Placeholder text is an example, not a replacement for a visible label.
<!-- ::end:remember -->

## Checkpoint

Open the page without CSS or JavaScript. A reader should still understand the purpose, fields, action, and room region.

## Keep learning

- [MDN: Forms and buttons](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms)
- [WAI: Forms tutorial](https://www.w3.org/WAI/tutorials/forms/)
