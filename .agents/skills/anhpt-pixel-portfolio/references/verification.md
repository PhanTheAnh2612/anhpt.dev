# Verification

Run checks proportionally to the change. For a completed React page or shared
component change, use all of the following:

```sh
pnpm exec prettier --write <changed files>
pnpm run build
pnpm run lint
npx -y react-doctor@latest . --verbose
```

The build must succeed for both client and SSR/Cloudflare Worker output. The
generated `worker-configuration.d.ts` may currently report two unused
eslint-disable warnings; do not edit that generated file solely to remove them.

For visual changes, inspect at normal laptop width and at 390×844 mobile. Check:

- no page-level horizontal overflow;
- no clipped headings or unreadable panel copy;
- no sprite-atlas labels or neighboring frames bleeding into crops;
- keyboard-focus equivalents for hover-only information;
- no browser console errors;
- desktop and mobile render the same editable content.

React Doctor should finish at 100/100 or any diagnostic must be investigated
and reported with evidence.
