---
title: Authorization models from ownership checks to ReBAC
date: 2026-09-09
description: Compare ACL, RBAC, ABAC, ReBAC, and policy-based authorization, then enforce resource-aware decisions in NestJS and React.
tags: Auth
thumbnail: /assets/journal/auth/thumbnails/auth-authorization-models.webp
socialImage: /assets/journal/auth/thumbnails/auth-authorization-models.jpg
---

# Authorization models from ownership checks to ReBAC

Authorization is a decision over a principal, action, resource, and context. “The user is logged in” supplies only the principal. A secure application still asks whether that principal may perform this action on this particular object, inside this tenant, now.

![A policy guard evaluates identity, requested action, protected resource, context, roles, attributes, and relationships before opening an allow gate or closing a deny gate.](/assets/journal/auth/authorization-decision-flow.webp)

_A policy decision combines the principal, action, resource, and context. Authentication supplies one input; it does not determine the result on its own._

## The major models

| Model         | Policy shape                                           | Good fit                           | Pressure point                       |
| ------------- | ------------------------------------------------------ | ---------------------------------- | ------------------------------------ |
| Ownership/ACL | resource lists subjects or grants                      | sharing and document permissions   | list growth, inheritance             |
| RBAC          | users receive roles; roles receive permissions         | stable job functions               | role explosion, object context       |
| ABAC          | rules evaluate subject/resource/environment attributes | contextual and multi-tenant policy | complexity and explainability        |
| ReBAC         | permissions follow relationships in a graph            | nested teams, folders, sharing     | consistency and graph operations     |
| Policy-based  | code or policy engine evaluates named abilities        | centralized cross-service rules    | deployment, availability, versioning |

Claims-based authorization describes inputs such as tenant, department, or scope; it is not a complete model until a policy interprets those claims. Most products use a hybrid: coarse RBAC plus resource ownership, tenant boundaries, and contextual rules.

## NestJS enforcement and React presentation

<!-- ::start:code-example -->

```ts title="post-policy.guard.ts"
import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
  NotFoundException,
} from '@nestjs/common'
import type { Request } from 'express'

@Injectable()
export class PostPolicyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const post = await this.posts.findInTenant(
      request.params['id'],
      request.user.tenantId,
    )
    if (!post) throw new NotFoundException()
    const allowed = await this.policy.can(request.user, 'update', post, {
      now: new Date(),
    })
    if (!allowed) throw new ForbiddenException()
    request['post'] = post
    return true
  }
}
```

```tsx title="PostActions.tsx"
import type { ReactElement } from 'react'

export function PostActions({
  capabilities,
}: {
  capabilities: { canEdit: boolean; canDelete: boolean }
}): ReactElement {
  return (
    <nav aria-label="Post actions">
      {capabilities.canEdit && <button>Edit</button>}
      {capabilities.canDelete && <button>Delete</button>}
    </nav>
  )
}
```

<!-- ::end:code-example -->

### How to apply this policy

1. Register the guard with `@UseGuards(PostPolicyGuard)` and inject the repository plus policy service.
2. Load the post through the authenticated tenant scope, evaluate `update`, and reuse the attached resource in the controller.
3. Return capabilities to React for presentation, while keeping the mutation guard authoritative.

#### Integration example

Attach the policy guard to the mutation and use server-derived capabilities only to shape the React interface:

```ts title="posts.controller.ts"
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { PostPolicyGuard } from './post-policy.guard'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Patch(':id')
  @UseGuards(PostPolicyGuard)
  update(@Param('id') id: string, @Body() body: { title: string }) {
    return this.posts.update(id, body)
  }
}
```

```tsx title="post-actions.tsx"
import { useState } from 'react'

type Props = { postId: string; canUpdate: boolean }

export function PostActions({ postId, canUpdate }: Props) {
  const [saving, setSaving] = useState(false)
  if (!canUpdate) return null

  async function updateTitle() {
    setSaving(true)
    await fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Revised' }),
    })
    setSaving(false)
  }
  return (
    <button disabled={saving} onClick={updateTitle}>
      Edit post
    </button>
  )
}
```

NestJS guards are useful at transport boundaries, but policies may also belong in domain services so background jobs, GraphQL resolvers, and message consumers cannot bypass them. Resolve the object within the authenticated tenant before evaluation. The UI can consume server-derived capabilities, yet the mutation endpoint must decide again to prevent time-of-check/time-of-use mistakes.

