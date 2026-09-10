---
title: Passkeys and WebAuthn for phishing-resistant login
date: 2026-09-09
description: Understand passkey registration and authentication ceremonies, server verification, recovery, and progressive React adoption.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-passkeys-webauthn.webp
socialImage: /assets/journal/auth/thumbnails/auth-passkeys-webauthn.jpg
---

# Passkeys and WebAuthn for phishing-resistant login

A passkey is a Web Authentication (WebAuthn) credential backed by an asymmetric key pair. The server stores a public key; the authenticator protects the private key and signs a fresh server challenge for the correct relying-party origin. Biometrics or a device PIN usually unlock the authenticator locally—they are not sent to your NestJS server.

![A person unlocks a device-held passkey while hardware, time-based, phone, and email factors converge on a guarded application.](/assets/journal/auth/passkey-mfa-flow.webp)

_The private key remains with the authenticator. The application verifies a signature over a fresh challenge rather than receiving a reusable biometric or passkey secret._

## Registration and authentication

Registration starts with server-generated options containing a random challenge, relying-party identity, user handle, and acceptable algorithms. React passes them to `navigator.credentials.create()`. NestJS verifies the returned origin, relying-party binding, challenge, and attestation/authenticator data before storing the credential public key and identifier.

Authentication repeats the pattern with `navigator.credentials.get()`. The server verifies the challenge and signature and evaluates the signature counter as one risk signal. Use a maintained WebAuthn server library rather than implementing binary parsing or cryptography yourself.

## NestJS and React example

<!-- ::start:code-example -->

```tsx title="PasskeyButton.tsx"
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types'

async function signInWithPasskey() {
  const options: PublicKeyCredentialRequestOptionsJSON = await fetch(
    '/api/passkeys/options',
    {
      method: 'POST',
      credentials: 'include',
    },
  ).then((response) => response.json())
  const credential = await navigator.credentials.get({ publicKey: options })
  return fetch('/api/passkeys/verify', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(serializeCredential(credential)),
  })
}
```

```ts title="passkeys.controller.ts"
import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common'
import type { AuthenticationResponseJSON } from '@simplewebauthn/types'
import type { Request } from 'express'

@Post('verify')
async verify(@Req() req: Request, @Body() response: AuthenticationResponseJSON) {
  const pending = await this.challenges.consume(req, response.id)
  const result = await this.webAuthn.verifyAuthentication(response, pending)
  if (!result.verified) throw new UnauthorizedException()
  return this.sessions.issueForResponse(result.userId)
}
```

<!-- ::end:code-example -->

### How to apply this flow

1. Add NestJS endpoints for registration options/verification and authentication options/verification.
2. Convert base64url fields with a maintained WebAuthn library before calling the browser Credentials API.
3. Store each challenge with its user context, expiry, and intended ceremony; consume it once before issuing a session.

#### Integration example

Wire the verification service into a NestJS controller and call the browser ceremony from React:

```ts title="passkeys.controller.ts"
import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { PasskeysService } from './passkeys.service'

@Controller('auth/passkeys')
export class PasskeysController {
  constructor(private readonly passkeys: PasskeysService) {}

  @Post('authentication/options')
  options() {
    return this.passkeys.createAuthenticationOptions()
  }

  @Post('authentication/verify')
  verify(@Body() credential: unknown, @Req() request: Request) {
    return this.passkeys.verifyAuthentication(credential, request)
  }
}
```

```tsx title="passkey-button.tsx"
import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'

export function PasskeyButton() {
  const [busy, setBusy] = useState(false)
  async function signIn() {
    setBusy(true)
    const options = await fetch('/api/auth/passkeys/authentication/options', {
      method: 'POST',
    }).then((r) => r.json())
    const credential = await startAuthentication({ optionsJSON: options })
    await fetch('/api/auth/passkeys/authentication/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(credential),
    })
    setBusy(false)
  }
  return (
    <button disabled={busy} onClick={signIn}>
      Sign in with a passkey
    </button>
  )
}
```

Serialization converts WebAuthn byte arrays safely; challenge consumption must be one-time and expiring.

## Use cases, tradeoffs, and recovery

- Passkeys are strong for consumer and workforce login because origin binding resists credential phishing and there is no reusable server-side secret.
- Synced passkeys improve multi-device usability but inherit the platform account’s recovery model. Device-bound credentials can offer tighter control with more provisioning work.
- Support browsers, cross-device QR flows, multiple credentials per account, credential naming, deletion, and lost-device recovery.
- Resident/discoverable credentials enable usernameless flows; non-discoverable credentials require the server to provide allowed credential IDs.
- Attestation can identify authenticator characteristics, but collecting it may add privacy, policy, and interoperability costs. Do not require it without a concrete need.
- Recovery can become the weakest path. Prefer another passkey, verified enterprise recovery, or carefully protected recovery codes over silent email-only downgrade for high-risk accounts.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="Why are passkeys resistant to phishing?" -->

The credential is scoped to the relying-party domain and signs that origin's fresh challenge, so a lookalike site cannot obtain a usable assertion.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What remains on the server and what remains on the authenticator?" -->

The server stores credential ID, public key, and metadata. The authenticator keeps the private key and releases only signed assertions after user interaction.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What do the challenge, origin, and relying-party ID prevent?" -->

The challenge prevents replay, origin binds the browser context, and relying-party ID scopes where the credential can be used.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is user verification versus user presence?" -->

User presence proves an interaction such as a touch. User verification proves the authenticator verified the local user with a PIN or biometric.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is a discoverable credential?" -->

It stores enough information on the authenticator to find the account without a server-provided credential list, enabling usernameless sign-in.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is attestation, and when would you avoid collecting it?" -->

Attestation describes authenticator provenance. Avoid requiring it when device policy does not need it because it reduces compatibility and can increase privacy concerns.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How should signature counters be interpreted?" -->

Treat counters as a risk signal rather than universal clone proof: some authenticators do not maintain meaningful counters and synced credentials complicate interpretation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do synced and device-bound passkeys differ operationally?" -->

Synced passkeys improve recovery and cross-device use through an ecosystem account. Device-bound credentials offer tighter locality with more enrollment and recovery work.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you support multiple passkeys and credential deletion?" -->

Store several credential records per user with names and last-used data. Require strong reauthentication before deletion and prevent removal of the final recovery path.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What recovery method preserves the intended assurance?" -->

Use another enrolled passkey, protected recovery codes, or verified administrative recovery at comparable assurance; avoid silently falling back to weak email.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Can XSS initiate a WebAuthn ceremony, and what can it not export?" -->

XSS may trigger ceremonies or misuse the current page, but it cannot export a non-exportable private key. It can still abuse a successfully authenticated session.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you roll out passkeys alongside passwords?" -->

Offer passkeys as an additional sign-in method, encourage enrollment after login, preserve a deliberate fallback, and measure recovery/support outcomes before requiring them.

<!-- ::end:interview-question -->

## Primary references

- [W3C Web Authentication Level 3](https://www.w3.org/TR/webauthn-3/)
- [MDN Passkeys](https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/Passkeys)
- [FIDO Alliance passkey resources](https://fidoalliance.org/passkeys/)

<!-- ::start:quest difficulty="advanced" -->

Implement challenge issuance and one-time consumption before the UI. Then test a wrong origin, replayed challenge, unknown credential, failed user verification, cancellation, and account recovery.

<!-- ::end:quest -->
