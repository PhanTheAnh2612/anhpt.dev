export type NormalizedAnchor = { xPercent: number; yPercent: number }

export type SceneAnchor = NormalizedAnchor & { scale: number }

export type SceneDimensions = { width: number; height: number }

export type SceneArea = {
  xPercent: number
  yPercent: number
  widthPercent: number
  heightPercent: number
}

export type SceneVariants<T> = { desktop: T; mobile: T }

export type SceneSource = {
  name: string
  desktop: string
  mobile: string
  desktopDimensions: SceneDimensions
  mobileDimensions: SceneDimensions
  focalArea: SceneVariants<SceneArea>
  safeZones: Record<string, SceneVariants<SceneArea>>
  anchors: Record<string, SceneVariants<SceneAnchor>>
}

export type FrameSource = {
  path: string
  width: number
  height: number
  anchor: NormalizedAnchor
}

export type SequenceSource = {
  name: string
  durationMs: number
  loop: boolean
  fallback: number
  anchor: NormalizedAnchor
  frames: FrameSource[]
}
