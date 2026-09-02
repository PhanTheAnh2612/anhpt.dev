import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, describe, expect, it } from 'vitest'
import type { SequenceSource } from './contracts'
import { packAtlas } from './pack-atlases'

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

async function createTransparentFrame(path: string) {
  await sharp({
    create: {
      width: 64,
      height: 96,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toFile(path)
}

describe('atlas packing', () => {
  it('places sequence frames contiguously and emits stable metadata', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'anhpt-atlas-'))
    temporaryDirectories.push(directory)
    const firstFrame = join(directory, 'idle-0.png')
    const secondFrame = join(directory, 'idle-1.png')
    const outputDirectory = join(directory, 'output')
    await createTransparentFrame(firstFrame)
    await createTransparentFrame(secondFrame)
    const idleSequence: SequenceSource = {
      name: 'idle',
      durationMs: 600,
      loop: true,
      fallback: 0,
      frames: [
        { path: firstFrame, width: 64, height: 96 },
        { path: secondFrame, width: 64, height: 96 },
      ],
    }

    const manifest = await packAtlas(
      'character',
      [idleSequence],
      outputDirectory,
    )

    expect(manifest.sequences.idle).toEqual({
      atlas: 'character',
      durationMs: 600,
      loop: true,
      fallback: 0,
      frames: [
        { x: 0, y: 0, width: 64, height: 96 },
        { x: 64, y: 0, width: 64, height: 96 },
      ],
    })
  })
})
