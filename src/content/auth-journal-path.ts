export type AuthJournalStep = {
  slug: string
  reason: string
}

export const authJournalPath: AuthJournalStep[] = [
  {
    slug: 'auth-field-guide',
    reason:
      'Build the vocabulary and separate authentication from authorization.',
  },
  {
    slug: 'auth-passwords-and-sessions',
    reason:
      'Learn the stateful browser-login baseline before comparing token systems.',
  },
  {
    slug: 'auth-authorization-models',
    reason:
      'Decide what an authenticated principal may do with RBAC, ABAC, and ReBAC.',
  },
  {
    slug: 'auth-jwt-access-refresh-tokens',
    reason:
      'Understand token validation, refresh rotation, replay, and revocation.',
  },
  {
    slug: 'auth-oauth-oidc-social-login',
    reason:
      'Apply token concepts to delegated access and federated user identity.',
  },
  {
    slug: 'auth-passkeys-webauthn',
    reason: 'Study phishing-resistant public-key authentication for browsers.',
  },
  {
    slug: 'auth-mfa-passwordless-recovery',
    reason:
      'Design factor composition, step-up checks, and recovery as one system.',
  },
  {
    slug: 'auth-api-keys-service-identity',
    reason:
      'Move from human login to scoped credentials for integrations and services.',
  },
  {
    slug: 'auth-saml-enterprise-sso',
    reason:
      'Extend federation knowledge to enterprise assertions and tenant configuration.',
  },
  {
    slug: 'auth-workload-identity',
    reason:
      'Finish with short-lived, attested identities for service-to-service systems.',
  },
]

export const getAuthJournalOrder = (slug: string) =>
  authJournalPath.findIndex((step) => step.slug === slug)
