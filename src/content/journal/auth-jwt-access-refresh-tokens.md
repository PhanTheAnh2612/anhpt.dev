---
title: JWT access tokens and safe refresh rotation
date: 2026-09-09
description: Decide when JWT access tokens fit, then validate claims, rotate refresh tokens, and handle browser storage without false security.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-jwt-access-refresh-tokens.webp
socialImage: /assets/journal/auth/thumbnails/auth-jwt-access-refresh-tokens.jpg
---

# JWT access tokens and safe refresh rotation

A JSON Web Token (JWT) is a signed claims format, not a login method and not automatically “stateless authentication.” It works well as a short-lived access token when several resource servers must validate an issuer’s result without a database lookup on every request.

![A browser receives a short-lived token from an issuer, presents it at several guarded services, rotates it, and sends spent credentials to a locked discard chest.](/assets/journal/auth/session-token-flow.webp)

_The top path represents access tokens presented to resource servers. The lower path represents lifecycle controls such as refresh rotation, reuse detection, and invalidation._

## Access and refresh have different jobs

An access token names an issuer, audience, subject, expiry, and permitted scope. A refresh token is a longer-lived credential used only with the authorization server to obtain a new access token. Rotation replaces a refresh token on every use and detects reuse of an invalidated token family.

Use JWT access tokens for distributed APIs, external clients, and federated resource servers. Prefer an opaque session for a single same-origin web application when immediate revocation and operational simplicity matter more than decentralized validation.

## NestJS and React example

<!-- ::start:code-example -->

```ts title="jwt-auth.guard.ts"
import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
    if (!token) throw new UnauthorizedException()
    request['user'] = await this.tokens.verifyAccessToken(token, {
      issuer: 'https://id.example.com',
      audience: 'notes-api',
      algorithms: ['RS256'],
    })
    return true
  }
}
```

```ts title="api-client.ts"
export async function loadProfile(accessToken: string) {
  const response = await fetch('/api/me', {
    headers: { authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 401) throw new Error('reauthenticate')
  return response.json()
}
```

<!-- ::end:code-example -->

### How to apply this flow

1. Provide the token service in `AuthModule` and register `JwtAuthGuard` globally or with `@UseGuards()` on protected controllers.
2. Keep the access token in memory in React, call the API helper from your query layer, and centralize one refresh-and-retry path.
3. Rotate refresh tokens atomically; when reuse is detected, revoke the token family and require sign-in again.

#### Integration example

Apply the guard at the NestJS boundary and keep refresh-and-retry in one React API client:

```ts title="profile.controller.ts"
import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@Req() request: Request & { user: { sub: string } }) {
    return { userId: request.user.sub }
  }
}
```

```ts title="api-client.ts"
import { getAccessToken, refreshAccessToken } from './token-store'

export async function api(path: string, init: RequestInit = {}) {
  let response = await fetch(path, {
    ...init,
    headers: { ...init.headers, authorization: `Bearer ${getAccessToken()}` },
  })
  if (response.status === 401 && (await refreshAccessToken())) {
    response = await fetch(path, {
      ...init,
      headers: { ...init.headers, authorization: `Bearer ${getAccessToken()}` },
    })
  }
  return response
}
```

Use a maintained JOSE library; the sketch shows the validation contract, not cryptographic implementation. A browser-facing Backend for Frontend (BFF) can keep refresh tokens in an `HttpOnly` cookie and access tokens out of persistent Web Storage.

## Implement refresh rotation as a state machine

The refresh path needs its own persisted lifecycle. Store only a verifier for the token, not the raw bearer value, and group replacements into a family:

```ts title="refresh-token-record.ts"
export type RefreshTokenRecord = {
  id: string
  familyId: string
  tokenHash: string
  parentId: string | null
  expiresAt: Date
  consumedAt: Date | null
  revokedAt: Date | null
}
```

<!-- ::start:architecture -->

```text
API request
  ├─ 2xx ─────────────────────────────────────> return response
  └─ 401
      ↓
shared refresh promise in the browser
      ↓
POST /auth/refresh with HttpOnly refresh cookie
  ├─ current token ─> consume atomically ─> issue child ─> retry once
  ├─ consumed token ─> reuse detected ─────> revoke family ─> sign in
  └─ expired/revoked ──────────────────────> clear session ─> sign in
```

