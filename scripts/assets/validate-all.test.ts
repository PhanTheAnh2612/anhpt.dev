import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
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
      frames: frames.map((path) => ({ path, width: 64, height: 96 })),
    }),
  )
  return recordPath
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
        frames: [
          { path: 'first.png', width: 64, height: 96 },
          { path: 'second.png', width: 64, height: 96 },
        ],
      }),
    )

    const error = await validateAssetCatalog(directory).catch(
      (caught: unknown) => caught,
    )

    expect(error).toBeInstanceOf(Error)
    if (!(error instanceof Error)) throw new Error('expected validation error')
    expect(error.message).toContain(sequencePath)
    expect(error.message).toContain('idle: duration must be positive; got 0')
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
})
