import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig as resolvePrettierConfig } from 'prettier'
import sharp from 'sharp'
import type { SequenceSource } from './contracts'

export type SpriteAtlasName = 'character' | 'content' | 'world'

export type SpriteFrame = {
  x: number
  y: number
  width: number
  height: number
}

export type SpriteSequence = {
  atlas: SpriteAtlasName
  durationMs: number
  loop: boolean
  fallback: number
  frames: SpriteFrame[]
}

export type SpriteAtlasManifest = {
  name: SpriteAtlasName
  width: number
  height: number
  sequences: Record<string, SpriteSequence>
}

export async function packAtlas(
  atlasName: SpriteAtlasName,
  sequences: SequenceSource[],
  outputDirectory: string,
): Promise<SpriteAtlasManifest> {
  const rows = sequences.map((sequence) => ({
    sequence,
    height: sequence.frames[0]?.height ?? 0,
    width: sequence.frames.reduce((total, frame) => total + frame.width, 0),
  }))
  const width = Math.max(1, ...rows.map((row) => row.width))
  const height = Math.max(
    1,
    rows.reduce((total, row) => total + row.height, 0),
  )
  const composites: Parameters<ReturnType<typeof sharp>['composite']>[0] = []
  const manifest: SpriteAtlasManifest = {
    name: atlasName,
    width,
    height,
    sequences: {},
  }
  let y = 0

  for (const row of rows) {
    let x = 0
    const frames: SpriteFrame[] = []

    for (const frame of row.sequence.frames) {
      composites.push({ input: frame.path, left: x, top: y })
      frames.push({ x, y, width: frame.width, height: frame.height })
      x += frame.width
    }

    manifest.sequences[row.sequence.name] = {
      atlas: atlasName,
      durationMs: row.sequence.durationMs,
      loop: row.sequence.loop,
      fallback: row.sequence.fallback,
      frames,
    }
    y += row.height
  }

  await mkdir(outputDirectory, { recursive: true })
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(join(outputDirectory, `${atlasName}.png`))

  return manifest
}

async function loadSequences(directory: string): Promise<SequenceSource[]> {
  const recordPaths = await findSequenceRecordPaths(directory)

  return Promise.all(
    recordPaths.map(async (recordPath) => {
      const record = JSON.parse(await readFile(recordPath, 'utf8')) as Omit<
        SequenceSource,
        'frames'
      > & {
        frames: Array<
          Omit<SequenceSource['frames'][number], 'path'> & { path: string }
        >
      }
      const recordDirectory = resolve(recordPath, '..')

      return {
        ...record,
        frames: record.frames.map((frame) => ({
          ...frame,
          path: resolve(recordDirectory, frame.path),
        })),
      }
    }),
  )
}

async function findSequenceRecordPaths(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const paths: string[] = []

  for (const entry of entries) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      paths.push(...(await findSequenceRecordPaths(path)))
    } else if (entry.isFile() && entry.name === 'sequence.json') {
      paths.push(path)
    }
  }

  return paths.sort()
}

function spriteManifestSource(manifests: SpriteAtlasManifest[]) {
  const sequences = Object.fromEntries(
    manifests.flatMap((manifest) => Object.entries(manifest.sequences)),
  )

  return [
    "import type { SpriteSequence } from '../../scripts/assets/pack-atlases'",
    '',
    `export const spriteManifest = ${JSON.stringify(sequences, null, 2)} as const satisfies Record<string, SpriteSequence>`,
    '',
  ].join('\n')
}

function spriteCssSource(manifests: SpriteAtlasManifest[]) {
  const sequences = manifests.flatMap((manifest) =>
    Object.entries(manifest.sequences).map(([name, sequence]) => ({
      name,
      sequence,
    })),
  )

  return [
    ...sequences.flatMap(({ name, sequence }) => sequenceCss(name, sequence)),
    ...reducedMotionCss(sequences),
    '',
  ].join('\n')
}

function sequenceCss(name: string, sequence: SpriteSequence) {
  const [firstFrame] = sequence.frames
  const animation = sequence.loop ? 'infinite' : '1 forwards'

  return [
    `.pixel-animation--${name} {`,
    `  width: ${firstFrame.width}px;`,
    `  height: ${firstFrame.height}px;`,
    `  background-image: url('/assets/atlases/${sequence.atlas}.png');`,
    '  background-repeat: no-repeat;',
    '  image-rendering: pixelated;',
    `  animation: pixel-animation-${name} ${sequence.durationMs}ms steps(1, end) ${animation};`,
    '}',
    '',
    `@keyframes pixel-animation-${name} {`,
    ...sequence.frames.flatMap((frame, index) => [
      `  ${(index / sequence.frames.length) * 100}% {`,
      `    background-position: ${backgroundPosition(frame)};`,
      '  }',
    ]),
    '  100% {',
    `    background-position: ${backgroundPosition(firstFrame)};`,
    '  }',
    '}',
    '',
  ]
}

function reducedMotionCss(
  sequences: Array<{ name: string; sequence: SpriteSequence }>,
) {
  const rules = sequences.flatMap(({ name, sequence }) => {
    const frame = sequence.frames[sequence.fallback]

    return [
      `  .pixel-animation--${name} {`,
      '    animation: none;',
      `    background-position: ${backgroundPosition(frame)};`,
      '  }',
    ]
  })

  return rules.length === 0
    ? []
    : ['@media (prefers-reduced-motion: reduce) {', ...rules, '}', '']
}

function backgroundPosition(frame: SpriteFrame) {
  return `${-frame.x}px ${-frame.y}px`
}

async function buildAtlases() {
  const root = resolve(process.cwd())
  const atlasNames: SpriteAtlasName[] = ['character', 'content', 'world']
  const outputDirectory = resolve(root, 'public/assets/atlases')
  const manifests = await Promise.all(
    atlasNames.map(async (atlasName) =>
      packAtlas(
        atlasName,
        await loadSequences(resolve(root, 'assets-src', atlasName)),
        outputDirectory,
      ),
    ),
  )
  const generatedDirectory = resolve(root, 'src/generated')
  await mkdir(generatedDirectory, { recursive: true })
  const manifestPath = resolve(generatedDirectory, 'sprite-manifest.ts')
  const cssPath = resolve(generatedDirectory, 'sprite-atlases.css')
  await writeFile(
    manifestPath,
    await format(spriteManifestSource(manifests), {
      ...(await resolvePrettierConfig(manifestPath)),
      filepath: manifestPath,
    }),
  )
  await writeFile(
    cssPath,
    await format(spriteCssSource(manifests), {
      ...(await resolvePrettierConfig(cssPath)),
      filepath: cssPath,
    }),
  )
}

const currentFile = fileURLToPath(import.meta.url)

if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  buildAtlases().catch((error: unknown) => {
    const detail = error instanceof Error ? error.message : String(error)
    console.error(detail)
    process.exitCode = 1
  })
}