## Tradeoffs and failure modes

- RBAC is easy to explain and audit until teams create one role per exception. Prefer permissions behind roles instead of scattering role-name checks.
- ABAC can express time, tenant, classification, and risk, but needs a typed vocabulary, deterministic evaluation, decision logs, and strong tests.
- ReBAC models inherited sharing naturally; tuple updates, consistency, cycles, and “why allowed?” tooling become core infrastructure.
- Central policy engines improve consistency but add latency and an availability dependency. Define caching and fail-closed behavior deliberately.
- Row filtering without operation checks causes mass-assignment and function-level authorization bugs; operation checks without row filtering cause Insecure Direct Object Reference (IDOR) bugs.
- Denials should avoid revealing another tenant’s resources. `404` can be appropriate when existence is sensitive; `403` is useful when existence is already known.

## Interview preparation

Open a question to compare your answer with a concise model response.

<!-- ::start:interview-question question="How do authentication and authorization differ?" -->

Authentication establishes a principal. Authorization evaluates whether that principal may perform a particular action on a resource in the current context.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Compare ACL, RBAC, ABAC, ReBAC, and policy-based access control." -->

ACLs attach grants to resources; RBAC grants permissions through roles; ABAC evaluates attributes; ReBAC follows relationships; policy-based systems centralize evaluation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What causes role explosion, and how would you reduce it?" -->

Creating roles for every exception or resource combination causes explosion. Keep roles coarse and add permissions, ownership, attributes, or relationships for variation.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why is checking `role === 'admin'` usually insufficient?" -->

Role alone omits action, resource ownership, tenant, current state, and context. An administrator role may also be deliberately bounded.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What is object-level authorization and how does IDOR happen?" -->

Object-level authorization checks access to the requested record. IDOR occurs when an attacker changes an identifier and the server loads it without a policy check.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do tenant isolation and authorization interact?" -->

Every lookup and policy must include the authenticated tenant boundary. A valid role in tenant A must never authorize access to tenant B.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Where should policy enforcement live in a NestJS application?" -->

Use guards at request boundaries and domain-service checks for reusable invariants so HTTP, jobs, messages, and GraphQL cannot bypass the policy.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="Why can React permission checks improve UX but not security?" -->

React can hide or disable unavailable controls, improving clarity. Users can modify browser code and call endpoints directly, so it cannot enforce access.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you handle policy changes while a JWT remains valid?" -->

Keep access tokens short-lived, use current policy for sensitive actions, advance an authorization version, or introspect/revoke when immediate change matters.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What should a useful authorization decision log contain?" -->

Include principal, action, resource, tenant, context summary, allow/deny, reason or policy rule, policy version, timestamp, and correlation ID.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How would you test deny-by-default and cross-tenant cases?" -->

Start with unspecified actions denying, then test anonymous, wrong-role, unowned, cross-tenant, archived, and missing resources plus policy-service failure.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="When should a missing resource return 404 rather than 403?" -->

Return 404 when revealing existence would leak information; use 403 when existence is already known and a clear denial is useful. Stay consistent.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="What consistency questions arise in ReBAC systems?" -->

Decide freshness after relationship changes, ordering of tuple updates, behavior during replication lag, cycle handling, and whether stale allows are acceptable.

<!-- ::end:interview-question -->

<!-- ::start:interview-question question="How do you prevent confused-deputy behavior in a service chain?" -->

Bind delegated user context to the intended audience and action, authorize the calling service separately, minimize delegation, and never trust forwarded identity headers blindly.

<!-- ::end:interview-question -->

## Primary references

- [NestJS authorization](https://docs.nestjs.com/security/authorization)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP IDOR Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [NIST role-based access control](https://csrc.nist.gov/projects/role-based-access-control)
- [NIST SP 800-162: Attribute Based Access Control](https://csrc.nist.gov/pubs/sp/800/162/upd2/final)

<!-- ::start:quest difficulty="advanced" -->

Build a policy matrix with anonymous, member, manager, and administrator principals across read, create, update, share, and delete actions. Test owned, unowned, cross-tenant, archived, and missing resources; every unspecified cell must deny.

<!-- ::end:quest -->
