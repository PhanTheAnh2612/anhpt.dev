# anhpt.dev Visual Asset System and Reimplementation Design

## Status

Approved direction, written for owner review before implementation planning.

## Objective

Reimplement anhpt.dev as an illustrated-scene hybrid: original pixel-RPG
background plates provide atmosphere, deterministic sprite atlases provide
contextual animation, and semantic React/HTML provides navigation, content,
and interaction. Markdown remains the source of truth for courses and journal
entries.

The system must let an agent generate future scenes and blog assets without
redesigning the visual language or baking characters and meaningful text into
page artwork.

## Approved Product Decisions

- Permanent scenery may remain painted into a scene background.
- Characters and objects that animate, react, or change state must be separate
  transparent assets.
- Anh is not user-controlled. Version one supports preset contextual
  animations only.
- Major scenes have coordinated desktop and mobile background variants rather
  than relying on one responsive crop.
- Markdown authors choose special visual elements explicitly through typed
  directives. The renderer does not infer presentation from ordinary prose.
- Meaningful text, navigation, scores, labels, and portfolio claims stay in the
  DOM, never only in raster art.
- The visual direction is an original emerald handheld-RPG style. It may evoke
  the era without copying protected characters, logos, locations, or exact
  interface artwork.

## Existing Technical Stack

The reimplementation retains the repository's current platform:

- TanStack Start and TanStack Router for SSR-first file routes.
- React 19 and strict TypeScript for composition and typed registries.
- Tailwind CSS v4 plus project CSS variables for responsive styling.
- TanStack Markdown and TanStack Highlight for local Markdown content.
- Vite and PNPM for development and builds.
- Cloudflare Workers for production SSR and static assets.

There is no application database, authentication layer, content API, or
client-side game engine in scope. Generated art is committed as static assets.

## Scope Decomposition

The work is divided into two implementation projects:

1. Build the visual skill suite, asset contracts, validators, atlas packer, and
   typed runtime components.
2. Reimplement the product surfaces using the approved visual pipeline.

The first project must be working before new page artwork is produced for the
second. This prevents regenerated pages from repeating the current mixed-layer
problem.

## Skill Architecture

### `anhpt-art-direction`

The shared source of truth for every visual-generation skill. It owns:

- palette tokens and contrast targets;
- outline weight, pixel density, shading, and lighting direction;
- Anh's immutable character identity and approved reference images;
- environment mood and composition rules;
- font roles;
- originality and prohibited-content rules;
- reference-image selection and precedence.

Other skills link to this material rather than copying it. Changes to the art
bible therefore affect all future generation coherently.

### `scene-generation`

Produces environment-only background pairs.

Required output per scene:

- `<scene>.desktop.png`, normalized to 1536x1024 (3:2);
- `<scene>.mobile.png`, normalized to 1024x1280 (4:5);
- `<scene>.scene.json`, recording variant dimensions, focal area, overlay safe
  zones, and recommended character anchors;
- a short generation record containing prompt, references, and review notes.

Rules:

- Permanent buildings, trees, terrain, furniture, shelving, and ambient decor
  may be baked in.
- Anh, NPCs, animated props, menus, labels, dialogue, and readable text are
  forbidden.
- Both variants depict the same location, time, palette, and lighting.
- Layout reserves calm regions for DOM overlays and sprite placement.
- The background remains useful when animations are disabled.

### `character-animation`

Maintains one logical Anh character library and creates named contextual
sequences. Initial states are:

- `idle`, `blink`, and `talk`;
- `think`, `question`, `point`, and `teach`;
- `code` and `read`;
- `celebrate`, `success`, and `error`;
- `run-loading`.

Generation occurs sequence by sequence. Every frame in a sequence uses the
same transparent canvas, bottom-center anchor, lighting, proportions, and
palette. Frames are reviewed individually before packing. The image model is
never asked to produce the production atlas or final coordinates.

The library is extensible: a later request may add a named sequence without
regenerating accepted frames.

### `content-element-generation`

Produces reusable transparent artwork for Markdown and course presentation.
The initial semantic registry contains:

