# Visual Asset Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable Agent Skills, deterministic asset pipeline, typed scene/sprite components, and semantic Markdown directive renderer required before anhpt.dev pages are regenerated.

**Architecture:** Focused generation skills share one art bible, write approved source assets into category directories, and delegate all production atlas coordinates to a Node/Sharp packer. React consumes generated manifests through SSR-safe `<picture>` and CSS-step animation components; TanStack Markdown uses its React adapter and comment-component extension for explicit typed directives.

**Tech Stack:** PNPM, Node.js, Sharp, Vitest, TanStack Start/Router/Markdown/Highlight, React 19, strict TypeScript, Tailwind CSS v4, Vite, Cloudflare Workers

**Spec:** `docs/superpowers/specs/2026-09-02-visual-asset-system-design.md`

## Global Constraints

- Keep TanStack Start, TanStack Router, React 19, strict TypeScript, Tailwind CSS v4, TanStack Markdown/Highlight, Vite, PNPM, and Cloudflare Workers.
- Generated art is build-time static content; add no runtime image generation, database, authentication, canvas, collision system, or game loop.
- Permanent scenery may be painted into scenes; characters and changing/animated objects must be transparent separate assets.
- Production scenes are paired `1536x1024` desktop and `1024x1280` mobile PNGs.
- Production atlas coordinates and CSS are generated; never hand-edit offsets.
- Meaningful text remains semantic DOM content, never raster-only artwork.
- Animations must have a static fallback under `prefers-reduced-motion: reduce`.
- Raw HTML and arbitrary JSX remain disabled in Markdown.
- Use deep imports from defining modules; do not add barrel files.
- Before editing TanStack files, run the matching TanStack Intent command from `AGENTS.md`.

---

## File Structure

### Skill and reference files

- `.agents/skills/anhpt-art-direction/SKILL.md`: shared routing and immutable visual rules.
- `.agents/skills/anhpt-art-direction/references/{palette,character,composition,typography,originality}.md`: canonical art bible.
- `.agents/skills/scene-generation/SKILL.md`: environment-only paired-scene workflow.
- `.agents/skills/character-animation/SKILL.md`: contextual character sequence workflow.
- `.agents/skills/content-element-generation/SKILL.md`: Markdown visual-element workflow.
- `.agents/skills/asset-atlas-pipeline/SKILL.md`: validation and deterministic packing workflow.
- `.agents/skills/sprite-generation/SKILL.md`: compatibility redirect to the new character skill.
- `.agents/skills/anhpt-pixel-portfolio/SKILL.md`: composition-only responsibilities.
- `AGENTS.md`: project skill routing.

### Asset tooling

- `scripts/assets/contracts.ts`: source metadata and generated-manifest types.
- `scripts/assets/validation.ts`: shared scene/frame validation.
- `scripts/assets/pack-atlases.ts`: deterministic Sharp composites and generated outputs.
- `scripts/assets/generate-scenes.ts`: validated scene-manifest generation.
- `scripts/assets/*.test.ts`: Vitest coverage with temporary fixtures.
- `assets-src/**/.gitkeep`: versioned source layout without shipping intermediate assets.
- `src/generated/{scene-manifest,sprite-manifest}.ts`: generated runtime data.
- `src/generated/sprite-atlases.css`: generated atlas variables/keyframes.

### Runtime and content

- `src/components/shared/pixel-scene.tsx`: responsive scene `<picture>` and overlay slots.
- `src/components/shared/pixel-sprite.tsx`: typed static frame.
- `src/components/shared/pixel-animation.tsx`: typed CSS-step sequence.
- `src/components/features/markdown/markdown-content.tsx`: React Markdown adapter.
- `src/components/features/markdown/content-directives.tsx`: semantic directive components.
- `src/lib/markdown-extensions.ts`: extension configuration and attribute validation.
- `src/lib/content.ts`: parsed content contract; no HTML-string rendering.
- `src/styles/index.css`: font variables and imports.

---

