---
title: Password authentication with secure server sessions
date: 2026-09-09
description: Build a defensible password and cookie-session flow in NestJS and React, including rotation, CSRF, recovery, and revocation.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-passwords-and-sessions.webp
socialImage: /assets/journal/auth/thumbnails/auth-passwords-and-sessions.jpg
---

# Password authentication with secure server sessions

Passwords remain useful when every user can keep a secret and federation or passkeys are unavailable. The safe design is not “compare a password and set a cookie.” It includes slow password hashing, enumeration-resistant responses, throttling, session rotation, Cross-Site Request Forgery (CSRF) protection, recovery, and revocation.

![A browser exchanges a credential for a protected session, then rotates the session while invalidated credentials are discarded.](/assets/journal/auth/session-token-flow.webp)

_The initial credential opens the session gate. Later requests carry the session identifier, while rotation replaces old credentials instead of extending them forever._

## How the method works

Store a salted password verifier produced by a purpose-built password hash such as Argon2id. After successful verification, create a high-entropy opaque session ID, store only its protected lookup value server-side, and send the ID in a `Secure`, `HttpOnly` cookie with an intentional `SameSite` policy. Rotate the session after login and privilege changes.

Use this for same-origin web products, administrative tools, and systems that need immediate server-side revocation. Avoid it when another organization must own the identity lifecycle or when users cannot safely recover a password.

## NestJS and React example

<!-- ::start:code-example -->

```ts title="auth.controller.ts"
import { Body, Controller, Post, Res } from '@nestjs/common'
import type { Response } from 'express'

@Post('login')
async login(@Body() input: LoginDto, @Res({ passthrough: true }) res: Response) {
  const user = await this.auth.verifyPassword(input.email, input.password)
  const session = await this.sessions.issue(user.id) // random, rotated, expiring
  res.cookie('__Host-session', session.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: session.ttlMs,
  })
  return { user: { id: user.id, name: user.name } }
}
```

```tsx title="LoginForm.tsx"
import type { FormEvent } from 'react'

async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const fields = new FormData(event.currentTarget)
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: fields.get('email'),
      password: fields.get('password'),
    }),
  })
  if (!response.ok) throw new Error('Sign-in failed')
  return response.json()
}
```

<!-- ::end:code-example -->

### How to apply this flow

1. Put the NestJS handler in an `AuthController`, inject password and session services through its constructor, and register the controller in `AuthModule`.
2. Mount React's form with `onSubmit={submit}` and give the email and password inputs matching `name` attributes.
3. Prefer one site for browser and API; otherwise configure credentialed CORS and CSRF protection before using the cookie across origins.

#### Integration example

Register the controller and its dependencies in a feature module, then mount the form in your React route:

```ts title="auth.module.ts"
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { PasswordService } from './password.service'
import { SessionService } from './session.service'
import { UsersService } from './users.service'

@Module({
  controllers: [AuthController],
  providers: [PasswordService, SessionService, UsersService],
  exports: [SessionService],
})
export class AuthModule {}
```

```tsx title="login-page.tsx"
import { FormEvent, useState } from 'react'
import { login } from './auth-api'

export function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await login(String(form.get('email')), String(form.get('password')))
      window.location.assign('/account')
    } catch {
      setError('Email or password is incorrect')
    }
  }

  return (
    <form onSubmit={handleSubmit}>{/* named email/password inputs */}</form>
  )
}
```

The example omits schema validation, the password-hashing adapter, rate limiting, audit logging, and CSRF middleware. The browser never needs to read the session ID. For cross-site frontend/API deployments, evaluate `SameSite=None; Secure`, credentialed Cross-Origin Resource Sharing (CORS), and a robust CSRF token pattern together.

## Tradeoffs and failure modes

- Server sessions make logout, account disablement, and device lists straightforward, but a shared session store becomes critical infrastructure.
- Password hashing adds deliberate CPU and memory cost. Tune it on production-class hardware and cap concurrent verification work.
- Generic failure messages reduce account enumeration; logging can retain a safe internal reason.
- Long-lived cookies improve convenience but widen the theft window. Use idle and absolute expiry, reauthentication for sensitive actions, and session rotation.
- Do not store plaintext, reversible encryption, or a fast unsalted hash. Do not silently truncate passwords.
- Password reset, email change, and support-assisted recovery can bypass the main flow; secure and audit them to the same standard.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="Why are Argon2id, scrypt, or bcrypt preferable to SHA-256 for password storage?" -->

They are deliberately slow and tunable, making each offline guess expensive. SHA-256 is optimized for speed and lets attackers test guesses cheaply.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is the difference between a salt and a pepper?" -->

A unique public salt defeats shared precomputed hashes. A pepper is a separate application secret kept outside the password database.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you prevent login and password-reset enumeration?" -->

Return similar status, wording, and timing whether the account exists; rate-limit by several signals and keep the precise reason only in protected logs.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is session fixation, and when should a session ID rotate?" -->

Session fixation makes a victim authenticate an attacker-known identifier. Rotate the ID after login, privilege change, and other trust-level transitions.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Which cookie attributes matter and what does each defend against?" -->

`Secure` limits transmission to HTTPS, `HttpOnly` blocks direct JavaScript reads, `SameSite` limits cross-site attachment, and a host-only scoped path reduces exposure.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why does `HttpOnly` reduce token theft without preventing all XSS impact?" -->

`HttpOnly` makes direct cookie exfiltration harder, but injected script can still issue authenticated requests and alter or read page data.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When is `SameSite=Lax` insufficient?" -->

It is insufficient for intentionally cross-site requests, embedded applications, or flows needing `SameSite=None`; those need explicit CSRF and origin controls.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you implement logout from all devices?" -->

Track sessions by user and device, revoke every record or advance a user session version, and reject old identifiers on the next request.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What are idle, absolute, and renewal timeouts?" -->

Idle timeout limits inactivity, absolute timeout caps total lifetime, and renewal rotates identifiers during an active session without exceeding the absolute limit.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you throttle credential stuffing without enabling denial of service against one account?" -->

Combine per-account, per-network, and global adaptive limits with backoff and monitoring. Avoid a simple lockout that attackers can trigger for a victim.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why must the server authorize every request after login?" -->

Login proves identity only at one moment. Every later action still needs a resource-aware policy check using the current principal and state.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Which recovery paths can downgrade the authentication assurance?" -->

Weak email reset, support overrides, security questions, or unverified phone changes can bypass the primary authenticator and define the system's real assurance.

<!-- ::end:interview-question -->

## Primary references

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN Set-Cookie reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

<!-- ::start:quest difficulty="advanced" -->

Test successful login, wrong-password login, session rotation, expiry, CSRF rejection, account disablement, and logout from all devices. Verify that responses do not reveal whether an email exists.

<!-- ::end:quest -->
