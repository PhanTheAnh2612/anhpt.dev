# Page Reimplementation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reimplement the approved anhpt.dev product surfaces with separated responsive scenes, contextual character animation, typed Markdown visuals, and the existing SSR-first content model.

**Architecture:** Each route composes semantic React UI over registered desktop/mobile scene pairs and generated sprite manifests. World Map and Secret Base remain visual baselines; Home proves full scene/character separation, then course, content, portfolio, discovery, and error surfaces migrate incrementally without adding game-engine state.

**Tech Stack:** TanStack Start/Router/Markdown/Highlight, React 19, strict TypeScript, Tailwind CSS v4, generated CSS sprite atlases, PNPM, Vite, Cloudflare Workers, Vitest/Testing Library

**Spec:** `docs/superpowers/specs/2026-09-02-visual-asset-system-design.md`

## Global Constraints

- Complete `docs/superpowers/plans/2026-09-02-visual-asset-foundation.md` first.
- Invoke `anhpt-art-direction` plus the focused asset skill for every generated image.
- Scene art contains permanent scenery only; characters, dynamic props, UI, and readable text remain separate.
- Every new major scene ships as 1536x1024 desktop and 1024x1280 mobile variants.
- All character motion is preset contextual animation; users never control Anh.
- World Map and Secret Base are approved baselines and are not regenerated unless needed for a mobile pair or layer separation.
- Guild Hall remains the professional journey; do not restore confidential Project Showcase or dedicated About routes.
- Course and journal bodies remain local Markdown.
- Preserve SSR, keyboard access, reduced motion, 390x844 usability, and no document-level horizontal overflow.

---

## File Structure

- `src/components/features/home/`: landing composition and tests.
- `src/components/features/journey/`: map and route-overview compositions.
- `src/components/features/learning/`: lesson, mastery, progress, reward, and directive compositions.
- `src/components/features/guild/`: professional Guild Hall compositions.
- `src/components/features/discovery/`: badges, journal list, search, and 404 compositions.
- `src/content/`: editable copy and Markdown only.
- `src/routes/`: thin TanStack file routes and typed search/params.
- `assets-src/`: reviewed generation sources and records.
- `public/assets/scenes/` and `public/assets/atlases/`: validated production output only.

### Task 1: Separate and Rebuild the Landing Page

**Files:**
- Create: `assets-src/scenes/home/home.scene.json`
- Create: `assets-src/generation-records/home-scene.md`
- Create: `assets-src/character/{idle,blink}/sequence.json`
- Create: `src/components/features/home/home-hero.tsx`
- Create: `src/components/features/home/home-hero.test.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/generated/scene-manifest.ts`
- Modify: `src/generated/sprite-manifest.ts`
- Generated: `public/assets/scenes/home.{desktop,mobile}.png`
- Generated: `public/assets/atlases/character.png`

**Interfaces:**
- Consumes: `<PixelScene>`, `<PixelAnimation>`, scene/character skills.
- Produces: `<HomeHero />` with separate scenery, Anh animation, menu, and dialogue.

- [ ] **Step 1: Write the failing composition test**

```tsx
it('keeps the landing character and copy outside the scene image', async () => {
  await renderWithRouter(<HomeHero />)
  expect(screen.getByRole('link', { name: /start journey/i })).toBeTruthy()
  expect(screen.getByRole('img', { name: /anh welcomes visitors/i })).toBeTruthy()
  expect(screen.getByTestId('home-scene').querySelector('img')).toHaveAttribute('alt', '')
  expect(screen.getByText(/let's learn, build, and level up together/i)).toBeTruthy()
})
```

- [ ] **Step 2: Generate and review the background pair**

Invoke `scene-generation` with the approved coastal route as composition reference. Require the same house, forest path, coast, ocean, and distant mountain mood, but no Anh, NPC, menu, sign text, dialogue, or dynamic prop. Reserve a calm character anchor on the lower-left path and menu safe area on the right for desktop; reserve stacked character/menu zones on mobile. Save the exact prompt and references in `home-scene.md`. Stop for user visual approval before registration.

- [ ] **Step 3: Generate and review `idle` and `blink` sequences**

Invoke `character-animation`; generate individual transparent frames using the canonical Anh reference. Validate equal canvas/anchor, preview the loop, and stop for user approval before packing.

- [ ] **Step 4: Build assets and implement `<HomeHero>`**