### Task 1: Establish the Test Toolchain and Skill Contract

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `scripts/assets/skill-contract.test.ts`
- Create: `.agents/skills/anhpt-art-direction/SKILL.md`
- Create: `.agents/skills/anhpt-art-direction/references/palette.md`
- Create: `.agents/skills/anhpt-art-direction/references/character.md`
- Create: `.agents/skills/anhpt-art-direction/references/composition.md`
- Create: `.agents/skills/anhpt-art-direction/references/typography.md`
- Create: `.agents/skills/anhpt-art-direction/references/originality.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: approved spec and existing `src/styles/index.css` color tokens.
- Produces: `pnpm test`, `pnpm test:assets`, and one canonical art-direction skill referenced by later skills.

- [ ] **Step 1: Invoke the skill-authoring guidance**

Read `skill-creator` and `superpowers:writing-skills` completely before editing skill files. Keep the approved spec authoritative when their generic examples differ.

- [ ] **Step 2: Install the compatible development dependencies**

Run:

```sh
pnpm add -D vitest sharp
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:assets": "vitest run scripts/assets"
  }
}
```

- [ ] **Step 3: Write the failing skill-contract test**

```ts
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

const skill = (name: string) =>
  readFile(new URL(`../../.agents/skills/${name}/SKILL.md`, import.meta.url), 'utf8')

describe('visual skill contract', () => {
  it.each(['anhpt-art-direction'])('%s has valid frontmatter', async (name) => {
    const source = await skill(name)
    expect(source).toMatch(/^---\nname: [a-z0-9-]+\ndescription: .+\n---/)
  })
})
```

- [ ] **Step 4: Run the test and verify the missing skills fail**

Run: `pnpm test:assets -- scripts/assets/skill-contract.test.ts`

Expected: FAIL with `ENOENT` for `scene-generation/SKILL.md`.

- [ ] **Step 5: Write the canonical art-direction skill and references**

The skill frontmatter must begin exactly:

```md
---
name: anhpt-art-direction
description: Apply the canonical anhpt.dev emerald handheld-RPG visual language, character identity, composition, typography, and originality rules. Use before generating or reviewing any anhpt.dev raster scene, sprite, badge, icon, or content decoration.
---
```

Its body must route to all five reference files and require reviewers to reject character drift, embedded meaningful text, copied logos/locations, inconsistent lighting, and non-pixel edge treatment. Copy the active CSS palette values from `src/styles/index.css`; document Press Start 2P, Pixelify Sans, and VT323 roles; record Anh's red cap, black glasses, dark-red shirt, white cargo pants, black/orange shoes, backpack, watch, and approachable adult identity.

- [ ] **Step 6: Register the art-direction skill**

Add to the `## Project skills` section of `AGENTS.md`:

```md
- Before generating or reviewing anhpt.dev imagery, read
  `.agents/skills/anhpt-art-direction/SKILL.md` and the asset-type skill it routes to.
```

- [ ] **Step 7: Run focused verification**

Run: `pnpm test:assets -- scripts/assets/skill-contract.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

```sh
git add package.json pnpm-lock.yaml AGENTS.md scripts/assets/skill-contract.test.ts .agents/skills/anhpt-art-direction
git commit -m "build: establish visual skill contract"
```

### Task 2: Add the Focused Generation and Pipeline Skills

**Files:**
- Create: `.agents/skills/scene-generation/SKILL.md`
- Create: `.agents/skills/character-animation/SKILL.md`
- Create: `.agents/skills/content-element-generation/SKILL.md`
- Create: `.agents/skills/asset-atlas-pipeline/SKILL.md`
- Modify: `.agents/skills/sprite-generation/SKILL.md`
- Modify: `.agents/skills/anhpt-pixel-portfolio/SKILL.md`
- Modify: `AGENTS.md`
- Test: `scripts/assets/skill-contract.test.ts`

**Interfaces:**
- Consumes: `.agents/skills/anhpt-art-direction/SKILL.md` and its references.
- Produces: four focused callable skills with non-overlapping responsibilities.

- [ ] **Step 1: Extend the failing contract test with responsibility assertions**

```ts
it.each([
  'scene-generation',
  'character-animation',
  'content-element-generation',
  'asset-atlas-pipeline',
])('%s routes to the shared art bible', async (name) => {
  expect(await skill(name)).toContain('../anhpt-art-direction/')
})

