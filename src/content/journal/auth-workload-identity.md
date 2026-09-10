---
title: Workload identity with short-lived credentials and SPIFFE
date: 2026-09-09
description: Replace distributed service secrets with attested workload identities, automated rotation, mTLS, and explicit authorization.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-workload-identity.webp
socialImage: /assets/journal/auth/thumbnails/auth-workload-identity.jpg
---

# Workload identity with short-lived credentials and SPIFFE

An API key identifies whoever presents a copied string. Workload identity instead lets infrastructure attest which deployed workload is asking, then issue a short-lived cryptographic identity. This matters when a microservice fleet has outgrown manually distributed secrets.

SPIFFE defines a URI-like workload identifier and verifiable identity documents (SVIDs). SPIRE is one implementation that attests nodes and workloads and exposes automatically rotated X.509 or JWT SVIDs through the Workload API.

![A workload receives an automatically rotated crystal-like credential and presents it through service gates to protected internal systems.](/assets/journal/auth/machine-identity-flow.webp)

_The lower path represents attestation and automatic short-lived issuance; the credential is presented only by the workload and rotates without being copied into a React client._

## Where it fits

Use workload identity for Kubernetes or multi-cluster services, service meshes, cross-cloud workloads, and systems where secret rotation or attribution has become unreliable. It is usually unnecessary for a small monolith with one trusted runtime.

React is not a workload-identity client. A person authenticates to the React-facing application through a human flow; the NestJS gateway then uses its own workload identity when calling internal services. Never forward an internal service credential to the browser.

## NestJS boundary example

<!-- ::start:architecture -->

```text
person -> React -> NestJS gateway (human session)
                         |
                         | mTLS using short-lived X.509 SVID
                         v
                  orders service
                         |
                         v
                  payments service
```

<!-- ::end:architecture -->

<!-- ::start:code-example -->

```ts title="orders-client.ts"
import { Injectable } from '@nestjs/common'

@Injectable()
export class OrdersClient {
  constructor(private readonly identities: WorkloadIdentitySource) {}

  async getOrder(id: string, actor: { subject: string; tenantId: string }) {
    const tls = await this.identities.currentTlsMaterial()
    return this.http.get(`/orders/${encodeURIComponent(id)}`, {
      tls,
      headers: {
        // User context is separately integrity-protected and narrowly scoped.
        'x-actor-context': await this.identities.signActorContext(actor),
      },
    })
  }
}
```

<!-- ::end:code-example -->

### How to apply this boundary

1. Install the workload-identity agent beside NestJS and read credentials through its Workload API, not configuration files.
2. Refresh TLS material automatically and verify the destination service identity on every connection.
3. Forward user context only in a separate audience-bound token; the receiver authorizes both identities.

#### Integration example

Inject a workload-aware client into the NestJS service; React continues to call only your browser-facing API:

```ts title="orders.module.ts"
import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { WorkloadHttpClient } from './workload-http-client'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, WorkloadHttpClient],
})
export class OrdersModule {}
```

```ts title="orders.service.ts"
import { Injectable } from '@nestjs/common'
import { WorkloadHttpClient } from './workload-http-client'

@Injectable()
export class OrdersService {
  constructor(private readonly client: WorkloadHttpClient) {}

  listForUser(delegationToken: string) {
    return this.client.get('/orders', {
      audience: 'orders-service',
      headers: { authorization: `Bearer ${delegationToken}` },
    })
  }
}
```

`WorkloadHttpClient` obtains rotating mTLS material from the local identity agent and verifies the orders-service identity. Do not implement it as a wrapper around a static certificate path.

The transport authenticates the gateway workload, not the original person. User delegation needs a separate, protected representation with an audience, expiry, and minimal claims. The orders service authorizes both the calling workload and the delegated user action.

## Tradeoffs and drawbacks

- Automated short lifetimes shrink the value of stolen credentials and remove manual rotation windows.
- Attestation, trust domains, federation, certificate authorities, and agent availability become security-critical infrastructure.
- mTLS authenticates peers; it does not decide whether a valid caller may perform a specific operation.
- A compromised authorized workload can still abuse its current identity. Apply least privilege, egress control, telemetry, and rapid revocation.
- JWT SVIDs cross boundaries more easily; X.509 SVIDs naturally support mTLS. Each has different replay and validation behavior.
- Proxies and meshes must preserve the authenticated identity across termination points without trusting spoofable headers.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="What is the difference between a service account label and cryptographic workload identity?" -->

A label is configuration that can be spoofed. Cryptographic identity proves possession of short-lived key material issued after workload attestation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What are a SPIFFE ID, trust domain, and SVID?" -->

A SPIFFE ID names a workload, the trust domain is its authority boundary, and an SVID is the signed document that proves the identifier.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do X.509 and JWT SVIDs differ?" -->

X.509 SVIDs naturally authenticate TLS connections; JWT SVIDs are bearer-style signed assertions for protocols where certificate-based transport does not fit.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is workload attestation?" -->

It verifies runtime evidence—node, orchestrator, process, namespace, or selectors—before issuing identity rather than trusting a self-declared service name.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why are short-lived, automatically rotated credentials valuable?" -->

They limit stolen-credential lifetime, remove manual distribution, and allow frequent rotation without coordinating static-secret updates across every service.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How does workload identity relate to mTLS?" -->

The workload uses an X.509 SVID as its client certificate, and the peer validates the chain plus expected SPIFFE identity during mutual TLS.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why does authenticated service A still need authorization to call service B?" -->

Authentication proves which service is calling. Authorization still decides whether that service may perform this action on the requested resource.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you propagate an end-user identity through a service chain safely?" -->

Use a short-lived, audience-bound signed delegation token with minimal claims and preserve the calling workload identity separately for authorization and audit.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What happens when TLS terminates at a proxy or service mesh?" -->

Downstream code authenticates the proxy unless the identity is re-established or securely propagated. Never trust a client-supplied identity header directly.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do multiple trust domains federate?" -->

Each domain publishes a trust bundle and explicit federation policy. Both sides decide which external identities and namespaces they accept.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is the blast radius of a compromised workload?" -->

It includes every operation and downstream resource permitted to that identity until expiry. Narrow authorization and egress policy reduce that radius.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When is a workload-identity platform excessive for the system?" -->

It is excessive when a small co-located system can rotate a few managed credentials safely and the new control plane costs more than the risk reduced.

<!-- ::end:interview-question -->

## Primary references

- [SPIFFE specification](https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/)
- [SPIFFE Workload API](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/)
- [SPIRE concepts](https://spiffe.io/docs/latest/spire-about/spire-concepts/)

<!-- ::start:quest difficulty="advanced" -->

Map one service call across workload authentication, user delegation, and resource authorization. Record which identity is proven at each hop and how a compromised caller is revoked.

<!-- ::end:quest -->
