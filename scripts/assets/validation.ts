import sharp from 'sharp'
import { basename, extname } from 'node:path'
import type {
  NormalizedAnchor,
  SceneAnchor,
  SceneArea,
  SceneDimensions,
  SceneSource,
  SequenceSource,
} from './contracts'

const desktopSceneSize = { width: 1536, height: 1024 }
const mobileSceneSize = { width: 1024, height: 1280 }
const safeIdentifier = /^[a-z][a-z0-9-]*$/
const maximumSceneScale = 4

export async function validateScenePair(record: SceneSource): Promise<void> {
  validateIdentifier(record.name, 'scene name')
  validateSceneDimensions(
    record.name,
    'desktop',
    record.desktopDimensions,
    desktopSceneSize,
  )
  validateSceneDimensions(
    record.name,
    'mobile',
    record.mobileDimensions,
    mobileSceneSize,
  )
  validateSceneArea(record.name, 'focalArea.desktop', record.focalArea.desktop)
  validateSceneArea(record.name, 'focalArea.mobile', record.focalArea.mobile)

  for (const [safeZoneName, safeZone] of Object.entries(record.safeZones)) {
    validateIdentifier(record.name, 'safe zone name', safeZoneName)
    validateSceneArea(
      record.name,
      `safeZones.${safeZoneName}.desktop`,
      safeZone.desktop,
    )
    validateSceneArea(
      record.name,
      `safeZones.${safeZoneName}.mobile`,
      safeZone.mobile,
    )
  }

  for (const [anchorName, anchor] of Object.entries(record.anchors)) {
    validateIdentifier(record.name, 'anchor name', anchorName)
    validateSceneAnchor(
      record.name,
      `anchors.${anchorName}.desktop`,
      anchor.desktop,
    )
    validateSceneAnchor(
      record.name,
      `anchors.${anchorName}.mobile`,
      anchor.mobile,
    )
  }

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
  validateIdentifier(record.name, 'sequence name')
  validateNormalizedAnchor(record.name, 'sequence anchor', record.anchor)

  if (record.anchor.xPercent !== 50 || record.anchor.yPercent !== 100) {
    throw new Error(
      `${record.name}: sequence anchor must be bottom-center (50,100); got (${record.anchor.xPercent},${record.anchor.yPercent})`,
    )
  }

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

  for (const frame of record.frames) {
    validateNormalizedAnchor(
      record.name,
      `frame ${basename(frame.path)} anchor`,
      frame.anchor,
    )

    if (
      frame.anchor.xPercent !== record.anchor.xPercent ||
      frame.anchor.yPercent !== record.anchor.yPercent
    ) {
      throw new Error(
        `${record.name}: frame ${basename(frame.path)} anchor must equal sequence anchor (${record.anchor.xPercent},${record.anchor.yPercent}); got (${frame.anchor.xPercent},${frame.anchor.yPercent})`,
      )
    }
  }

  await Promise.all(
    record.frames.map((frame) => validateFrame(record.name, frame)),
  )
}

function validateIdentifier(
  recordName: string,
  label: string,
  value = recordName,
) {
  if (!safeIdentifier.test(value)) {
    throw new Error(
      `${recordName}: ${label} must match /^[a-z][a-z0-9-]*$/; got "${value}"`,
    )
  }
}

function validateSceneDimensions(
  name: string,
  variant: 'desktop' | 'mobile',
  dimensions: SceneDimensions,
  expectedDimensions: SceneDimensions,
) {
  if (
    dimensions.width !== expectedDimensions.width ||
    dimensions.height !== expectedDimensions.height
  ) {
    throw new Error(
      `${name}: ${variant} declared dimensions must be ${expectedDimensions.width}x${expectedDimensions.height}; got ${dimensions.width}x${dimensions.height}`,
    )
  }
}

function validateSceneArea(name: string, label: string, area: SceneArea) {
  validatePercentage(name, `${label}.xPercent`, area.xPercent)
  validatePercentage(name, `${label}.yPercent`, area.yPercent)
  validatePositivePercentage(name, `${label}.widthPercent`, area.widthPercent)
  validatePositivePercentage(name, `${label}.heightPercent`, area.heightPercent)

  if (
    area.xPercent + area.widthPercent > 100 ||
    area.yPercent + area.heightPercent > 100
  ) {
    throw new Error(`${name}: ${label} must stay within 0-100% bounds`)
  }
}

function validateSceneAnchor(name: string, label: string, anchor: SceneAnchor) {
  validateNormalizedAnchor(name, label, anchor)

  if (
    !Number.isFinite(anchor.scale) ||
    anchor.scale <= 0 ||
    anchor.scale > maximumSceneScale
  ) {
    throw new Error(
      `${name}: ${label}.scale must be finite and between 0 and ${maximumSceneScale}; got ${anchor.scale}`,
    )
  }
}

function validateNormalizedAnchor(
  name: string,
  label: string,
  anchor: NormalizedAnchor,
) {
  validatePercentage(name, `${label}.xPercent`, anchor.xPercent)
  validatePercentage(name, `${label}.yPercent`, anchor.yPercent)
}

function validatePercentage(name: string, label: string, value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(
      `${name}: ${label} must be finite and between 0 and 100; got ${value}`,
    )
  }
}

function validatePositivePercentage(
  name: string,
  label: string,
  value: number,
) {
  if (!Number.isFinite(value) || value <= 0 || value > 100) {
    throw new Error(
      `${name}: ${label} must be finite and greater than 0 up to 100; got ${value}`,
    )
  }
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