it('keeps generation responsibilities separate', async () => {
  expect(await skill('scene-generation')).toContain('environment-only')
  expect(await skill('scene-generation')).toContain('1536x1024')
  expect(await skill('scene-generation')).toContain('1024x1280')
  expect(await skill('character-animation')).toContain('run-loading')
  expect(await skill('character-animation')).toContain('Never ask the image model to pack the atlas')
  expect(await skill('content-element-generation')).toContain('trainer-tip')
  expect(await skill('asset-atlas-pipeline')).toContain('does not generate artwork')
})
```

- [ ] **Step 2: Run the contract test to verify failure**

Run: `pnpm test:assets -- scripts/assets/skill-contract.test.ts`

Expected: FAIL because the focused skill files do not exist.

- [ ] **Step 3: Create each focused skill**

Each skill must:

```md
1. Read `../anhpt-art-direction/SKILL.md` and only the references needed for the request.
2. Inspect existing approved assets and generation records before prompting.
3. State exact output paths and metadata before generation.
4. Generate one scene pair, animation sequence, or semantic asset family at a time.
5. Run the asset validation workflow.
6. Stop for visual review before registering production output.
```

`scene-generation` forbids Anh, NPCs, dynamic props, UI, labels, and readable text. `character-animation` declares the initial state registry from the spec and requires equal frame canvas/anchor per sequence. `content-element-generation` declares the semantic directive registry. `asset-atlas-pipeline` only validates, packs, generates manifests, and previews animations.

- [ ] **Step 4: Retire the legacy skill without breaking old references**

Replace `.agents/skills/sprite-generation/SKILL.md` with a short compatibility skill that routes new artwork to `../character-animation/SKILL.md` and existing-atlas consumption to `../anhpt-pixel-portfolio/SKILL.md`. Remove all instructions to generate a complete atlas in one image-model request.

- [ ] **Step 5: Narrow the portfolio skill**

Update `.agents/skills/anhpt-pixel-portfolio/SKILL.md` so it consumes registered scene/sprite manifests, may request missing assets through focused skills, and cannot create unregistered image prompts or manual atlas offsets.

- [ ] **Step 6: Run tests**

Run: `pnpm test:assets -- scripts/assets/skill-contract.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```sh
git add AGENTS.md .agents/skills scripts/assets/skill-contract.test.ts
git commit -m "docs: add focused pixel asset skills"
```

### Task 3: Define Asset Contracts and Structural Validation

**Files:**
- Create: `scripts/assets/contracts.ts`
- Create: `scripts/assets/validation.ts`
- Create: `scripts/assets/validation.test.ts`
- Create: `scripts/assets/validate-all.ts`
- Create: `assets-src/art-direction/.gitkeep`
- Create: `assets-src/scenes/.gitkeep`
- Create: `assets-src/character/.gitkeep`
- Create: `assets-src/content/.gitkeep`
- Create: `assets-src/world/.gitkeep`
- Create: `assets-src/generation-records/.gitkeep`
- Modify: `package.json`

**Interfaces:**
- Consumes: PNG paths and JSON-compatible source records.
- Produces: `validateScenePair(record): Promise<void>` and `validateSequence(record): Promise<void>`.

- [ ] **Step 1: Write failing validation tests**

```ts
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { validateScenePair, validateSequence } from './validation'

describe('asset validation', () => {
  it('rejects a scene pair with the wrong dimensions', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'anhpt-scene-'))
    const desktop = join(dir, 'home.desktop.png')
    const mobile = join(dir, 'home.mobile.png')
    await sharp({ create: { width: 10, height: 10, channels: 3, background: '#061f1b' } }).png().toFile(desktop)
    await sharp({ create: { width: 10, height: 10, channels: 3, background: '#061f1b' } }).png().toFile(mobile)
    await expect(validateScenePair({ name: 'home', desktop, mobile, anchors: {} })).rejects.toThrow('1536x1024')
  })

  it('rejects animation frames with mismatched dimensions', async () => {
    await expect(validateSequence({
      name: 'idle', durationMs: 600, loop: true, fallback: 0,
      frames: [{ path: 'a.png', width: 64, height: 96 }, { path: 'b.png', width: 65, height: 96 }],
    })).rejects.toThrow('same dimensions')
  })
})
```

