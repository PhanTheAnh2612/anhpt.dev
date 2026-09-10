---
title: SAML enterprise SSO for React and NestJS applications
date: 2026-09-09
description: Understand SAML assertions, browser SSO, metadata, validation, provisioning, and the operational tradeoffs behind enterprise login.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-saml-enterprise-sso.webp
socialImage: /assets/journal/auth/thumbnails/auth-saml-enterprise-sso.jpg
---

# SAML enterprise SSO for React and NestJS applications

Security Assertion Markup Language (SAML) 2.0 lets an enterprise identity provider (IdP) send a signed assertion to a service provider (SP). It remains common for workforce and business-to-business single sign-on (SSO), especially where customers already manage SAML metadata, certificates, and group assignments.

![A user crosses from an enterprise identity castle to a service-provider gate while a sealed assertion returns through the browser path.](/assets/journal/auth/federation-flow.webp)

_The identity provider authenticates the person, the browser carries the signed assertion, and the service provider validates it before issuing a local session._

## The browser POST flow

In an SP-initiated flow, React navigates to a NestJS SSO start endpoint. The SP creates an authentication request and redirects the browser to the IdP. After authentication, the IdP posts a `SAMLResponse` to the SP’s Assertion Consumer Service (ACS). The SP validates the response and assertion, maps the external identity to a local account, and issues its own application session.

The React application should not parse assertions. XML signatures, canonicalization, audience restrictions, timestamps, and replay controls belong in a maintained server-side SAML library.

## NestJS and React example

<!-- ::start:code-example -->

```tsx title="EnterpriseLogin.tsx"
import type { ReactElement } from 'react'

export function EnterpriseLogin({ tenant }: { tenant: string }): ReactElement {
  return (
    <a href={`/api/sso/saml/start?tenant=${encodeURIComponent(tenant)}`}>
      Continue with company SSO
    </a>
  )
}
```

```ts title="saml.controller.ts"
import { Body, Controller, Post, Res } from '@nestjs/common'
import type { Response } from 'express'

@Post('acs')
async consume(@Body() body: SamlPost, @Res() response: Response) {
  const assertion = await this.saml.validate(body.SAMLResponse, {
    expectedAudience: this.serviceProviderEntityId,
    expectedRecipient: this.assertionConsumerUrl,
    requireSignedAssertion: true,
  })
  await this.replayCache.consumeOnce(assertion.id, assertion.expiresAt)
  const user = await this.accounts.resolve(assertion.issuer, assertion.nameId)
  return this.sessions.redirectWithNewCookie(response, user.id, '/')
}
```

<!-- ::end:code-example -->

### How to apply this flow

1. Create one trusted SAML configuration per tenant and expose start, metadata, and ACS endpoints from a NestJS SSO module.
2. Use the React link for full-page navigation; the identity provider posts the assertion directly to the ACS endpoint.
3. Validate the assertion, map `(issuer, NameID)` to a local account, and issue the same session used by other login methods.

#### Integration example

Keep the assertion consumer service (ACS) on the server and start SSO with normal browser navigation:

```ts title="saml.controller.ts"
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { SamlService } from './saml.service'

@Controller('auth/saml')
export class SamlController {
  constructor(private readonly saml: SamlService) {}

  @Get(':tenant/start')
  async start(@Param('tenant') tenant: string, @Res() response: Response) {
    response.redirect(await this.saml.createLoginUrl(tenant))
  }

  @Post(':tenant/acs')
  consume(
    @Param('tenant') tenant: string,
    @Body('SAMLResponse') assertion: string,
    @Res() response: Response,
  ) {
    return this.saml.consume({ tenant, assertion, response })
  }
}
```

```tsx title="enterprise-login.tsx"
import type { FormEvent } from 'react'

export function EnterpriseLogin() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const tenant = encodeURIComponent(
      String(new FormData(event.currentTarget).get('tenant')),
    )
    window.location.assign(`/api/auth/saml/${tenant}/start`)
  }
  return (
    <form onSubmit={submit}>{/* company identifier and submit button */}</form>
  )
}
```

Tenant selection must come from trusted configuration, not an arbitrary IdP URL supplied by the request. Validate signature trust, issuer, audience, destination/recipient, `InResponseTo` where used, conditions, and time bounds; reject unsigned or replayed assertions according to your profile.

## Tradeoffs and drawbacks

- SAML fits established enterprise procurement and identity administration, but XML tooling and per-tenant configuration are operationally heavy.
- Certificate rollover needs an overlap plan and metadata refresh; an emergency change must not cause a fleet-wide lockout.
- IdP-initiated login has weaker request correlation and should be enabled only when the product needs it and the library supports it safely.
- Assertion attributes are identity input, not automatic application permissions. Map groups to maintained local roles or policies and define deprovisioning.
- SSO does not equal lifecycle management. Use SCIM or another controlled process for provisioning and deprovisioning when required.
- Single logout is inconsistent across ecosystems; local logout and IdP logout need explicit product semantics.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="What are the IdP, SP, ACS, assertion, and metadata document?" -->

The IdP authenticates users; the SP provides the application; the ACS receives responses; assertions carry claims; metadata exchanges endpoints, identifiers, and keys.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Walk through SP-initiated browser SSO." -->

The SP creates a correlated request, redirects the browser to the IdP, receives a posted response at its ACS, validates it, then creates a local session.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Which SAML fields and signatures must the SP validate?" -->

Validate trusted signature placement, issuer, destination/recipient, audience, conditions and time bounds, subject confirmation, and request correlation where applicable.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do `InResponseTo` and a replay cache help?" -->

`InResponseTo` binds the response to an initiated request. A replay cache rejects a valid assertion identifier that has already been consumed.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is the difference between SAML binding and profile?" -->

A binding defines transport, such as HTTP POST or Redirect. A profile selects bindings and assertions to implement a concrete use case such as Web SSO.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is XML signature wrapping dangerous?" -->

An attacker can move signed XML into a different structure so naive application code reads unsigned values. Use a hardened library and verify what is consumed.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you handle IdP certificate rotation?" -->

Trust overlapping old and new metadata keys during a planned window, test both, monitor usage, then remove the retired certificate after assertions expire.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What are the risks of IdP-initiated SSO?" -->

There may be no locally initiated request to correlate, increasing login-CSRF and unsolicited-response concerns; tenant and destination selection must remain strict.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How should external groups map to application permissions?" -->

Map trusted external groups through an explicit allowlist to maintained local permissions. Unknown values should grant nothing and mappings need lifecycle ownership.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How does SCIM complement SAML?" -->

SCIM creates, updates, and deactivates accounts; SAML authenticates browser sessions. Deprovisioning must also revoke or shorten existing application sessions.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What does logout mean when several sessions exist?" -->

Destroying the local session may not end the IdP or other SP sessions. Single Logout support varies, so document which sessions each action ends.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When would you choose OIDC instead of SAML for a new integration?" -->

Prefer OIDC for modern API/mobile ecosystems, JSON tooling, and new providers. Choose SAML when enterprise customers and their IdPs require that established integration.

<!-- ::end:interview-question -->

## Primary references

- [OASIS SAML 2.0 technical overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [OASIS SAML 2.0 specifications](https://www.oasis-open.org/standard/saml/)
- [OWASP SAML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html)

<!-- ::start:quest difficulty="advanced" -->

Create a tenant onboarding checklist covering metadata exchange, signature requirements, identifiers, attribute mapping, certificate rollover, replay protection, deprovisioning, test users, and break-glass access.

<!-- ::end:quest -->
