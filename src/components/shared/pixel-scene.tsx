import type { CSSProperties, ReactNode } from 'react'
import { sceneManifest } from '../../generated/scene-manifest'
import type { SceneManifestEntry } from '../../generated/scene-manifest'

type ManifestName = keyof typeof sceneManifest
type SceneManifest = typeof sceneManifest

const sceneManifestEntries: Readonly<
  Partial<Record<string, SceneManifestEntry>>
> = sceneManifest

export type SceneName = [ManifestName] extends [never] ? string : ManifestName

export type SceneAnchorName<TName extends SceneName> =
  TName extends ManifestName
    ? Extract<keyof SceneManifest[TName]['anchors'], string>
    : string

export type PixelSceneProps<TName extends SceneName> = {
  className?: string
  name: TName
  overlays?: Partial<Record<SceneAnchorName<TName>, ReactNode>>
}

export function PixelScene<TName extends SceneName>({
  className = '',
  name,
  overlays = {},
}: PixelSceneProps<TName>) {
  const scene = Object.hasOwn(sceneManifestEntries, name)
    ? sceneManifestEntries[name]
    : undefined

  if (!scene) {
    throw new RangeError(`Scene "${name}" is not registered.`)
  }

  return (
    <figure className={`pixel-scene ${className}`.trim()}>
      <picture className="pixel-scene__picture">
        <source media="(max-width: 560px)" srcSet={scene.mobile.src} />
        <img alt="" role="img" src={scene.desktop.src} />
      </picture>
      {Object.entries(overlays).flatMap(([anchorName, overlay]) => {
        if (
          overlay === undefined ||
          !Object.hasOwn(scene.anchors, anchorName)
        ) {
          return []
        }

        const anchor = scene.anchors[anchorName]
        const style = {
          '--anchor-mobile-scale': `${anchor.mobile.scale}`,
          '--anchor-mobile-x': `${anchor.mobile.xPercent}%`,
          '--anchor-mobile-y': `${anchor.mobile.yPercent}%`,
          '--anchor-scale': `${anchor.desktop.scale}`,
          '--anchor-x': `${anchor.desktop.xPercent}%`,
          '--anchor-y': `${anchor.desktop.yPercent}%`,
        } as CSSProperties

        return (
          <div
            className="pixel-scene__overlay"
            data-anchor={anchorName}
            key={anchorName}
            style={style}
          >
            {overlay}
          </div>
        )
      })}
    </figure>
  )
}
