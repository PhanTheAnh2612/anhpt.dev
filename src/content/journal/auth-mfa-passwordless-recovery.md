---
title: MFA, OTP, magic links, and recovery as one system
date: 2026-09-09
description: Compare TOTP, SMS, push, recovery codes, and email magic links while designing enrollment and recovery that resist bypass.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-mfa-passwordless-recovery.webp
socialImage: /assets/journal/auth/thumbnails/auth-mfa-passwordless-recovery.jpg
---

# MFA, OTP, magic links, and recovery as one system

Multi-factor authentication (MFA) combines independent factor types: something you know, possess, or are. Two passwords are not two factors. A one-time password (OTP), approval push, magic link, and recovery code each has a different threat model; calling all of them “2FA” hides important weaknesses.

![A device passkey, time-based code, hardware token, phone approval, and sealed email link converge on one guarded application entrance.](/assets/journal/auth/passkey-mfa-flow.webp)

_Each path proves something different. Enrollment and recovery must preserve the intended assurance instead of silently routing every loss through the weakest channel._

## Compare the common methods

| Method                | Useful for                             | Main weakness                                |
| --------------------- | -------------------------------------- | -------------------------------------------- |
| Time-based OTP (TOTP) | broad offline authenticator support    | phishable, shared enrollment secret          |
| SMS/voice OTP         | reach and recovery                     | SIM swap, interception, delivery reliability |
| Push approval         | convenient step-up                     | fatigue attacks and device compromise        |
| Security key/passkey  | phishing-resistant MFA or passwordless | provisioning and recovery work               |
| Recovery code         | emergency possession fallback          | static bearer secret                         |
| Email magic link      | low-friction passwordless sign-in      | mailbox security, link forwarding/scanning   |

Use MFA for privileged accounts, sensitive data, high-value transactions, and risk-triggered step-up. Prefer phishing-resistant factors where feasible. A magic link can remove a site password, but it is only as strong as the email account and the link-handling design.

## Model assurance, not an OTP screen

<!-- ::start:architecture -->

```text
primary authenticator
        ↓
short-lived pending login
        ↓
required assurance for this action?
   ┌────┴─────────────┐
   │                  │
enough             step-up required
   │                  ↓
issue session    TOTP / passkey / security key
                      ↓
               rotate and elevate session
```

<!-- ::end:architecture -->

Record the authentication methods and time on server-side session state. A React screen may explain that step-up is needed, but the protected NestJS action must check the required assurance again.

## NestJS and React example

<!-- ::start:code-example -->

```ts title="mfa.controller.ts"
import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'

@Post('verify-totp')
async verify(@Req() req: Request, @Body() body: { code: string }) {
  const challenge = await this.mfaChallenges.consume(req, 'totp')
  const ok = await this.totp.verify(challenge.userId, body.code, { window: 1 })
  if (!ok) throw new UnauthorizedException('Verification failed')
  await this.sessions.rotateAndElevate(req, { amr: ['pwd', 'otp'] })
  return { verified: true }
}
```

```tsx title="OtpForm.tsx"
import type { ReactElement } from 'react'

export function OtpField(): ReactElement {
  return (
    <input
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      aria-label="Six-digit verification code"
    />
  )
}
```

<!-- ::end:code-example -->

### How to apply this flow

1. Verify the primary factor and store a short-lived pending-login challenge instead of a fully privileged session.
2. Render `OtpField` inside a form, post the code to the verification endpoint, and preserve the field after a generic failure.
3. On success, rotate the session and record the achieved methods; require that stronger state for sensitive routes.

#### Integration example

Make the pending challenge explicit in the API and submit the code from a controlled React form:

```ts title="mfa.controller.ts"
import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { MfaService } from './mfa.service'

@Controller('auth/mfa')
export class MfaController {
  constructor(private readonly mfa: MfaService) {}

  @Post('verify')
  verify(@Req() request: Request, @Body() body: { code: string }) {
    return this.mfa.verifyPendingLogin(request, body.code)
  }
}
```

```tsx title="mfa-page.tsx"
import { FormEvent, useState } from 'react'

export function MfaPage() {
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const code = String(new FormData(event.currentTarget).get('code'))
    const response = await fetch('/api/auth/mfa/verify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    setMessage(response.ok ? 'Verified' : 'That code was not accepted')
  }
  return (
    <form onSubmit={submit}>
      {/* code input and submit button */}
      <p aria-live="polite">{message}</p>
    </form>
  )
}
```