<!-- ::end:architecture -->

The repository operation must consume the current token and insert its child in one transaction. A uniqueness constraint on the consumed transition is what makes two simultaneous refresh requests resolve as one winner rather than two valid branches.

On the client, share one in-flight refresh promise so a screen that produces several `401` responses does not rotate the same credential several times:

```ts title="refresh-coordinator.ts"
let refreshInFlight: Promise<boolean> | undefined

export function refreshOnce() {
  refreshInFlight ??= fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) return false
      setAccessToken((await response.json()).accessToken)
      return true
    })
    .finally(() => {
      refreshInFlight = undefined
    })

  return refreshInFlight
}
```

Retry the original API request at most once. A second `401`, a rejected refresh, or reuse detection is a terminal authentication result, not a reason to loop.

## Tradeoffs and drawbacks

- Local signature validation reduces central reads, but permission changes remain stale until expiry unless you add introspection or revocation state.
- JWT payloads are encoded, not encrypted. Never put secrets or unnecessary personal data in them.
- Pin allowed algorithms; validate signature, `iss`, `aud`, time claims, and token purpose. A valid token for another API is not valid for yours.
- Short expiry limits replay but creates refresh traffic. Rotation improves detection but requires atomic server-side state.
- Storing bearer credentials in `localStorage` exposes them to any script that executes in the origin. Cookies change the main risk toward CSRF; neither choice removes XSS risk.
- A large token increases every request and can exceed header limits.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="What are JWS, JWE, and JWT, and which one provides confidentiality?" -->

JWS signs content, JWE encrypts content, and JWT defines a claims format that may use either. JWE supplies confidentiality; an ordinary signed JWT does not.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why must a resource server validate issuer and audience?" -->

`iss` selects the trusted authority and `aud` binds the token to this API. A valid signature without both checks can accept a token meant elsewhere.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is an algorithm-confusion attack?" -->

It tricks a verifier into using an attacker-chosen algorithm or key interpretation. Pin acceptable algorithms and use keys according to an explicit configuration.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why does JWT validation not guarantee immediate revocation?" -->

Local verification checks cryptographic validity and claims, not current server state. A valid token remains usable until expiry unless introspection or denylisting is added.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How does refresh-token rotation detect replay?" -->

Each refresh use invalidates the old token and creates a new one. Seeing an invalidated token again signals that one copy was stolen.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Where should a browser keep access and refresh credentials?" -->

For a BFF, keep refresh credentials in a hardened HttpOnly cookie and access tokens server-side. If a SPA handles access tokens, prefer memory over persistent Web Storage.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When should you use opaque reference tokens instead?" -->

Use opaque tokens when immediate revocation, minimal disclosure, and central policy freshness justify an introspection lookup and its availability cost.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do key IDs and a JSON Web Key Set support rotation?" -->

`kid` selects a published verification key. Publish overlapping old and new keys until tokens signed by the old key can no longer be valid.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What clock-skew allowance is reasonable for `exp` and `nbf`?" -->

Allow only the smallest skew justified by measured clock synchronization, commonly tens of seconds rather than minutes, and monitor clock health.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why are roles embedded in a long-lived token risky?" -->

They become stale authorization snapshots and may expose internal structure. Prefer short-lived, narrow permissions or current policy lookup for sensitive decisions.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is the difference between token expiry and session expiry?" -->

Token expiry ends one credential's validity. Session expiry ends the broader login relationship and may govern refresh issuance, inactivity, or absolute lifetime.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do sender-constrained tokens reduce bearer-token replay?" -->

DPoP or certificate binding requires proof of a private key when presenting the token, so stealing the bearer value alone is insufficient.

<!-- ::end:interview-question -->

## Primary references

- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725)
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700)
- [NestJS authentication](https://docs.nestjs.com/security/authentication)

<!-- ::start:quest difficulty="advanced" -->

Write tests that reject an expired token, the wrong issuer, the wrong audience, an unapproved algorithm, and reuse of a rotated refresh token. Confirm that logs never contain full credentials.

<!-- ::end:quest -->