Compose `PixelScene name="home"` with an animated character overlay. Keep `Start journey`, `Continue`, and `Secret base` as TanStack links. Keep the greeting in a semantic dialogue section. The character animation receives label `Anh welcomes visitors` only when it adds context; duplicate decorative portraits remain hidden.

- [ ] **Step 5: Run tests and visual checks**

Run:

```sh
pnpm assets:validate
pnpm assets:build
pnpm test -- src/components/features/home/home-hero.test.tsx
pnpm run build
```

Inspect desktop and 390x844; verify menu/dialogue do not obscure Anh and reduced motion shows the idle fallback.

- [ ] **Step 6: Commit**

```sh
git add assets-src public/assets src/generated src/components/features/home src/routes/index.tsx
git commit -m "feat: separate landing scene and character"
```

### Task 2: Register Responsive World Map and Secret Base Scenes

**Files:**
- Create: `assets-src/scenes/{world-map,secret-base}/*.scene.json`
- Create: `src/components/features/journey/world-map.tsx`
- Create: `src/components/features/discovery/secret-base-scene.tsx`
- Create: `src/components/features/journey/world-map.test.tsx`
- Create: `src/components/features/discovery/secret-base-scene.test.tsx`
- Modify: `src/routes/journey.tsx`
- Modify: `src/routes/secret-base.tsx`
- Generated: `public/assets/scenes/{world-map,secret-base}.{desktop,mobile}.png`

**Interfaces:**
- Consumes: existing approved `world-map-v2.png`, `secret-base-v2.png`, and `<PixelScene>`.
- Produces: registered responsive scene compositions without duplicating route/content text.

- [ ] **Step 1: Write failing route-marker and notes tests**

```tsx
it('keeps every learning region as a keyboard-accessible link', async () => {
  await renderWithRouter(<WorldMap />)
  expect(screen.getAllByRole('link', { name: /explore route/i })).toHaveLength(8)
})

it('keeps secret-base notes in the DOM', () => {
  render(<SecretBaseScene />)
  expect(screen.getByRole('heading', { name: /today's discovery/i })).toBeTruthy()
})
```

- [ ] **Step 2: Produce missing mobile variants only**

Use image editing through `scene-generation` to create coordinated mobile compositions. Preserve the approved environments; remove Anh from Secret Base only if the existing baked character prevents future animation. Do not regenerate the World Map's land topology because DOM marker positions depend on it.

- [ ] **Step 3: Implement feature components**

Move route composition into focused components. World markers remain typed `Link`s driven by `learningPath`; Secret Base notes remain semantic HTML using `--font-terminal`. Register variant-specific anchors in scene metadata.

- [ ] **Step 4: Verify and commit**

Run `pnpm test -- src/components/features/journey/world-map.test.tsx src/components/features/discovery/secret-base-scene.test.tsx && pnpm run build`.

```sh
git add assets-src public/assets src/generated src/components/features src/routes/journey.tsx src/routes/secret-base.tsx
git commit -m "feat: register responsive map and secret base"
```

### Task 3: Reimplement Route and Course Overview

**Files:**
- Create: `src/components/features/learning/course-overview.tsx`
- Create: `src/components/features/learning/course-overview.test.tsx`
- Create: `src/content/course-progress.ts`
- Modify: `src/routes/courses.index.tsx`
- Create: `assets-src/scenes/course-route/course-route.scene.json`
- Generated: `public/assets/scenes/course-route.{desktop,mobile}.png`

**Interfaces:**
- Consumes: category search parameter, course entries, `PixelScene`, contextual `idle` character.
- Produces: `<CourseOverview category entries progress />` with trainer list, progress, and reward panel.

- [ ] **Step 1: Write failing category/filter tests**

```tsx
it('shows only entries in the selected category and keeps real links', async () => {
  await renderWithRouter(<CourseOverview category="react" entries={fixtures} progress={{ completed: 2, total: 4 }} />)
  expect(screen.getAllByRole('link', { name: /begin lesson/i })).toHaveLength(2)
  expect(screen.getByText('2/4')).toBeTruthy()
})
```

- [ ] **Step 2: Generate the environment-only course-route pair**

Create a forest learning route with permanent paths, trees, sign structures without text, and a calm trainer-list region. Exclude characters, badge icons, progress UI, and labels. Review both variants before registration.

- [ ] **Step 3: Implement the overview**

