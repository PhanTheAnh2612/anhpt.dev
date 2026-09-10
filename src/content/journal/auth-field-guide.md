---
title: Authentication and authorization: the complete field guide
date: 2026-09-09
description: Map credentials, sessions, federation, machine identity, and access-control models before choosing an auth architecture.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-field-guide.webp
socialImage: /assets/journal/auth/thumbnails/auth-field-guide.jpg
---

# Authentication and authorization: the complete field guide

Authentication answers **who or what is making this request?** Authorization answers **may that principal perform this action on this resource in this context?** A session or token carries an authentication result; it is not another identity check. Keeping those boundaries explicit prevents most muddled auth designs.

This series is a practical map of the major methods a web engineer is likely to design, integrate, or discuss in an interview. It is broad, not literally exhaustive: proprietary challenge protocols, national identity systems, and highly regulated identity-proofing flows need their own threat models and standards.

![A person moves through a server guard, identity vault, authorization checkpoint, and finally reaches a protected document.](/assets/journal/auth/system-map.webp)

_Read the visual from left to right: the browser presents a request, authentication establishes a principal, authorization evaluates the action, and only an allowed request reaches the resource._

## Choose from the right layer

| Layer                 | Main choices                                                                                   | Choose by                                      |
| --------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Primary authenticator | password, passkey, federated identity, client certificate                                      | phishing resistance, recovery, device support  |
| Additional factor     | TOTP, push, security key, recovery code                                                        | risk, accessibility, support cost              |
| Browser continuity    | opaque server session, short-lived access token plus rotation                                  | topology, revocation, CSRF/XSS exposure        |
| Delegation/federation | OAuth 2.0, OpenID Connect (OIDC), SAML                                                         | API delegation versus login, partner ecosystem |
| Machine identity      | API key, OAuth client credentials, mutual TLS, workload identity                               | rotation, attribution, platform support        |
| Authorization         | ownership, role-based (RBAC), attribute-based (ABAC), relationship-based (ReBAC), policy-based | domain shape, auditability, policy scale       |

HTTP Basic and Digest are transport schemes rather than modern end-user identity systems. Biometrics usually unlock a device-held private key; a server should not receive a fingerprint template. “Social login” is normally OIDC over OAuth, not a separate protocol.

## A reference request path

<!-- ::start:architecture -->

```text
React UI -> NestJS authentication endpoint -> identity/session service
React UI <- HttpOnly session cookie or short-lived access result

React request -> authentication guard -> principal
              -> authorization policy -> allow or deny
              -> domain service -> resource
```

<!-- ::end:architecture -->

React may hide unavailable actions for clarity, but NestJS must enforce every permission. A client-side route guard is navigation behavior, not a security boundary.

## A small NestJS and React boundary

<!-- ::start:code-example -->

```ts title="current-user.ts"
// NestJS: authentication creates a principal; policy code consumes it.
export type Principal = { subject: string; roles: string[] }

export function canEditPost(user: Principal, post: { authorId: string }) {
  return user.roles.includes('admin') || post.authorId === user.subject
}
```

```tsx title="EditPostButton.tsx"
import type { ReactElement } from 'react'

export function EditPostButton({
  allowed,
}: {
  allowed: boolean
}): ReactElement {
  return allowed ? <button>Edit post</button> : null
}
```

<!-- ::end:code-example -->

### How to apply this boundary

1. Create the principal in a NestJS authentication guard after validating the session or token.
2. Call the policy from the controller or domain service with the loaded resource—not only its URL identifier.
3. Return server-derived capabilities to React for presentation, then repeat the policy check on every mutation.

#### Integration example

Expose identity and capabilities from NestJS, then use them to render—but never enforce—the React interface:

```ts title="me.controller.ts"
import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { SessionGuard } from './session.guard'
import { PolicyService } from './policy.service'

@Controller('me')
@UseGuards(SessionGuard)
export class MeController {
  constructor(private readonly policy: PolicyService) {}

  @Get()
  getMe(@Req() request: Request & { user: { id: string } }) {
    return {
      user: request.user,
      capabilities: this.policy.forUser(request.user),
    }
  }
}
```

```tsx title="account-page.tsx"
import { useEffect, useState } from 'react'

type Me = { user: { id: string }; capabilities: { canEditProfile: boolean } }

export function AccountPage() {
  const [me, setMe] = useState<Me | null>(null)
  useEffect(() => {
    void fetch('/api/me', { credentials: 'include' })
      .then((r) => r.json())
      .then(setMe)
  }, [])
  return me?.capabilities.canEditProfile ? (
    <a href="/profile/edit">Edit profile</a>
  ) : null
}
```

The UI consumes an authorization result for presentation. It does not recalculate the authoritative policy from editable browser state.

## System-wide tradeoffs

- Building credentials yourself increases breach, recovery, and support responsibility. A maintained identity provider can reduce that surface, but adds cost, dependency, and migration work.
- Stateless validation improves availability but makes immediate revocation and policy freshness harder. Stateful sessions simplify central invalidation but require a shared, protected store at scale.
- Stronger authentication cannot repair broken object-level authorization. Check the requested resource, action, tenant, and principal together.
- Recovery is part of authentication. A passkey system with an email-only recovery path is effectively only as strong as that mailbox.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="What is the difference between identification, authentication, authorization, and accounting?" -->

Identification supplies a claimed identifier. Authentication verifies it, authorization decides permitted actions, and accounting records security-relevant activity.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is a JWT not an authentication method by itself?" -->

A JWT is only a claims container. Authentication occurs when an issuer verifies a credential; the token carries that result to another component.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Where must authorization be enforced in a React and NestJS application?" -->

NestJS or the authoritative backend must enforce it at every entry point. React checks are only presentation and navigation conveniences.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When would you choose an opaque session over a self-contained access token?" -->

Choose an opaque session when central revocation and one web backend dominate. Choose a self-contained token when independent resource servers need local validation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is OAuth not a login protocol, and what does OIDC add?" -->

OAuth delegates API access; it does not standardize user login. OIDC adds identity assertions, discovery, UserInfo, and ID Token validation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What changes when the principal is a workload rather than a person?" -->

A workload needs non-human lifecycle, attestation, automated rotation, and service-level attribution. It still needs authorization after authentication.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do CSRF and XSS risks change with cookie and JavaScript-readable token storage?" -->

Cookies are automatically attached, so CSRF needs attention; JavaScript-readable tokens are easier to steal through XSS. XSS remains dangerous in both models.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why should deny be the default when policy data is unavailable?" -->

Missing or failed policy data cannot prove permission. Failing closed preserves least privilege and prevents an outage from becoming an authorization bypass.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you revoke access after a role or employment change?" -->

Disable the identity or assignments, revoke central sessions and refresh tokens, and keep access-token lifetimes short enough to bound stale permissions.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Which logs prove who accessed which resource without leaking credentials?" -->

Record principal, action, resource, tenant, decision, policy version, time, and correlation ID. Exclude passwords, full tokens, and unnecessary personal data.

<!-- ::end:interview-question -->

## Primary references

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [NestJS authentication](https://docs.nestjs.com/security/authentication)
- [NestJS authorization](https://docs.nestjs.com/security/authorization)

<!-- ::start:quest difficulty="advanced" -->

Draw your current request path and label the authenticator, session carrier, authentication enforcement point, authorization policy, and revocation path. Any unlabeled boundary becomes the next design question.

<!-- ::end:quest -->
