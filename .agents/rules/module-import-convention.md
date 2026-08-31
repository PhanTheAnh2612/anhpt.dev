---
trigger: always_on
---

# Module Import Convention

Use this rule whenever writing or reviewing imports in repo code under `app/**`.

## Core Rule

Repo code imports from the **dedicated module file**, never an aggregating barrel.

```ts
// ✅ deep imports — the dedicated file that defines the symbol
import { Button } from '~/components/button';
import { Typography } from '~/components/typography';
import { useCampaigns } from '~/hooks/use-campaigns';
import { CampaignsProvider } from '~/providers/campaigns-provider';
import { QUERY_KEY_ID } from '~/constants/queryKeyId';
import { createService } from '~/lib/serviceFactory';

// ❌ never — top-level barrels inside the repo
import { Button } from '~/components';
import { useCampaigns } from '~/hooks';
import { CampaignsProvider } from '~/providers';
import { CampaignSchema } from '~/schemas';
import { QUERY_KEY_ID } from '~/constants';
```

This applies to all repo code under `app/**`: primitives, `app/components/features/**`, hooks, providers, routes,
layouts, pages, stories, and tests. Feature sub-barrels such as `~/components/features/<domain>` are barrels too —
import the specific file.

## Why

- One barrel import drags the entire library graph into that route/chunk and defeats code-splitting and tree-shaking.
- A barrel member importing its own barrel creates circular dependencies that can fail under the Vite dev/SSR module
  runner.