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
