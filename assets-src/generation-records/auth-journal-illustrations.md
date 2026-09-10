# Auth Journal illustrations

Generated as article-width educational illustrations. These are Markdown media,
not semantic directive icons, so they are stored under
`public/assets/journal/auth/` and referenced with descriptive alternative text
and adjacent captions.

## Shared specification

- Canvas: 1200×675 WebP, landscape 16:9.
- Display: responsive article width; `image-rendering: pixelated`.
- Palette: deep emerald and forest green, warm cream, sparing gold, muted red.
- Rendering: original polished 16-bit-inspired pixel art, crisp square clusters,
  stepped outlines, one warm light source, and readable silhouettes.
- Accessibility: no meaningful text is embedded in the pixels. Each use has
  specific alternative text and an editable explanatory caption.
- Avoided: logos, copied interfaces, readable text, watermarks, gradients,
  blur, antialiasing, painterly texture, and photorealism.

## Outputs and intent

| Output                             | Visual model                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `system-map.webp`                  | Browser → authentication gate → identity vault → policy checkpoint → protected resource |
| `session-token-flow.webp`          | Credential exchange, protected access, rotation, and invalidation                       |
| `federation-flow.webp`             | Browser redirect, trusted identity provider, callback, and API access paths             |
| `passkey-mfa-flow.webp`            | Device-held passkey plus TOTP, hardware, phone, and email factor paths                  |
| `machine-identity-flow.webp`       | Human, client credential, and attested workload identity paths                          |
| `authorization-decision-flow.webp` | Principal, action, resource, context, roles/attributes/relationships → allow or deny    |

## Review notes

All six images use original locations and symbols, contain no readable labels,
and preserve editable explanations in Markdown. The files were resized with
nearest-neighbor sampling and encoded losslessly as WebP. Their role is to help
readers recognize the sequence and boundaries; the adjacent prose remains the
authoritative technical explanation.

## Social thumbnail family

- Canvas: 1200×675 lossless WebP cards plus JPEG social variants, center-safe
  for link-preview crops.
- Output directory: `public/assets/journal/auth/thumbnails/`.
- Variants: one named cover for each of the ten Auth journal slugs.
- Intended display: WebP on Journal cards; JPEG in Open Graph and Twitter/X
  summary metadata for broad crawler compatibility.
- Generation: built-in image generation, followed by nearest-neighbor resizing.
- Review: unique topic silhouette, no readable text, logos, watermarks, copied
  interfaces, or franchise imagery; semantic titles remain in HTML metadata.

### Thumbnail prompt set

Every prompt used the shared 16-bit emerald render signature and prohibited
text, logos, copied interfaces, franchise imagery, and watermarks.

| Slug | Cover subject |
| --- | --- |
| `auth-field-guide` | Browser, identity gate, credential vault, policy checkpoint, and protected resource |
| `auth-passwords-and-sessions` | Login terminal, protected cookie tunnel, server vault, rotation, and revocation |
| `auth-authorization-models` | Principal, action, resource, and context converging on allow/deny policy paths |
| `auth-jwt-access-refresh-tokens` | Short-lived access token, guarded API, refresh vault, rotation, and invalidation |
| `auth-oauth-oidc-social-login` | Browser redirect, identity tower, callback gate, session vault, and PKCE key halves |
| `auth-passkeys-webauthn` | Browser, authenticator, origin binding, challenge, and server verification |
| `auth-mfa-passwordless-recovery` | Passkey, TOTP, hardware key, recovery code, and guarded recovery path |
| `auth-api-keys-service-identity` | Scoped API key, mTLS shield, workload identity, rotation, and rate limit |
| `auth-saml-enterprise-sso` | Tenant portal, identity provider, assertion, ACS gate, and trust seal |
| `auth-workload-identity` | Service chambers receiving short-lived identities inside a trust domain |
