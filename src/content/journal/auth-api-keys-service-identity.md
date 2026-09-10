---
title: API keys, Basic auth, mTLS, and service identity
date: 2026-09-09
description: Compare machine authentication choices and implement attributable, rotatable service credentials without leaking secrets to React.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-api-keys-service-identity.webp
socialImage: /assets/journal/auth/thumbnails/auth-api-keys-service-identity.jpg
---

# API keys, Basic auth, mTLS, and service identity

Machine authentication should identify a workload, integration, device, or installation—not reuse a human password. The practical choices range from static bearer credentials to short-lived, cryptographically bound identities.

![Human, service, and workload callers follow distinct credential paths through guarded gateways to protected systems.](/assets/journal/auth/machine-identity-flow.webp)

_Static keys, signed certificates, and short-lived workload credentials have different issuance and rotation paths even when they ultimately reach the same protected API._

## Pick the smallest sufficient mechanism

- **API key:** simple identification and metering for integrations. Treat it as a bearer secret; add scopes, owner, expiry, last-used data, and rotation.
- **HTTP Basic:** a standard way to carry a username and password on every request. Use only over Transport Layer Security (TLS), usually for narrow legacy or internal integrations. It offers no logout or replay resistance by itself.
- **HTTP Digest:** challenge-response that avoids sending the password directly, but has limited modern ecosystem value and does not replace TLS. Prefer stronger, maintained protocols for new systems.
- **OAuth client credentials:** a confidential client obtains scoped, short-lived access tokens. Good when an authorization server already manages service clients.
- **Mutual TLS (mTLS):** both peers authenticate certificates during TLS. Strong binding, with certificate issuance, rotation, proxy, and debugging complexity.
- **Workload identity:** the runtime exchanges platform-attested identity for short-lived credentials. Prefer this in a supported cloud or cluster instead of distributing static secrets.

Never ship a private API key in a React bundle. Browser code and network requests are inspectable. Route calls through NestJS or use a provider’s deliberately public, origin-restricted credential model.

## NestJS and React example

<!-- ::start:code-example -->

```ts title="api-key.guard.ts"
import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const presented = request.header('x-api-key')
    if (!presented) throw new UnauthorizedException()
    const principal = await this.keys.verifyAndTouch(presented) // hash lookup
    if (!principal) throw new UnauthorizedException()
    request['user'] = { subject: principal.clientId, scopes: principal.scopes }
    return true
  }
}
```

```ts title="integration-client.ts"
// React calls our BFF. The third-party credential stays on the server.
const response = await fetch('/api/integrations/status', {
  credentials: 'include',
})
```

<!-- ::end:code-example -->

### How to apply this flow

1. Register `ApiKeyGuard` on integration routes, inject the key repository, and attach a narrow machine principal.
2. Give each integration its own scoped key, show it once, and store a lookup prefix plus protected verifier.
3. Let React call your authenticated NestJS BFF; the BFF adds third-party credentials from server-side secret storage.

#### Integration example

Protect machine endpoints with the guard, while the browser calls a separate session-authenticated Backend for Frontend (BFF):

```ts title="integrations.controller.ts"
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiKeyGuard } from './api-key.guard'
import { IntegrationsService } from './integrations.service'

@Controller('integrations')
@UseGuards(ApiKeyGuard)
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get('jobs')
  listJobs() {
    return this.integrations.listJobs()
  }
}
```

```tsx title="jobs-page.tsx"
import { useEffect, useState } from 'react'

export function JobsPage() {
  const [jobs, setJobs] = useState<string[]>([])
  useEffect(() => {
    void fetch('/api/bff/jobs', { credentials: 'include' })
      .then((response) => response.json())
      .then(setJobs)
  }, [])
  return (
    <ul>
      {jobs.map((job) => (
        <li key={job}>{job}</li>
      ))}
    </ul>
  )
}
```

The React bundle never receives the API key. `/api/bff/jobs` reads it from server-side secret storage before contacting the integration API.

Display a newly issued API key once, store only a verifier or keyed hash where the protocol permits, and use a public prefix for efficient lookup. Support overlapping keys so clients can rotate without downtime.

## Tradeoffs and drawbacks

- Static bearer keys are easy to operate and easy to leak. Scope them, expire them, scan repositories/logs, and revoke quickly.
- IP allowlists are defense in depth, not identity; networks change and source addresses can be shared.
- Client credentials centralize issuance but add an authorization-server dependency.
- mTLS resists bearer replay, but certificate lifecycle and termination boundaries must be designed explicitly.
- Workload identity removes stored secrets but couples deployment to a trust platform.
- Rate limits control abuse and cost; they do not replace authorization.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="Why must a React bundle never contain a private API key?" -->

A shipped bundle is public: users and automated tools can inspect it. Any embedded private key becomes a shared, unrevocable bearer credential.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you store, identify, and verify API keys?" -->

Generate high-entropy keys, show them once, store a public lookup prefix plus protected verifier, compare safely, and retain owner/scope/lifecycle metadata.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How can customers rotate keys without downtime?" -->

Allow old and new keys to overlap briefly, expose last-used data, switch the client, verify use of the new key, then revoke the old one.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What do scopes add to an API key?" -->

Scopes restrict which operations a stolen or misused key can perform, reducing blast radius; resource-level authorization may still be required.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why does Basic authentication require TLS?" -->

Basic repeatedly sends reusable credentials encoded rather than encrypted. TLS protects them from network observers and server impersonation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is Digest rarely chosen for a new JSON API?" -->

Digest has awkward algorithm, nonce, proxy, and library interoperability and still needs TLS. Modern token or signed-request systems provide better lifecycle controls.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How does OAuth client credentials differ from a user grant?" -->

Client credentials represents a confidential application acting as itself. User grants include a resource owner and delegated user context.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What security property does mTLS add beyond TLS server authentication?" -->

Normal TLS authenticates only the server. mTLS also proves the client possesses the private key corresponding to an accepted certificate.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Where can mTLS identity be lost behind a proxy?" -->

If TLS terminates at an ingress, downstream code sees only the proxy. Identity must be securely propagated over a trusted, authenticated hop.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is workload identity and why are short-lived credentials valuable?" -->

Infrastructure attests the running software and issues expiring identity material. Short lifetimes reduce secret distribution and narrow compromise windows.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you attribute and audit calls from a shared service?" -->

Give each deployed client its own principal and correlation ID; log principal, action, resource, result, key version, and time without recording the credential.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is the incident response for a leaked machine credential?" -->

Revoke it, identify affected scope and logs, rotate dependent credentials, investigate exposure, notify owners, and improve detection and issuance controls.

<!-- ::end:interview-question -->

## Primary references

- [RFC 7617: HTTP Basic Authentication](https://www.rfc-editor.org/rfc/rfc7617)
- [RFC 7616: HTTP Digest Access Authentication](https://www.rfc-editor.org/rfc/rfc7616)
- [RFC 6749 client credentials grant](https://www.rfc-editor.org/rfc/rfc6749#section-4.4)
- [RFC 8705: OAuth mutual TLS](https://www.rfc-editor.org/rfc/rfc8705)

<!-- ::start:quest difficulty="advanced" -->

Inventory every non-human credential, then record owner, scope, storage, issue time, expiry, rotation method, last use, and revocation path. Replace one unowned static secret with an attributable credential.

<!-- ::end:quest -->
