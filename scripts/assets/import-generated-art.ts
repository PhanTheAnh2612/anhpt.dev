/** Mechanical normalization of reviewed raster sources; never draws new artwork. */
import { copyFile, mkdir } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import sharp from 'sharp'

const transparent = { r: 0, g: 0, b: 0, alpha: 0 }

async function normalizeSprite(
  source: string,
  output: string,
  mode: string,
  width: number,
  height: number,
) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: sourceWidth, height: sourceHeight } = info
  const total = sourceWidth * sourceHeight
  const background = new Uint8Array(total)
  const neutral = (i: number) => {
    const [r, g, b] = data.subarray(i * 4, i * 4 + 3)
    return Math.min(r, g, b) > 205 && Math.max(r, g, b) - Math.min(r, g, b) < 35
  }
  if (mode === 'magenta') {
    for (let i = 0; i < total; i++) {
      const [r, g, b] = data.subarray(i * 4, i * 4 + 3)
      // Include dark magenta fringe pixels without erasing neutral outlines or red clothes.
      background[i] =
        r > g * 1.5 && b > g * 1.5 && b > r * 0.55 && r + b > 24 ? 1 : 0
    }
  } else {
    // Flood only boundary-connected light-neutral pixels: enclosed white clothes survive.
    const queue: number[] = []
    const visit = (i: number) => {
      if (!background[i] && neutral(i)) {
        background[i] = 1
        queue.push(i)
      }
    }
    for (let x = 0; x < sourceWidth; x++) {
      visit(x)
      visit((sourceHeight - 1) * sourceWidth + x)
    }
    for (let y = 0; y < sourceHeight; y++) {
      visit(y * sourceWidth)
      visit(y * sourceWidth + sourceWidth - 1)
    }
    // The flood-fill appends neighbors while iterating, so this cannot be a for-of loop.
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let j = 0; j < queue.length; j++) {
      const i = queue[j],
        x = i % sourceWidth,
        y = Math.floor(i / sourceWidth)
      if (x) visit(i - 1)
      if (x + 1 < sourceWidth) visit(i + 1)
      if (y) visit(i - sourceWidth)
      if (y + 1 < sourceHeight) visit(i + sourceWidth)
    }
  }
  let minX = sourceWidth,
    minY = sourceHeight,
    maxX = -1,
    maxY = -1
  for (let i = 0; i < total; i++) {
    data[i * 4 + 3] = background[i] || data[i * 4 + 3] < 128 ? 0 : 255
    if (!data[i * 4 + 3]) {
      data[i * 4] = 0
      data[i * 4 + 1] = 0
      data[i * 4 + 2] = 0
      continue
    }
    const x = i % sourceWidth,
      y = Math.floor(i / sourceWidth)
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  if (maxX < minX) throw new Error(`No foreground in ${source}`)
  const crop = {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
  const scale = Math.min((width - 4) / crop.width, (height - 4) / crop.height)
  const resizedWidth = Math.max(1, Math.round(crop.width * scale))
  const resizedHeight = Math.max(1, Math.round(crop.height * scale))
  const normalized = await sharp(data, {
    raw: { width: sourceWidth, height: sourceHeight, channels: 4 },
  })
    .extract(crop)
    .resize(resizedWidth, resizedHeight, { kernel: 'nearest', fit: 'fill' })
    .png()
    .toBuffer()
  await mkdir(dirname(output), { recursive: true })
  await sharp({
    create: { width, height, channels: 4, background: transparent },
  })
    .composite([
      {
        input: normalized,
        left: Math.floor((width - resizedWidth) / 2),
        top: height - 2 - resizedHeight,
      },
    ])
    .png()
    .toFile(output)
  console.log(
    `${output}: foreground ${JSON.stringify(crop)}, normalized ${resizedWidth}x${resizedHeight}, bottom margin 2`,
  )
}

const [mode, ...args] = process.argv.slice(2)
if (mode === 'sprite') {
  const [source, output, mask = 'magenta', width = '64', height = '96'] = args
  await normalizeSprite(
    resolve(source),
    resolve(output),
    mask,
    Number(width),
    Number(height),
  )
} else if (mode === 'scene') {
  const [source, output, width, height] = args
  await mkdir(dirname(resolve(output)), { recursive: true })
  await sharp(resolve(source))
    .removeAlpha()
    .resize(Number(width), Number(height), { kernel: 'nearest', fit: 'fill' })
    .png()
    .toFile(resolve(output))
} else if (mode === 'scene-cover') {
  const [source, output, width, height, position = 'centre'] = args
  await mkdir(dirname(resolve(output)), { recursive: true })
  await sharp(resolve(source))
    .removeAlpha()
    .resize(Number(width), Number(height), {
      kernel: 'nearest',
      fit: 'cover',
      position,
    })
    .png()
    .toFile(resolve(output))
} else if (mode === 'map-mobile') {
  const [source, output] = args
  const original = await sharp(resolve(source))
    .removeAlpha()
    .resize(1024, 683, { kernel: 'nearest', fit: 'fill' })
    .png()
    .toBuffer()
  await mkdir(dirname(resolve(output)), { recursive: true })
  await sharp({
    create: { width: 1024, height: 1280, channels: 3, background: '#07352d' },
  })
    .composite([{ input: original, left: 0, top: 298 }])
    .png()
    .toFile(resolve(output))
} else if (mode === 'crop') {
  const [source, output, x, y, width, height] = args
  await mkdir(dirname(resolve(output)), { recursive: true })
  await sharp(resolve(source))
    .extract({
      left: Number(x),
      top: Number(y),
      width: Number(width),
      height: Number(height),
    })
    .png()
    .toFile(resolve(output))
} else if (mode === 'content') {
  // Rectangles are reviewed expansions of the named base-sprites.css cells.
  const crops = [
    ['note', 387, 582, 40, 37],
    ['warning', 1342, 780, 57, 52],
    ['remember', 1180, 610, 44, 46],
    ['quest', 445, 518, 42, 42],
    ['reward', 686, 582, 44, 39],
    ['badge', 629, 516, 38, 42],
    ['success', 1294, 617, 46, 42],
    ['locked', 967, 520, 49, 58],
    ['current', 387, 520, 40, 38],
    ['terminal', 387, 648, 40, 35],
    ['architecture', 625, 646, 42, 39],
    ['resource', 507, 517, 38, 41],
  ] as const
  const cropDirectory = resolve('assets-src/generation-records/content-crops')
  await mkdir(cropDirectory, { recursive: true })
  for (const [name, left, top, width, height] of crops) {
    const crop = resolve(cropDirectory, `${name}.png`)
    await sharp(resolve('assets-src/generation-records/base-sprites.png'))
      .extract({ left, top, width, height })
      .png()
      .toFile(crop)
    await normalizeSprite(
      crop,
      resolve(`assets-src/content/content-${name}/icon.png`),
      'neutral',
      32,
      32,
    )
  }
} else if (mode === 'preserve') {
  const [source, directory] = args
  await mkdir(resolve(directory), { recursive: true })
  await copyFile(resolve(source), resolve(directory, basename(source)))
} else {
  throw new Error(
    'Use sprite <source> <output> [magenta|neutral] [width] [height], scene <source> <output> <width> <height>, scene-cover <source> <output> <width> <height> [position], map-mobile <source> <output>, crop <source> <output> <x> <y> <w> <h>, preserve <source> <directory>',
  )
}
