import type { SceneManifestEntry } from '../../scripts/assets/generate-scenes'

export type { SceneManifestEntry } from '../../scripts/assets/generate-scenes'

export const sceneManifest = {} as const satisfies Record<
  string,
  SceneManifestEntry
>