- `trainer-tip`, `note`, `warning`, and `remember`;
- `quest`, `challenge`, `exercise`, and `quiz`;
- `reward`, `badge`, `success`, `locked`, and `current`;
- `code-example`, `terminal`, `architecture`, and `resource`;
- decorative dividers and compact topic icons.

These assets decorate typed React components. They do not contain headings,
body text, code, difficulty labels, or reward values.

### `asset-atlas-pipeline`

Validates and mechanically assembles accepted transparent assets. It does not
generate artwork.

The packer is a Node-based project script and uses Sharp as a development
dependency. It produces:

- `public/assets/atlases/character.png`;
- `public/assets/atlases/content.png`;
- `public/assets/atlases/world.png` when reusable world objects exist;
- generated JSON metadata containing atlas dimensions, frame rectangles,
  anchors, sequence order, duration, and loop behavior;
- generated TypeScript types and CSS custom properties used by runtime
  components.

The packer may place different sequences in differently sized rectangles, but
all frames within one animation sequence have identical dimensions and anchor
positions. Coordinates are generated and never edited manually.

### Revised `anhpt-pixel-portfolio`

Owns page composition. It consumes approved scene records, sprite names,
content directives, and shared UI components. It may request missing artwork
through the focused generation skills, but it may not create an unregistered
one-off visual system or bake page copy into an image.

The existing `sprite-generation` skill is retired after its useful character
identity constraints are migrated.

## Asset Source and Output Layout

```text
assets-src/
  art-direction/
  scenes/<scene>/<variant>/
  character/<sequence>/
  content/<element>/
  world/<object>/
  generation-records/

public/assets/
  scenes/<scene>.desktop.png
  scenes/<scene>.mobile.png
  atlases/character.png
  atlases/content.png
  atlases/world.png

src/generated/
  scene-manifest.ts
  sprite-manifest.ts
  sprite-atlases.css
```

Raw and intermediate generation outputs remain outside `public/`; only
approved production assets ship to browsers.

## Asset Validation Contract

Every generated asset passes automated and visual checks before registration.

### Scenes

- correct desktop/mobile aspect and minimum dimensions;
- opaque scene output with no accidental transparency;
- no characters, dynamic objects, UI, or readable generated text;
- matching identity and lighting across the pair;
- safe areas and focal points recorded in scene metadata;
- acceptable composition at laptop width and 390x844 mobile.

### Sprites

- PNG alpha channel is present;
- corners and declared transparent margins are actually transparent;
- no checkerboard, label, poster frame, halo, or neighboring asset bleed;
- sequence frames share dimensions and bottom-center anchor;
- silhouettes remain readable at intended CSS display sizes;
- no material character-identity or palette drift;
- animation is coherent when previewed at its declared frame duration.

Automated checks reject structural failures. Visual review remains mandatory
for style, identity, pose continuity, and composition.

## Runtime Scene Composition

A shared `PixelScene` component receives a scene name and renders a `<picture>`
using the mobile and desktop variants. Registered overlay slots use percentage
anchors from the scene manifest so placement adapts to each composition.

`PixelSprite` renders one registered frame. `PixelAnimation` renders a named
sequence using generated CSS step keyframes. Animations are CSS-driven and
SSR-safe; they do not introduce a canvas or game loop. With
`prefers-reduced-motion: reduce`, the component displays the sequence's
declared fallback frame.

Page UI and copy are layered as semantic siblings above the scene, not embedded
in it. Decorative scenery receives empty alternative text. Any page meaning is
provided by headings, prose, links, buttons, lists, and accessible status text.

## Markdown Directive Contract

TanStack Markdown remains the parser. The renderer moves from an HTML string
inserted through `dangerouslySetInnerHTML` to the React adapter so custom
components remain typed, SSR-safe, and semantic.

The implementation uses TanStack Markdown's comment-component extension. A
directive is explicit and remains valid plain Markdown source:

```md
<!-- ::start:trainer-tip pose="think" -->
Keep effects synchronized with external systems.
<!-- ::end:trainer-tip -->

<!-- ::start:quest difficulty="intermediate" reward="component-badge" -->
Refactor this component without changing its public API.
<!-- ::end:quest -->
```