Keep `src/routes/courses.index.tsx` thin: read typed search, select entries, and pass them to `CourseOverview`. Store only demonstrative static progress in `src/content/course-progress.ts`; do not imply real persisted user progress.

- [ ] **Step 4: Verify and commit**

Run `pnpm test -- src/components/features/learning/course-overview.test.tsx && pnpm run build` and inspect both breakpoints.

```sh
git add assets-src public/assets src/generated src/components/features/learning src/content/course-progress.ts src/routes/courses.index.tsx
git commit -m "feat: rebuild course route overview"
```

### Task 4: Reimplement Lesson and Markdown Content Presentation

**Files:**
- Create: `src/components/features/learning/lesson-layout.tsx`
- Create: `src/components/features/learning/lesson-layout.test.tsx`
- Modify: `src/routes/courses/$slug.tsx`
- Modify: `src/content/courses/*.md`
- Modify: `src/generated/sprite-manifest.ts`
- Generated: `public/assets/atlases/content.png`

**Interfaces:**
- Consumes: `<MarkdownContent>`, explicit directives, content atlas, `ContentEntry`.
- Produces: semantic lesson navigation, content body, trainer tips, exercises, and rewards.

- [ ] **Step 1: Write failing lesson tests**

```tsx
it('renders lesson navigation and explicit visual directives', async () => {
  await renderWithRouter(<LessonLayout entry={courseFixture} />)
  expect(screen.getByRole('navigation', { name: 'Lesson content' })).toBeTruthy()
  expect(screen.getByRole('note', { name: 'Trainer tip' })).toBeTruthy()
  expect(screen.getByRole('link', { name: /previous/i })).toBeTruthy()
  expect(screen.getByRole('link', { name: /next/i })).toBeTruthy()
})
```

- [ ] **Step 2: Generate the initial content-element families**

Use `content-element-generation` for `trainer-tip`, `note`, `warning`, `quest`, `exercise`, `reward`, `success`, `locked`, `current`, `code-example`, and `terminal`. Generate transparent elements without text, validate them, obtain user visual approval, and pack them mechanically.

- [ ] **Step 3: Add representative directives to course fixtures**

Use comment-component syntax from the spec. Every directive must improve instructional meaning; keep ordinary headings, paragraphs, lists, and code fences unchanged.

- [ ] **Step 4: Implement and verify**

Replace the hard-coded lesson list with data derived from ordered entries in the same category. Render previous/next typed links and preserve Highlight code rendering.

Run `pnpm test -- src/components/features/learning/lesson-layout.test.tsx src/components/features/markdown/markdown-content.test.tsx && pnpm run build`.

- [ ] **Step 5: Commit**

```sh
git add assets-src public/assets src/generated src/components/features/learning src/content/courses src/routes/courses
git commit -m "feat: rebuild markdown lesson experience"
```

### Task 5: Add Topic Mastery

**Files:**
- Create: `src/routes/courses/$slug.mastery.tsx`
- Create: `src/components/features/learning/topic-mastery.tsx`
- Create: `src/components/features/learning/topic-mastery.test.tsx`
- Create: `src/content/mastery-challenges.ts`
- Create: `assets-src/scenes/topic-mastery/topic-mastery.scene.json`
- Generated: `public/assets/scenes/topic-mastery.{desktop,mobile}.png`

**Interfaces:**
- Consumes: course slug, static challenge definitions, registered reward/badge sprites.
- Produces: `/courses/$slug/mastery` presentation route without persisted completion claims.

- [ ] **Step 1: Write a failing mastery test**

```tsx
it('presents challenges and rewards without claiming saved progress', () => {
  render(<TopicMastery mastery={masteryFixture} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(masteryFixture.challenges.length)
  expect(screen.getByText(masteryFixture.reward)).toBeTruthy()
  expect(screen.queryByText(/saved/i)).toBeNull()
})
```

- [ ] **Step 2: Generate the environment pair**

Create an original forest training clearing with a permanent challenge structure and empty leader/character anchors. Exclude characters, challenge labels, dialogue, badges, and scores.

- [ ] **Step 3: Implement route and component**

Validate `$slug` against existing content, return `notFound()` for missing lessons, and render challenges from `mastery-challenges.ts`. Use semantic lists and registered sprites; no forms or fake completion toggles.

- [ ] **Step 4: Verify and commit**

Run `pnpm generate-routes && pnpm test -- src/components/features/learning/topic-mastery.test.tsx && pnpm run build`.

