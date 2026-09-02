import type { SceneSource } from '../../scripts/assets/contracts'

export type SceneManifestEntry = {
  desktop: { src: string }
  mobile: { src: string }
  anchors: SceneSource['anchors']
}

export const sceneManifest = {} as const satisfies Record<
  string,
  SceneManifestEntry
>
