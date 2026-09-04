import { readdir, readFile } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  FrameSource,
  NormalizedAnchor,
  SceneArea,
  SceneAnchor,
  SceneDimensions,
  SceneSource,
  SceneVariants,
  SequenceSource,
} from './contracts'
import { validateScenePair, validateSequence } from './validation'

export async function validateAssetCatalog(assetsRoot: string): Promise<void> {
  const recordPaths = await findRegisteredRecordPaths(assetsRoot)
  const sceneRecordPaths = new Map<string, string>()
  const sequenceRecordPaths = new Map<string, string>()

  for (const recordPath of recordPaths) {
    const record = await loadJsonRecord(recordPath)
    const recordDirectory = resolve(recordPath, '..')

    if (recordPath.endsWith('.scene.json')) {
      const scene = toSceneSource(record, recordPath, recordDirectory)
      const conflictingRecordPath = sceneRecordPaths.get(scene.name)

      if (conflictingRecordPath) {
        throw new Error(
          `${recordPath}: duplicate scene name "${scene.name}" conflicts with ${conflictingRecordPath}`,
        )
      }

      sceneRecordPaths.set(scene.name, recordPath)
      await validateRegisteredRecord(recordPath, () => validateScenePair(scene))
    } else {
      const sequence = toSequenceSource(record, recordPath, recordDirectory)
      const conflictingRecordPath = sequenceRecordPaths.get(sequence.name)

      if (conflictingRecordPath) {
        throw new Error(
          `${recordPath}: duplicate sequence name "${sequence.name}" conflicts with ${conflictingRecordPath}`,
        )
      }

      sequenceRecordPaths.set(sequence.name, recordPath)
      await validateRegisteredRecord(recordPath, () =>
        validateSequence(sequence),
      )
    }
  }
}

async function validateRegisteredRecord(
  recordPath: string,
  validate: () => Promise<void>,
): Promise<void> {
  try {
    await validate()
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`${recordPath}: ${detail}`, { cause: error })
  }
}

async function findRegisteredRecordPaths(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const paths: string[] = []

  for (const entry of entries) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      paths.push(...(await findRegisteredRecordPaths(path)))
    } else if (entry.isFile() && isRegisteredRecordPath(entry.name)) {
      paths.push(path)
    }
  }

  return paths.sort()
}

function isRegisteredRecordPath(name: string) {
  return name.endsWith('.scene.json') || name === 'sequence.json'
}

async function loadJsonRecord(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`${path}: invalid JSON record; ${detail}`)
  }
}

function toSceneSource(
  value: unknown,
  recordPath: string,
  recordDirectory: string,
): SceneSource {
  if (!isRecord(value) || !isSceneSource(value)) {
    throw new Error(
      `${recordPath}: scene record requires desktop, mobile, and anchors; also declared dimensions, focalArea, and safeZones`,
    )
  }

  return {
    ...value,
    desktop: resolveAssetPath(recordDirectory, value.desktop),
    mobile: resolveAssetPath(recordDirectory, value.mobile),
  }
}

function toSequenceSource(
  value: unknown,
  recordPath: string,
  recordDirectory: string,
): SequenceSource {
  if (!isRecord(value) || !isSequenceSource(value)) {
    throw new Error(
      `${recordPath}: sequence record requires name, durationMs, loop, fallback, anchor, and frames with frame anchors`,
    )
  }

  return {
    ...value,
    frames: value.frames.map((frame) => ({
      ...frame,
      path: resolveAssetPath(recordDirectory, frame.path),
    })),
  }
}

function resolveAssetPath(recordDirectory: string, assetPath: string) {
  return isAbsolute(assetPath) ? assetPath : resolve(recordDirectory, assetPath)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSceneSource(value: Record<string, unknown>): value is SceneSource {
  return (
    typeof value.name === 'string' &&
    typeof value.desktop === 'string' &&
    typeof value.mobile === 'string' &&
    isSceneDimensions(value.desktopDimensions) &&
    isSceneDimensions(value.mobileDimensions) &&
    isSceneVariants(value.focalArea, isSceneArea) &&
    isRecord(value.safeZones) &&
    Object.values(value.safeZones).every((safeZone) =>
      isSceneVariants(safeZone, isSceneArea),
    ) &&
    isRecord(value.anchors) &&
    Object.values(value.anchors).every(isSceneAnchorPair)
  )
}

function isSceneAnchorPair(value: unknown): value is {
  desktop: SceneAnchor
  mobile: SceneAnchor
} {
  return (
    isRecord(value) &&
    isSceneAnchor(value.desktop) &&
    isSceneAnchor(value.mobile)
  )
}

function isSceneDimensions(value: unknown): value is SceneDimensions {
  return (
    isRecord(value) &&
    typeof value.width === 'number' &&
    typeof value.height === 'number'
  )
}

function isSceneArea(value: unknown): value is SceneArea {
  return (
    isRecord(value) &&
    typeof value.xPercent === 'number' &&
    typeof value.yPercent === 'number' &&
    typeof value.widthPercent === 'number' &&
    typeof value.heightPercent === 'number'
  )
}

function isSceneVariants<T>(
  value: unknown,
  isVariant: (candidate: unknown) => candidate is T,
): value is SceneVariants<T> {
  return isRecord(value) && isVariant(value.desktop) && isVariant(value.mobile)
}

function isSceneAnchor(value: unknown): value is SceneAnchor {
  return (
    isRecord(value) &&
    typeof value.xPercent === 'number' &&
    typeof value.yPercent === 'number' &&
    typeof value.scale === 'number'
  )
}

function isSequenceSource(
  value: Record<string, unknown>,
): value is SequenceSource {
  return (
    typeof value.name === 'string' &&
    typeof value.durationMs === 'number' &&
    typeof value.loop === 'boolean' &&
    typeof value.fallback === 'number' &&
    isNormalizedAnchor(value.anchor) &&
    Array.isArray(value.frames) &&
    value.frames.every(isFrameSource)
  )
}

function isFrameSource(value: unknown): value is FrameSource {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number' &&
    isNormalizedAnchor(value.anchor)
  )
}

function isNormalizedAnchor(value: unknown): value is NormalizedAnchor {
  return (
    isRecord(value) &&
    typeof value.xPercent === 'number' &&
    typeof value.yPercent === 'number'
  )
}

const currentFile = fileURLToPath(import.meta.url)

if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  validateAssetCatalog(resolve(process.cwd(), 'assets-src')).catch(
    (error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error)
      console.error(detail)
      process.exitCode = 1
    },
  )
}