```sh
git add assets-src public/assets src/generated src/content/mastery-challenges.ts src/components/features/learning src/routes src/routeTree.gen.ts
git commit -m "feat: add topic mastery presentation"
```

### Task 6: Migrate Guild Hall to Registered Scenes and Sprites

**Files:**
- Create: `src/components/features/guild/guild-hall.tsx`
- Create: `src/components/features/guild/guild-hall.test.tsx`
- Modify: `src/routes/guild-hall.tsx`
- Modify: `src/content/guild-profile.ts`
- Create: `assets-src/scenes/guild-hall/guild-hall.scene.json`
- Generated: `public/assets/scenes/guild-hall.{desktop,mobile}.png`

**Interfaces:**
- Consumes: existing approved professional copy, scene/sprite manifests.
- Produces: `<GuildHall profile />` without `BaseSprite` or confidential-project imagery.

- [ ] **Step 1: Write failing confidentiality and content tests**

```tsx
it('shows approved professional impact and confidentiality copy', () => {
  render(<GuildHall profile={guildProfile} />)
  expect(screen.getByText(/APA Score · 4\/5/i)).toBeTruthy()
  expect(screen.getByText(/5 Consecutive Years/i)).toBeTruthy()
  expect(screen.getByText(/internal projects.*not shared publicly/i)).toBeTruthy()
})
```

- [ ] **Step 2: Create/register the mobile scene variant**

Preserve the approved guild interior. If Anh remains baked into the existing desktop art, create a coordinated clean plate for both variants with the central Anh removed and permanent engineer NPCs retained only when they never animate. Use a separate Anh sprite at the registered character anchor.

- [ ] **Step 3: Implement and verify**

Move composition from the route to the feature component. Replace `BaseSprite` with typed registered sprites. Preserve qualitative stats and the approved achievement values exactly.

Run `pnpm test -- src/components/features/guild/guild-hall.test.tsx && pnpm run build`.

- [ ] **Step 4: Commit**

```sh
git add assets-src public/assets src/generated src/components/features/guild src/routes/guild-hall.tsx src/content/guild-profile.ts
git commit -m "feat: migrate guild hall asset composition"
```

### Task 7: Rebuild Badges and Journal Discovery

**Files:**
- Create: `src/components/features/discovery/badge-case.tsx`
- Create: `src/components/features/discovery/journal-list.tsx`
- Create: `src/components/features/discovery/discovery.test.tsx`
- Create: `src/content/badges.ts`
- Modify: `src/routes/badges.tsx`
- Modify: `src/routes/journal.tsx`
- Modify: `src/routes/journal/$slug.tsx`

**Interfaces:**
- Consumes: registered badge/content sprites and Markdown entries.
- Produces: accessible badge grid and journal list/detail using the shared renderer.

- [ ] **Step 1: Write failing discovery tests**

```tsx
it('exposes badge names and states as text', () => {
  render(<BadgeCase badges={badgeFixtures} />)
  expect(screen.getByText('Rookie Compass')).toBeTruthy()
  expect(screen.getByText('Locked')).toBeTruthy()
})

it('filters journal entries through typed links', async () => {
  await renderWithRouter(<JournalList entries={journalFixtures} activeTag="react" />)
  expect(screen.getAllByRole('article')).toHaveLength(1)
})
```

- [ ] **Step 2: Implement semantic discovery components**

Use sprites only for badge/icon decoration. Keep badge names, earned/locked states, dates, descriptions, tags, and read times as text. Journal detail renders `<MarkdownContent>` and permits the same explicit directives as lessons.

- [ ] **Step 3: Verify and commit**

Run `pnpm test -- src/components/features/discovery/discovery.test.tsx src/components/features/markdown/markdown-content.test.tsx && pnpm run build`.

```sh
git add src/components/features/discovery src/content/badges.ts src/routes/badges.tsx src/routes/journal.tsx src/routes/journal
git commit -m "feat: rebuild badges and journal discovery"
```

### Task 8: Add Search and Rebuild the 404 Surface

**Files:**
- Create: `src/routes/search.tsx`
- Create: `src/components/features/discovery/search-results.tsx`
- Create: `src/components/features/discovery/search-results.test.tsx`
- Create: `src/components/features/discovery/not-found.tsx`
- Create: `src/components/features/discovery/not-found.test.tsx`
- Create: `src/lib/search-content.ts`
- Create: `src/lib/search-content.test.ts`
- Modify: `src/routes/__root.tsx`
- Modify: `src/routeTree.gen.ts`
- Create: `assets-src/scenes/not-found/not-found.scene.json`
- Generated: `public/assets/scenes/not-found.{desktop,mobile}.png`

