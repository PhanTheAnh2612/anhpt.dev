import sharp from 'sharp'
import { basename, extname } from 'node:path'
import type { SceneSource, SequenceSource } from './contracts'

const desktopSceneSize = { width: 1536, height: 1024 }
const mobileSceneSize = { width: 1024, height: 1280 }

export async function validateScenePair(record: SceneSource): Promise<void> {
  await validateSceneVariant(
    record.name,
    'desktop',
    record.desktop,
    desktopSceneSize,
  )
  await validateSceneVariant(
    record.name,
    'mobile',
    record.mobile,
    mobileSceneSize,
  )
}

export async function validateSequence(record: SequenceSource): Promise<void> {
  if (record.durationMs <= 0) {
    throw new Error(
      `${record.name}: duration must be positive; got ${record.durationMs}`,
    )
  }

  if (record.frames.length < 2) {
    throw new Error(
      `${record.name}: animated sequences require at least two frames; got ${record.frames.length}`,
    )
  }

  if (
    !Number.isInteger(record.fallback) ||
    record.fallback < 0 ||
    record.fallback >= record.frames.length
  ) {
    throw new Error(
      `${record.name}: fallback index must be between 0 and ${record.frames.length - 1}; got ${record.fallback}`,
    )
  }

  const [firstFrame, ...remainingFrames] = record.frames

  for (const frame of remainingFrames) {
    if (
      frame.width !== firstFrame.width ||
      frame.height !== firstFrame.height
    ) {
      throw new Error(
        `${record.name}: frames must have the same dimensions; got ${frame.width}x${frame.height}`,
      )
    }
  }

  await Promise.all(
    record.frames.map((frame) => validateFrame(record.name, frame)),
  )
}

async function validateSceneVariant(
  name: string,
  variant: 'desktop' | 'mobile',
  path: string,
  expectedSize: { width: number; height: number },
) {
  const metadata = await sharp(path).metadata()

  if (
    metadata.width !== expectedSize.width ||
    metadata.height !== expectedSize.height
  ) {
    throw new Error(
      `${name}: ${variant} scene must be ${expectedSize.width}x${expectedSize.height}; got ${metadata.width}x${metadata.height}`,
    )
  }

  if (metadata.channels === 4) {
    const stats = await sharp(path).ensureAlpha().stats()
    const alphaMinimum = stats.channels[3]?.min

    if (alphaMinimum !== 255) {
      throw new Error(
        `${name}: ${variant} scene alpha minimum must be 255; got ${alphaMinimum}`,
      )
    }
  }
}

async function validateFrame(
  sequenceName: string,
  frame: SequenceSource['frames'][number],
) {
  const fileName = basename(frame.path)

  if (extname(frame.path).toLowerCase() !== '.png') {
    throw new Error(`${sequenceName}: frame must be a PNG; got ${fileName}`)
  }

  const metadata = await sharp(frame.path).metadata()

  if (metadata.format !== 'png') {
    throw new Error(`${sequenceName}: frame must be a PNG; got ${fileName}`)
  }

  if (!metadata.hasAlpha) {
    throw new Error(
      `${sequenceName}: frame ${fileName} must include an alpha channel; got ${metadata.channels}`,
    )
  }

  if (metadata.width !== frame.width || metadata.height !== frame.height) {
    throw new Error(
      `${sequenceName}: frame ${fileName} must be ${frame.width}x${frame.height}; got ${metadata.width}x${metadata.height}`,
    )
  }

  const { data, info } = await sharp(frame.path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  if (!hasTransparentMargin(data, info.width, info.height, info.channels)) {
    throw new Error(
      `${sequenceName}: frame ${fileName} must have a transparent margin`,
    )
  }
}

function hasTransparentMargin(
  pixels: Buffer,
  width: number,
  height: number,
  channels: number,
) {
  const alphaOffset = channels - 1
  const alphaAt = (x: number, y: number) =>
    pixels[(y * width + x) * channels + alphaOffset]

  for (let x = 0; x < width; x += 1) {
    if (alphaAt(x, 0) !== 0 || alphaAt(x, height - 1) !== 0) return false
  }

  for (let y = 0; y < height; y += 1) {
    if (alphaAt(0, y) !== 0 || alphaAt(width - 1, y) !== 0) return false
  }

  return true
}
