import { readdir, readFile } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  FrameSource,
  SceneAnchor,
  SceneSource,
  SequenceSource,
} from './contracts'
import { validateScenePair, validateSequence } from './validation'

export async function validateAssetCatalog(assetsRoot: string): Promise<void> {
  const recordPaths = await findRegisteredRecordPaths(assetsRoot)

  for (const recordPath of recordPaths) {
    const record = await loadJsonRecord(recordPath)
    const recordDirectory = resolve(recordPath, '..')

    if (recordPath.endsWith('.scene.json')) {
      await validateScenePair(
        toSceneSource(record, recordPath, recordDirectory),
      )
    } else {
      await validateSequence(
        toSequenceSource(record, recordPath, recordDirectory),
      )
    }
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
      `${recordPath.split(/[\\/]/).at(-1)}: scene record requires desktop, mobile, and anchors`,
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
      `${recordPath.split(/[\\/]/).at(-1)}: sequence record requires name, durationMs, loop, fallback, and frames`,
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
    Array.isArray(value.frames) &&
    value.frames.every(isFrameSource)
  )
}

function isFrameSource(value: unknown): value is FrameSource {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number'
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
