import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, describe, expect, it } from 'vitest'
import { validateAssetCatalog } from './validate-all'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, {
        force: true,
        maxRetries: 5,
        recursive: true,
        retryDelay: 100,
      }),
    ),
  )
})

async function createCatalogDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'anhpt-assets-'))
  temporaryDirectories.push(directory)
  return directory
}

async function createValidSequenceRecord(directory: string, name: string) {
  await mkdir(directory, { recursive: true })
  const frames = ['first.png', 'second.png']
  await Promise.all(
    frames.map((frame) =>
      sharp({
        create: {
          width: 64,
          height: 96,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toFile(join(directory, frame)),
    ),
  )
  const recordPath = join(directory, 'sequence.json')
  await writeFile(
    recordPath,
    JSON.stringify({
      name,
      durationMs: 600,
      loop: true,
      fallback: 0,
      anchor: { xPercent: 50, yPercent: 100 },
      frames: frames.map((path) => ({
        path,
        width: 64,
        height: 96,
        anchor: { xPercent: 50, yPercent: 100 },
      })),
    }),
  )
  return recordPath
}

async function createValidSceneRecord(
  directory: string,
  name: string,
  overrides: Record<string, unknown> = {},
) {
  await mkdir(directory, { recursive: true })
  const desktop = join(directory, 'desktop.png')
  const mobile = join(directory, 'mobile.png')
  await sharp({
    create: { width: 1536, height: 1024, channels: 3, background: '#061f1b' },
  })
    .png()
    .toFile(desktop)
  await sharp({
    create: { width: 1024, height: 1280, channels: 3, background: '#061f1b' },
  })
    .png()
    .toFile(mobile)

  const recordPath = join(directory, `${name}.scene.json`)
  await writeFile(
    recordPath,
    JSON.stringify({
      name,
      desktop: 'desktop.png',
      mobile: 'mobile.png',
      desktopDimensions: { width: 1536, height: 1024 },
      mobileDimensions: { width: 1024, height: 1280 },
      focalArea: {
        desktop: {
          xPercent: 25,
          yPercent: 20,
          widthPercent: 50,
          heightPercent: 60,
        },
        mobile: {
          xPercent: 10,
          yPercent: 20,
          widthPercent: 80,
          heightPercent: 60,
        },
      },
      safeZones: {
        overlay: {
          desktop: {
            xPercent: 5,
            yPercent: 5,
            widthPercent: 25,
            heightPercent: 20,
          },
          mobile: {
            xPercent: 5,
            yPercent: 5,
            widthPercent: 50,
            heightPercent: 20,
          },
        },
      },
      anchors: {
        anh: {
          desktop: { xPercent: 50, yPercent: 85, scale: 1 },
          mobile: { xPercent: 50, yPercent: 82, scale: 1 },
        },
      },
      ...overrides,
    }),
  )
  return recordPath
}

async function catalogError(directory: string) {
  const error = await validateAssetCatalog(directory).catch(
    (caught: unknown) => caught,
  )

  expect(error).toBeInstanceOf(Error)
  if (!(error instanceof Error)) throw new Error('expected validation error')
  return error
}

describe('asset catalog validation', () => {
  it('accepts an empty source catalog', async () => {
    const directory = await createCatalogDirectory()

    await expect(validateAssetCatalog(directory)).resolves.toBeUndefined()
  })

  it('rejects a malformed registered scene record', async () => {
    const directory = await createCatalogDirectory()
    const sceneDirectory = join(directory, 'scenes', 'home')
    await mkdir(sceneDirectory, { recursive: true })
    await writeFile(join(sceneDirectory, 'home.scene.json'), '{"name":"home"}')

    await expect(validateAssetCatalog(directory)).rejects.toThrow(
      'home.scene.json: scene record requires desktop, mobile, and anchors',
    )
  })

  it('includes the registered record path when semantic validation fails', async () => {
    const directory = await createCatalogDirectory()
    const sequenceDirectory = join(directory, 'character', 'idle')
    const sequencePath = join(sequenceDirectory, 'sequence.json')
    await mkdir(sequenceDirectory, { recursive: true })
    await writeFile(
      sequencePath,
      JSON.stringify({
        name: 'idle',
        durationMs: 0,
        loop: true,
        fallback: 0,
        anchor: { xPercent: 50, yPercent: 100 },
        frames: [
          {
            path: 'first.png',
            width: 64,
            height: 96,
            anchor: { xPercent: 50, yPercent: 100 },
          },
          {
            path: 'second.png',
            width: 64,
            height: 96,
            anchor: { xPercent: 50, yPercent: 100 },
          },
        ],
      }),
    )

    const error = await validateAssetCatalog(directory).catch(
      (caught: unknown) => caught,
    )

    expect(error).toBeInstanceOf(Error)
    if (!(error instanceof Error)) throw new Error('expected validation error')
    expect(error.message).toContain(sequencePath)
    expect(error.message).toContain(
      'idle: duration must be finite and positive; got 0',
    )
  })

  it('includes the record path for nonfinite JSON sequence durations', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSequenceRecord(
      join(directory, 'character', 'idle'),
      'idle',
    )
    const record = await readFile(recordPath, 'utf8')
    await writeFile(
      recordPath,
      record.replace('"durationMs":600', '"durationMs":1e999'),
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'idle: duration must be finite and positive; got Infinity',
    )
  })

  it('rejects duplicate sequence names across atlas catalogs', async () => {
    const directory = await createCatalogDirectory()
    const characterRecord = await createValidSequenceRecord(
      join(directory, 'character', 'idle'),
      'idle',
    )
    const contentRecord = await createValidSequenceRecord(
      join(directory, 'content', 'idle-badge'),
      'idle',
    )

    const error = await validateAssetCatalog(directory).catch(
      (caught: unknown) => caught,
    )

    expect(error).toBeInstanceOf(Error)
    if (!(error instanceof Error)) throw new Error('expected validation error')
    expect(error.message).toContain(characterRecord)
    expect(error.message).toContain(contentRecord)
    expect(error.message).toContain('duplicate sequence name "idle"')
  })

  it('rejects sequence names that cannot produce CSS identifiers', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSequenceRecord(
      join(directory, 'character', 'idle-space'),
      'idle space',
    )

    const error = await validateAssetCatalog(directory).catch(
      (caught: unknown) => caught,
    )

    expect(error).toBeInstanceOf(Error)
    if (!(error instanceof Error)) throw new Error('expected validation error')
    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'sequence name must match /^[a-z][a-z0-9-]*$/; got "idle space"',
    )
  })

  it('rejects a frame without explicit normalized anchor metadata', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSequenceRecord(
      join(directory, 'character', 'idle'),
      'idle',
    )
    const record = JSON.parse(await readFile(recordPath, 'utf8')) as {
      frames: Array<Record<string, unknown>>
    }
    delete record.frames[0]?.anchor
    await writeFile(recordPath, JSON.stringify(record))

    await expect(validateAssetCatalog(directory)).rejects.toThrow(recordPath)
    await expect(validateAssetCatalog(directory)).rejects.toThrow(
      'frame anchor',
    )
  })

  it('rejects sequence frames whose anchors do not equal the declared anchor', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSequenceRecord(
      join(directory, 'character', 'idle'),
      'idle',
    )
    const record = JSON.parse(await readFile(recordPath, 'utf8')) as {
      frames: Array<Record<string, unknown>>
    }
    record.frames[1] = {
      ...record.frames[1],
      anchor: { xPercent: 49, yPercent: 100 },
    }
    await writeFile(recordPath, JSON.stringify(record))

    await expect(validateAssetCatalog(directory)).rejects.toThrow(recordPath)
    await expect(validateAssetCatalog(directory)).rejects.toThrow(
      'anchor must equal sequence anchor',
    )
  })

  it('rejects a sequence anchor that is not bottom-center', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSequenceRecord(
      join(directory, 'character', 'idle'),
      'idle',
    )
    const record = JSON.parse(await readFile(recordPath, 'utf8')) as Record<
      string,
      unknown
    >
    record.anchor = { xPercent: 49, yPercent: 100 }
    await writeFile(recordPath, JSON.stringify(record))

    await expect(validateAssetCatalog(directory)).rejects.toThrow(recordPath)
    await expect(validateAssetCatalog(directory)).rejects.toThrow(
      'bottom-center',
    )
  })

  it('rejects path-like scene names before asset publication', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      { name: '../home' },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain('scene name must match')
    expect(error.message).toContain('../home')
  })

  it('rejects path-like scene anchor names', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      {
        anchors: {
          '../anh': {
            desktop: { xPercent: 50, yPercent: 85, scale: 1 },
            mobile: { xPercent: 50, yPercent: 82, scale: 1 },
          },
        },
      },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain('anchor name must match')
    expect(error.message).toContain('../anh')
  })

  it('rejects nonfinite scene anchor scales', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
    )
    const record = await readFile(recordPath, 'utf8')
    await writeFile(recordPath, record.replace('"scale":1', '"scale":1e999'))

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain('scale must be finite')
    expect(error.message).toContain('Infinity')
  })

  it('rejects out-of-range scene anchor coordinates', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      {
        anchors: {
          anh: {
            desktop: { xPercent: 101, yPercent: 85, scale: 1 },
            mobile: { xPercent: 50, yPercent: 82, scale: 1 },
          },
        },
      },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'xPercent must be finite and between 0 and 100',
    )
    expect(error.message).toContain('101')
  })

  it('rejects scene metadata whose declared desktop dimensions are not 1536x1024', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      { desktopDimensions: { width: 1535, height: 1024 } },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'desktop declared dimensions must be 1536x1024',
    )
    expect(error.message).toContain('1535x1024')
  })

  it('rejects focal areas outside the scene bounds', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      {
        focalArea: {
          desktop: {
            xPercent: 60,
            yPercent: 20,
            widthPercent: 50,
            heightPercent: 60,
          },
          mobile: {
            xPercent: 10,
            yPercent: 20,
            widthPercent: 80,
            heightPercent: 60,
          },
        },
      },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'focalArea.desktop must stay within 0-100% bounds',
    )
  })

  it('rejects safe zones outside the scene bounds', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      {
        safeZones: {
          overlay: {
            desktop: {
              xPercent: 90,
              yPercent: 5,
              widthPercent: 25,
              heightPercent: 20,
            },
            mobile: {
              xPercent: 5,
              yPercent: 5,
              widthPercent: 50,
              heightPercent: 20,
            },
          },
        },
      },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'safeZones.overlay.desktop must stay within 0-100% bounds',
    )
  })

  it('rejects a registered scene without safe zones', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      { safeZones: {} },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain('safeZones must include at least one zone')
  })

  it('rejects a registered scene without recommended anchors', async () => {
    const directory = await createCatalogDirectory()
    const recordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
      { anchors: {} },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(recordPath)
    expect(error.message).toContain(
      'anchors must include at least one recommended anchor',
    )
  })

  it('rejects duplicate scene names with both registered record paths', async () => {
    const directory = await createCatalogDirectory()
    const firstRecordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home'),
      'home',
    )
    const secondRecordPath = await createValidSceneRecord(
      join(directory, 'scenes', 'home-copy'),
      'home-copy',
      { name: 'home' },
    )

    const error = await catalogError(directory)

    expect(error.message).toContain(firstRecordPath)
    expect(error.message).toContain(secondRecordPath)
    expect(error.message).toContain('duplicate scene name "home"')
  })
})