- [ ] **Step 2: Run the tests to verify failure**

Run: `pnpm test:assets -- scripts/assets/validation.test.ts`

Expected: FAIL because `validation.ts` does not exist.

- [ ] **Step 3: Define exact contracts**

```ts
export type SceneAnchor = { xPercent: number; yPercent: number; scale: number }
export type SceneSource = {
  name: string
  desktop: string
  mobile: string
  anchors: Record<string, { desktop: SceneAnchor; mobile: SceneAnchor }>
}
export type FrameSource = { path: string; width: number; height: number }
export type SequenceSource = {
  name: string
  durationMs: number
  loop: boolean
  fallback: number
  frames: FrameSource[]
}
```

- [ ] **Step 4: Implement minimal structural validation**

Use `sharp(path).metadata()` to require exact scene dimensions. For four-channel
scenes, inspect `ensureAlpha().stats()` and require alpha-channel minimum `255`;
three-channel scenes are already opaque. For sprites, require PNG input, alpha
presence, non-empty transparent margin, at least two frames for animated
sequences, equal frame dimensions, a valid fallback index, and positive
duration. Error messages must include the asset/sequence name and violated
value.

- [ ] **Step 5: Add validation scripts**

Add:

```json
{
  "scripts": {
    "assets:validate": "tsx scripts/assets/validate-all.ts"
  },
  "devDependencies": {
    "tsx": "latest"
  }
}
```

Install with `pnpm add -D tsx`, then create `scripts/assets/validate-all.ts` to load source JSON records and call the exported validators. An empty source catalog exits successfully; malformed registered records fail.

- [ ] **Step 6: Run tests**

Run: `pnpm test:assets -- scripts/assets/validation.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```sh
git add package.json pnpm-lock.yaml scripts/assets assets-src
git commit -m "feat: validate pixel asset sources"
```

### Task 4: Pack Atlases and Generate Typed Manifests

**Files:**
- Create: `scripts/assets/pack-atlases.ts`
- Create: `scripts/assets/pack-atlases.test.ts`
- Create: `scripts/assets/generate-scenes.ts`
- Create: `src/generated/scene-manifest.ts`
- Create: `src/generated/sprite-manifest.ts`
- Create: `src/generated/sprite-atlases.css`
- Modify: `package.json`

**Interfaces:**
- Consumes: validated `SceneSource[]` and grouped `SequenceSource[]`.
- Produces: `packAtlas(atlasName, sequences, outputDir): Promise<SpriteAtlasManifest>` and `generateSceneManifest(scenes, outputFile): Promise<void>`.

- [ ] **Step 1: Write a failing deterministic-packing test**

```ts
it('places sequence frames contiguously and emits stable metadata', async () => {
  const manifest = await packAtlas('character', [idleSequence], outputDir)
  expect(manifest.sequences.idle).toEqual({
    atlas: 'character', durationMs: 600, loop: true, fallback: 0,
    frames: [
      { x: 0, y: 0, width: 64, height: 96 },
      { x: 64, y: 0, width: 64, height: 96 },
    ],
  })
})
```

Create the two transparent fixture frames inside the test with Sharp so no binary fixture is committed.

- [ ] **Step 2: Run the packing test to verify failure**

Run: `pnpm test:assets -- scripts/assets/pack-atlases.test.ts`

Expected: FAIL because `packAtlas` is undefined.

- [ ] **Step 3: Implement deterministic row packing**

Sort sequences and frames by declared registry order, place each sequence on a dedicated row, and set atlas width to the maximum row width. Use `sharp({ create: { channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 }}}).composite(...)`. Keep packing simple; do not introduce a bin-packing dependency.

Export manifest types:

```ts
export type SpriteFrame = { x: number; y: number; width: number; height: number }
export type SpriteSequence = {
  atlas: 'character' | 'content' | 'world'
  durationMs: number
  loop: boolean
  fallback: number
  frames: SpriteFrame[]
}
```

- [ ] **Step 4: Generate TypeScript and CSS**

Generate `sprite-manifest.ts` with `as const satisfies Record<string, SpriteSequence>`. Generate one CSS class and keyframes block per sequence. Keyframes set `background-position` from generated coordinates; the reduced-motion rule freezes the fallback frame. Generate `scene-manifest.ts` with exact desktop/mobile URLs and anchors.

- [ ] **Step 5: Add the build scripts**

```json
{
  "scripts": {
    "assets:build": "tsx scripts/assets/pack-atlases.ts && tsx scripts/assets/generate-scenes.ts",
    "build": "pnpm assets:validate && pnpm assets:build && vite build"
  }
}
```

Do not ignore `src/generated` or production atlases; commit generated outputs so deployment does not depend on source artwork being present outside the checkout.

- [ ] **Step 6: Run tests and generation**

Run:

```sh
pnpm test:assets -- scripts/assets/pack-atlases.test.ts
pnpm assets:build
```

Expected: PASS; empty production catalogs generate typed empty registries without deleting existing art.

- [ ] **Step 7: Commit**

```sh
git add package.json scripts/assets src/generated public/assets/atlases
git commit -m "feat: generate deterministic sprite atlases"
```

### Task 5: Add Typed Sprite Runtime Components

**Files:**
- Create: `src/components/shared/pixel-sprite.tsx`
- Create: `src/components/shared/pixel-animation.tsx`
- Create: `src/components/shared/pixel-sprite.test.tsx`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/render-with-router.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: `spriteManifest` and generated atlas CSS.
- Produces: `<PixelSprite name scale className />` and `<PixelAnimation name scale className label />`.

- [ ] **Step 1: Add the React test environment**

Run:

```sh
pnpm add -D @testing-library/react @testing-library/jest-dom jsdom
```

Configure `vitest.config.ts` to use `jsdom` for `src/**/*.test.tsx` and load
`src/test/setup.ts`; the setup file imports `@testing-library/jest-dom/vitest`.
Mock `src/generated/sprite-manifest.ts` in this test with two fixture
sequences so the runtime component is testable before production art exists.

Create a reusable `renderWithRouter(ui, initialPath = '/')` test helper using
TanStack Router's `createMemoryHistory`, `createRootRoute`, `createRoute`,
`createRouter`, and `RouterProvider`. It must await `router.load()` before
calling Testing Library's `render`, so later feature tests exercise real
TanStack links without mocking them.

```tsx
import type { ReactNode } from 'react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'