**Interfaces:**
- Consumes: local content index, typed `q` search parameter, `question` animation.
- Produces: `/search?q=...` and a semantic scene-backed not-found component.

- [ ] **Step 1: Write failing search and 404 tests**

```ts
it('searches title, description, tags, and category without a service', () => {
  expect(searchContent(entries, 'react hooks').map((entry) => entry.slug)).toEqual(['react-interfaces'])
})
```

```tsx
it('offers real recovery links from 404', async () => {
  await renderWithRouter(<NotFound />)
  expect(screen.getByRole('link', { name: /world map/i })).toBeTruthy()
  expect(screen.getByRole('link', { name: /home/i })).toBeTruthy()
})
```

- [ ] **Step 2: Implement deterministic local search**

Normalize query and indexed fields with `toLocaleLowerCase('en')`, split on whitespace, require every token to appear in the combined title/description/tags/category haystack, and preserve the existing content order. No TanStack Query or remote API is needed.

- [ ] **Step 3: Generate the environment-only 404 pair**

Create an original quiet forest-edge clearing with room for a dialogue panel and Anh/question animation. Exclude Anh, creatures, question bubbles, text, and buttons from the scene.

- [ ] **Step 4: Implement routes and verify**

Validate `q` as a string in the route. Move the root `NotFound` implementation to the focused component and use `PixelAnimation name="question"`.

Run `pnpm generate-routes && pnpm test -- src/lib/search-content.test.ts src/components/features/discovery/search-results.test.tsx src/components/features/discovery/not-found.test.tsx && pnpm run build`.

- [ ] **Step 5: Commit**

```sh
git add assets-src public/assets src/generated src/lib/search-content.ts src/lib/search-content.test.ts src/components/features/discovery src/routes src/routeTree.gen.ts
git commit -m "feat: add search and scene-backed 404"
```

### Task 9: Remove the Legacy Atlas and Complete Responsive QA

**Files:**
- Delete: `src/components/shared/base-sprite.tsx`
- Delete: `src/styles/base-sprites.css`
- Delete: `public/assets/sprites/base-sprites.png` after confirming no consumer remains
- Modify: `src/styles/index.css`
- Modify: `.agents/skills/anhpt-pixel-portfolio/references/sprite-atlas.md`
- Modify: `.agents/skills/anhpt-pixel-portfolio/references/verification.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: fully migrated generated manifests.
- Produces: one documented production asset path with no manual crop registry.

- [ ] **Step 1: Prove the legacy atlas is unused**

Run:

```sh
rg -n "BaseSprite|base-sprites|sprite-(anh|npc|rpg)" src
```

Expected: no runtime consumer. If any result remains, migrate it to `PixelSprite`/`PixelAnimation` before deleting files.

- [ ] **Step 2: Remove legacy assets and update documentation**

Document generation records, validation, packing, manifest consumption, Markdown directives, and the rule that image models never pack production atlases. Update README commands for `assets:validate`, `assets:build`, and `test`.

- [ ] **Step 3: Run the complete quality gate**

Run:

```sh
pnpm format
pnpm test
pnpm run build
pnpm run lint
npx -y react-doctor@latest . --verbose
git diff --check
```

Expected: all commands pass and React Doctor reports 100/100 or each diagnostic has a documented resolution.

- [ ] **Step 4: Perform visual and interaction verification**

At normal laptop width and 390x844 mobile, inspect Home, World Map, Courses, one lesson with every directive family, Topic Mastery, Guild Hall, Secret Base, Badges, Journal list/detail, Search, and 404. Verify no page overflow, no scene/sprite misalignment, readable content, keyboard focus, reduced motion, and no console/hydration errors.

- [ ] **Step 5: Commit**

```sh
git add -A
git commit -m "refactor: complete pixel scene reimplementation"
```

## Page Completion Gate

- Home and every newly generated major scene have approved desktop/mobile variants.
- No production scene contains Anh or meaningful UI text.
- All contextual character states are registered and use generated coordinates.
- Lessons and journal entries render explicit typed directives through React.
- Project Showcase and About have not been reintroduced.
- Search remains local and SSR-safe.
- All automated and visual quality gates pass.