A registry maps allowed directive names to React components and validates each
attribute against finite string unions. Unknown directives or attributes
produce an author-facing build error with file and line context. Arbitrary JSX,
script execution, and raw HTML are not enabled.

Standard Markdown stays visually calm. Directives are used only when they add
instructional meaning, not as decoration around every paragraph.

## Typography

- Press Start 2P: display titles, compact menus, and badge names.
- Pixelify Sans: lessons, journal articles, and dialogue.
- VT323: terminal-like areas and Secret Base notes.

The fonts are installed through the versioned `@fontsource/press-start-2p`,
`@fontsource/pixelify-sans`, and `@fontsource/vt323` packages. Vite emits their
font files with the application, so SSR does not depend on a third-party font
request. CSS variables expose display, content, and terminal families with
readable system fallbacks. Body copy retains a practical minimum size and line
height; the display face is not used for long paragraphs.

## Product Surface Mapping

The supplied twelve-screen overview is a composition reference. The current
approved information architecture is retained:

- Landing Page: environment-only coastal scene plus character animation and
  semantic start menu/dialogue.
- World Map: existing approved scene plus DOM route markers.
- Route/Course Overview: environment plate, contextual character, trainer list,
  progress, and reward UI.
- Lesson Page: semantic Markdown content and directive components with
  character/content sprites.
- Topic Mastery: challenge and reward presentation composed from registered
  assets.
- Guild Hall: professional journey surface replacing confidential project and
  dedicated About pages.
- Secret Base: existing approved scene retained unless a paired mobile variant
  is needed.
- Badges, Journal, Search, and 404: semantic page layouts using registered
  character, badge, content, and world sprites.

World Map and Secret Base are visual baselines. Home and content pages are
recomposed so Anh is no longer baked into their scene images.

## Failure Handling

- A missing scene variant fails manifest generation.
- A missing sprite name fails TypeScript compilation.
- A malformed content directive fails the content validation/build step.
- If an asset fails visual review, its generation record is retained but it is
  not registered or copied into `public/`.
- Pages always provide a static fallback frame and remain readable without
  animation or generated imagery.

## Testing and Verification

### Asset tooling

- Vitest is added as the Vite-compatible unit-test runner;
- unit tests for validation, packing, stable coordinates, and manifest output;
- fixture tests for opaque backgrounds, missing alpha, mismatched frame sizes,
  invalid anchors, and duplicate names;
- deterministic-output test: unchanged sources produce byte-stable metadata.

### Markdown

- parser and renderer tests for every directive;
- invalid name/attribute tests with actionable diagnostics;
- SSR tests proving directives render without client-only behavior;
- accessibility tests for headings, callout labels, links, and fallback text.

### Pages

- production Worker build and SSR verification;
- laptop and 390x844 visual checks;
- no document-level horizontal overflow;
- scene/sprite alignment checks for desktop and mobile variants;
- reduced-motion behavior;
- keyboard navigation and visible focus;
- no browser console or hydration errors.

Repository quality gates remain `pnpm run build`, `pnpm run lint`, formatting,
and React Doctor. Asset generation itself is not considered successful until
the resulting page composition is inspected.

## Out of Scope

- user-controlled movement, collision detection, canvas rendering, and a game
  loop;
- runtime image generation;
- user accounts, saved progress, or a content database;
- automatic visual-directive inference from prose;
- text embedded in generated scenes or sprites;
- regenerating approved World Map and Secret Base artwork without a specific
  composition need.

## Implementation Order

1. Establish the shared art bible and reference catalog.
2. Define schemas, source directories, validators, and deterministic atlas
   packing.
3. Build typed scene and sprite runtime components.
4. Add the Markdown extension, React renderer, and directive components.
5. Prove the workflow by separating Home into scene and character layers.
6. Reimplement course, lesson, topic-mastery, journal, search, badge, Guild
   Hall, and 404 surfaces incrementally.
7. Produce missing mobile variants and finish responsive/accessibility QA.