export async function renderWithRouter(
  ui: ReactNode,
  initialPath = '/',
) {
  const root = createRootRoute({ component: () => <>{ui}</> })
  const index = createRoute({ getParentRoute: () => root, path: '/' })
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    routeTree: root.addChildren([index]),
  })
  await router.load()
  return render(<RouterProvider router={router} />)
}
```

- [ ] **Step 2: Write failing component tests**

```tsx
it('renders a registered animation as decorative by default', () => {
  const { container } = render(<PixelAnimation name="idle" scale={2} />)
  const sprite = container.firstElementChild
  expect(sprite).toHaveAttribute('aria-hidden', 'true')
  expect(sprite).toHaveClass('pixel-animation--idle')
  expect(sprite).toHaveStyle({ '--pixel-scale': '2' })
})

it('uses an accessible image label when supplied', () => {
  render(<PixelAnimation name="run-loading" label="Loading the next route" />)
  expect(screen.getByRole('img', { name: 'Loading the next route' })).toBeTruthy()
})
```

- [ ] **Step 3: Run the tests to verify failure**

Run: `pnpm test -- src/components/shared/pixel-sprite.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 4: Implement the components**

Both components validate names at compile time using `keyof typeof spriteManifest`. Set size and scale through CSS variables; do not duplicate atlas coordinates in JSX. `PixelSprite` selects a sequence and explicit frame index. `PixelAnimation` applies only the generated sequence class. When `label` is absent, render `aria-hidden="true"`; when present, render `role="img"` and `aria-label`.

- [ ] **Step 5: Import generated CSS once**

Add `@import '../generated/sprite-atlases.css';` after Tailwind in `src/styles/index.css`. Remove `@import 'base-sprites.css'` only after all existing `BaseSprite` consumers migrate in the page plan.

- [ ] **Step 6: Run tests**