For magic links, store a hash of a random single-use token, expire it quickly, bind it to the intended action, and consume it atomically. Email security scanners may open links automatically; avoid completing a sensitive action on a bare GET without an intentional confirmation step.

## Implement a single-use recovery link safely

The email link should open a confirmation page. A separate `POST` performs the state change so link scanners do not recover the account merely by fetching the URL.

```ts title="recovery.service.ts"
async function beginRecovery(userId: string) {
  const token = randomBytes(32).toString('base64url')
  await recoveryTokens.insert({
    userId,
    tokenHash: await keyedHash(token),
    expiresAt: addMinutes(new Date(), 15),
    consumedAt: null,
  })
  await mail.sendRecoveryLink(userId, `/recover/confirm?token=${token}`)
}

async function completeRecovery(token: string) {
  return database.transaction(async (tx) => {
    const record = await tx.recoveryTokens.consumeOnce(await keyedHash(token))
    if (!record || record.expiresAt <= new Date()) throw new InvalidRecovery()
    await tx.sessions.revokeAllForUser(record.userId)
    return tx.sessions.issueRestrictedRecoverySession(record.userId)
  })
}
```

The restricted session may set a new authenticator, but it should not silently grant ordinary account access. Notify the user, audit the recovery, and require a fresh normal sign-in after the credential changes.

## Tradeoffs and drawbacks

- TOTP tolerates limited clock drift but codes can be relayed by phishing. Rate-limit attempts and protect enrollment.
- SMS may be an acceptable improvement over password-only for some users, but it is not phishing-resistant and may be unsuitable for high assurance.
- Push prompts need number matching or contextual confirmation to limit “approve fatigue.”
- Recovery codes must be random, one-time, hashed at rest, and regenerated after use or reset.
- Factor reset and phone/email change require recent strong reauthentication, notification, delay where appropriate, and audit trails.
- Risk-based authentication reduces friction but can be opaque, discriminatory, and vulnerable to noisy signals. Provide accessible fallback paths.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="What makes two authenticators independent factors?" -->

Independent factors come from different categories and compromise paths, such as a memorized secret plus possession of a hardware key.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is TOTP still phishable?" -->

An attacker can relay a current code from a convincing phishing page to the real service before it expires.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What risks make SMS weaker than a security key?" -->

SMS depends on the telephone network and account recovery, exposing SIM-swap, interception, and delivery risks; a security key is origin-bound.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you prevent push-fatigue attacks?" -->

Use number matching or transaction details, rate limits, anomaly detection, and a path to report unexpected prompts rather than simply offering Approve.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How should TOTP secrets and recovery codes be stored?" -->

Encrypt TOTP seeds because verification needs the original secret. Store recovery codes as slow or keyed verifiers and show each code only once.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why must factor enrollment require recent authentication?" -->

Otherwise an attacker with a stolen session can add their own factor and convert temporary access into persistent account control.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you prevent replay of an OTP or magic link?" -->

Use random single-use values, short expiry, atomic consumption, attempt limits, and binding to the user, action, and pending transaction.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What can email security scanners do to magic-link flows?" -->

They may automatically open links before the user. Do not complete sensitive login state on a bare GET; require an intentional continuation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When should an application require step-up authentication?" -->

Require it for privilege changes, payment or recovery actions, unusual risk, and access to especially sensitive resources—not arbitrary routine clicks.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you recover an account without downgrading its assurance?" -->

Offer another strong enrolled factor, protected recovery codes, or verified administrative recovery with delay and alerts at comparable assurance.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What should happen to existing sessions after a factor reset?" -->

Revoke or downgrade them according to risk, rotate identifiers, and require reauthentication for sensitive actions because the trust configuration changed.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Which events should trigger user notification and audit logs?" -->

Notify and audit factor enrollment, removal, reset, recovery-code use, contact changes, suspicious challenges, and successful recovery without logging secrets.

<!-- ::end:interview-question -->

## Primary references

- [NIST SP 800-63B Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [RFC 6238: TOTP](https://www.rfc-editor.org/rfc/rfc6238)
- [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)

<!-- ::start:quest difficulty="advanced" -->

Model enrollment, verification, replacement, loss, and recovery for every factor you offer. Try to take over the account using only the weakest path, then raise that path to the intended assurance.

<!-- ::end:quest -->
