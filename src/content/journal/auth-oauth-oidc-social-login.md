---
title: OAuth, OpenID Connect, and social login without confusion
date: 2026-09-09
description: Separate delegated API access from login, implement Authorization Code with PKCE, and validate OIDC identity in NestJS and React.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-oauth-oidc-social-login.webp
socialImage: /assets/journal/auth/thumbnails/auth-oauth-oidc-social-login.jpg
---

# OAuth, OpenID Connect, and social login without confusion

OAuth 2.0 delegates access to an API. OpenID Connect (OIDC) adds an identity layer and ID Token for login. A “Sign in with …” button should use OIDC; receiving an OAuth access token alone does not prove an interoperable login identity.

![A browser travels to an identity provider, grants delegated trust, and returns with sealed credentials that can open a protected API gate.](/assets/journal/auth/federation-flow.webp)

_The browser redirect and callback form one loop; the server-to-server code exchange and protected API call form separate trusted paths._

## Use Authorization Code with PKCE

The React application generates a random `code_verifier`, derives a `code_challenge`, and starts authorization with `state`, `nonce`, an exact redirect URI, and requested scopes. After the callback, a trusted server exchanges the one-time code and verifier. It validates the ID Token signature through the issuer’s keys plus `iss`, `aud`, `exp`, and `nonce`, then establishes the application’s own session.

Use this for consumer social login, workforce identity, and delegated access to third-party APIs. Use client credentials—not a user flow—for a service acting only as itself. Avoid the implicit grant and Resource Owner Password Credentials grant.

## NestJS and React example

<!-- ::start:code-example -->

```tsx title="LoginButton.tsx"
import type { ReactElement } from 'react'

export function LoginButton(): ReactElement {
  return <a href="/api/auth/oidc/start">Continue with identity provider</a>
}
```

```ts title="oidc.controller.ts"
import { Controller, Get, Query, Res } from '@nestjs/common'
import type { Response } from 'express'

@Get('callback')
async callback(@Query() query: CallbackDto, @Res() response: Response) {
  const transaction = await this.flows.consume(query.state)
  const result = await this.oidc.exchangeAndValidate({
    code: query.code,
    verifier: transaction.verifier,
    nonce: transaction.nonce,
  })
  const user = await this.accounts.linkByIssuerSubject(result.iss, result.sub)
  return this.sessions.redirectWithNewCookie(response, user.id, '/')
}
```

<!-- ::end:code-example -->

### How to apply this flow

1. Register exact start and callback URLs with the provider, then keep issuer, client configuration, and key discovery in a NestJS OIDC adapter.
2. Render the React link as normal navigation so the browser—not `fetch`—follows the authorization redirects.
3. Store `state`, PKCE verifier, and nonce in a short-lived server transaction, consume it once, and issue the application's session cookie.

#### Integration example

Expose start and callback routes from NestJS. React only initiates full-page navigation:

```ts title="oidc.controller.ts"
import { Controller, Get, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { OidcService } from './oidc.service'

@Controller('auth/oidc')
export class OidcController {
  constructor(private readonly oidc: OidcService) {}

  @Get('start')
  async start(@Res() response: Response) {
    response.redirect(await this.oidc.createAuthorizationUrl())
  }

  @Get('callback')
  callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() response: Response,
  ) {
    return this.oidc.complete({ code, state, response })
  }
}
```

```tsx title="social-login-button.tsx"
import type { MouseEventHandler } from 'react'

export function SocialLoginButton() {
  const startLogin: MouseEventHandler<HTMLAnchorElement> = () => undefined
  return (
    <a href="/api/auth/oidc/start" onClick={startLogin}>
      Continue with your identity provider
    </a>
  )
}
```

The unique account key is normally `(issuer, subject)`, not email. Email can change, be recycled, or be absent. Account linking needs an authenticated, explicit flow to prevent takeover.

## Tradeoffs and drawbacks

- Federation removes password handling but adds provider availability, configuration, privacy, and account-recovery dependencies.
- PKCE binds the authorization code to the initiating client; `state` binds the response to the browser transaction; OIDC `nonce` binds the ID Token to that request.
- Access tokens go to resource servers. ID Tokens are assertions for the client and should not be sent as general API credentials.
- Keep client secrets out of React bundles. A public browser client cannot protect a static secret.
- Request the smallest scopes and treat consent denial as a normal outcome.
- Provider logout is not automatically application logout, and application logout may not end the provider session.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="What problem does OAuth solve, and what does OIDC add?" -->

OAuth lets a client obtain limited API access on a resource owner's behalf. OIDC adds a standardized authenticated identity for the client.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Explain the authorization code flow and every participant." -->

The browser visits the authorization server, the user authenticates and consents, the client receives a one-time code, and a trusted component exchanges it for tokens.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What attacks do `state`, PKCE, and `nonce` mitigate?" -->

`state` correlates the browser transaction, PKCE binds the code to its initiator, and `nonce` binds the returned ID Token to the OIDC request.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is the implicit grant no longer recommended?" -->

It exposes tokens through the browser redirect and offers weaker replay controls. Authorization Code with PKCE returns a short-lived code instead.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why can a React SPA not keep a client secret?" -->

Anything shipped to a browser can be inspected and copied. A SPA is a public client and must not rely on a static secret for identity.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What must be validated in an ID Token?" -->

Verify signature, issuer, audience, expiry, nonce, and any flow-specific claims using the issuer's discovered configuration and trusted keys.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is the difference between access, ID, and refresh tokens?" -->

An access token authorizes an API call, an ID Token tells the client about authentication, and a refresh token requests replacement access tokens.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why should accounts be keyed by issuer and subject rather than email?" -->

OIDC guarantees the subject only within an issuer. Email can change, be recycled, or be unverified, so it is not a stable federated key.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do redirect-URI validation and open redirects affect the flow?" -->

Exact registered redirect matching prevents code theft. An open redirect can turn a trusted callback path into a route that forwards secrets to an attacker.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When is a BFF preferable to tokens handled by the SPA?" -->

A BFF is preferable when the browser should not hold OAuth credentials, refresh rotation is complex, or same-site session controls simplify the threat model.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you link two identity providers safely?" -->

Require an already authenticated session, reauthenticate both sides when appropriate, verify ownership, and make the linking operation explicit and auditable.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What does logout mean across the relying party and provider?" -->

Local logout destroys the application session; provider logout may end a wider SSO session. Define both separately and do not promise one implies the other.

<!-- ::end:interview-question -->

## Primary references

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [RFC 7636: Proof Key for Code Exchange](https://www.rfc-editor.org/rfc/rfc7636)
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700)
- [OAuth 2.0 for Browser-Based Applications draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)

<!-- ::start:quest difficulty="advanced" -->

Trace a login from browser redirect to local session. For each value—code, state, verifier, nonce, ID Token, access token—record who creates it, who receives it, its lifetime, and the exact validation performed.

<!-- ::end:quest -->