Run: `pnpm test -- src/components/shared/pixel-sprite.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```sh
git add package.json pnpm-lock.yaml src/components/shared src/styles/index.css
git commit -m "feat: add typed pixel animation components"
```

### Task 6: Add Responsive Scene Composition

**Files:**
- Create: `src/components/shared/pixel-scene.tsx`
- Create: `src/components/shared/pixel-scene.test.tsx`
- Modify: `src/generated/scene-manifest.ts`

**Interfaces:**
- Consumes: `sceneManifest` with desktop/mobile sources and named anchors.
- Produces: `<PixelScene name overlays className />` and `SceneName`/`SceneAnchorName<Name>` types.

- [ ] **Step 1: Write the failing scene test**

```tsx
it('renders both scene variants and positions registered overlays', () => {
  render(<PixelScene name="fixture" overlays={{ character: <span>Anh</span> }} />)
  expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/scenes/fixture.desktop.png')
  expect(document.querySelector('source')).toHaveAttribute('srcset', '/assets/scenes/fixture.mobile.png')
  expect(screen.getByText('Anh').parentElement).toHaveStyle({ '--anchor-x': '30%' })
})
```

- [ ] **Step 2: Run the test to verify failure**

Run: `pnpm test -- src/components/shared/pixel-scene.test.tsx`

Expected: FAIL because `PixelScene` does not exist.

- [ ] **Step 3: Implement `<PixelScene>`**

Render:

```tsx
<figure className={className} data-scene={name}>
  <picture>
    <source media="(max-width: 560px)" srcSet={scene.mobile.src} />
    <img alt="" src={scene.desktop.src} />
  </picture>
  {Object.entries(overlays).map(([anchor, node]) => (
    <div className="pixel-scene__overlay" data-anchor={anchor} style={anchorStyle(scene, anchor)} key={anchor}>
      {node}
    </div>
  ))}
</figure>
```

Use CSS variables for desktop anchor values and media-query-specific variables for mobile values. The scene image is decorative; callers supply accessible UI outside or inside overlays.

- [ ] **Step 4: Run tests**

Run: `pnpm test -- src/components/shared/pixel-scene.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```sh
git add src/components/shared/pixel-scene.tsx src/components/shared/pixel-scene.test.tsx src/generated/scene-manifest.ts
git commit -m "feat: compose responsive pixel scenes"
```

### Task 7: Add Typed Markdown Directives and React Rendering

**Files:**
- Create: `src/lib/markdown-extensions.ts`
- Create: `src/lib/markdown-extensions.test.ts`
- Create: `src/components/features/markdown/content-directives.tsx`
- Create: `src/components/features/markdown/markdown-content.tsx`
- Create: `src/components/features/markdown/markdown-content.test.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/routes/courses/$slug.tsx`
- Modify: `src/routes/journal/$slug.tsx`

**Interfaces:**
- Consumes: Markdown source and `ContentEntry`.
- Produces: `parseContentMarkdown(source): MarkdownDocument` and `<MarkdownContent entry />`.

- [ ] **Step 1: Load TanStack Markdown guidance**

Run the matching TanStack Intent command from `AGENTS.md`, then use the package's narrow imports: `@tanstack/markdown/parser`, `@tanstack/markdown/react`, and `@tanstack/markdown/extensions/comment-components`.

- [ ] **Step 2: Write failing directive tests**

```tsx
const source = `<!-- ::start:trainer-tip pose="think" -->
Keep state synchronized.
<!-- ::end:trainer-tip -->`

it('renders a trainer tip through a semantic component', () => {
  render(<MarkdownContent source={source} />)
  expect(screen.getByRole('note', { name: 'Trainer tip' })).toHaveTextContent('Keep state synchronized.')
})

it('rejects unknown attributes with source context', () => {
  expect(() => parseContentMarkdown('<!-- ::quest power="99" -->')).toThrow('quest: unknown attribute "power"')
})
```

- [ ] **Step 3: Run tests to verify failure**

Run: `pnpm test -- src/lib/markdown-extensions.test.ts src/components/features/markdown/markdown-content.test.tsx`

Expected: FAIL because the parser and component do not exist.

- [ ] **Step 4: Implement the directive registry**

Define finite names and attributes:

```ts
const spriteName = Symbol('registered-sprite-name')

export const directiveContract = {
  'trainer-tip': { pose: ['idle', 'think', 'question', 'point', 'teach'] },
  note: {}, warning: {}, remember: {},
  quest: { difficulty: ['beginner', 'intermediate', 'advanced'], reward: spriteName },
  challenge: { difficulty: ['beginner', 'intermediate', 'advanced'] },
  exercise: {}, quiz: {}, reward: { icon: spriteName },
  badge: { icon: spriteName }, success: {}, locked: {}, current: {},
  'code-example': {}, terminal: {}, architecture: {}, resource: {},
} as const
```

Declare `const spriteName = Symbol('registered-sprite-name')` and validate those
attributes with `value in spriteManifest`. Use
`commentComponentsExtension({ transformComponent })` to validate names and
attributes and retain nested blocks. Map custom tag names through
`MarkdownComponents` to semantic React components. Do not enable `allowHtml`.

- [ ] **Step 5: Preserve highlighting and remove HTML-string rendering**

`MarkdownContent` passes the existing TanStack Highlight callback to the React renderer. Change `ContentEntry` to store a parsed serializable document or parse it through `parseContentMarkdown`. Delete `renderContent` from `src/lib/content.ts`; replace both `dangerouslySetInnerHTML` call sites with `<MarkdownContent entry={entry} />`.

- [ ] **Step 6: Run tests and SSR build**

Run:

```sh
pnpm test -- src/lib/markdown-extensions.test.ts src/components/features/markdown/markdown-content.test.tsx
pnpm run build
```

Expected: PASS; build contains no `dangerouslySetInnerHTML` in course or journal routes and no hydration error.

- [ ] **Step 7: Commit**

```sh
git add src/lib src/components/features/markdown src/routes/courses src/routes/journal
git commit -m "feat: render typed markdown directives"
```

### Task 8: Add the Approved Typography and Complete Foundation Verification

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/styles/index.css`
- Modify: `.agents/skills/anhpt-pixel-portfolio/references/verification.md`

**Interfaces:**
- Consumes: Fontsource packages and existing CSS tokens.
- Produces: `--font-display`, `--font-content`, and `--font-terminal` application-wide variables.

- [ ] **Step 1: Install versioned self-hosted fonts**

Run:

```sh
pnpm add @fontsource/press-start-2p @fontsource/pixelify-sans @fontsource/vt323
```

- [ ] **Step 2: Import fonts and declare roles**

At the top of `src/styles/index.css`, import the fonts and add:

```css
:root {
  --font-display: 'Press Start 2P', ui-monospace, monospace;
  --font-content: 'Pixelify Sans', system-ui, sans-serif;
  --font-terminal: 'VT323', ui-monospace, monospace;
}

body { font-family: var(--font-content); }
h1, h2, .menu-title, .panel-label { font-family: var(--font-display); }
.terminal, .secret-notes { font-family: var(--font-terminal); }
```

Keep long-form content at least `1rem` with line-height `1.6`; do not globally force the display face onto body copy.

- [ ] **Step 3: Update project verification guidance**

Add asset validation/build and Markdown directive tests to the project skill's verification checklist. Require visual inspection of desktop/mobile scene pairs and reduced motion.

- [ ] **Step 4: Run the complete foundation gate**

Run:

```sh
pnpm format
pnpm test
pnpm run build
pnpm run lint
npx -y react-doctor@latest . --verbose
git diff --check
```

Expected: tests/build/lint pass, React Doctor reports 100/100 or every remaining diagnostic is investigated and documented before proceeding.

- [ ] **Step 5: Commit**

```sh
git add package.json pnpm-lock.yaml src/styles/index.css .agents/skills/anhpt-pixel-portfolio/references/verification.md
git commit -m "feat: finish visual asset foundation"
```

## Foundation Completion Gate

Do not start the page reimplementation plan until all of these are true:

- All five visual skills pass the skill-contract tests.
- Bad scene/sprite fixtures fail with actionable validation messages.
- Identical fixture inputs produce stable atlas metadata.
- `PixelScene`, `PixelSprite`, and `PixelAnimation` tests pass.
- Markdown directives render through React during SSR without raw HTML.
- The production Cloudflare Worker build passes.
