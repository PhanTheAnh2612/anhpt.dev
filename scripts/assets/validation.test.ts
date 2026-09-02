import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, describe, expect, it } from 'vitest'
import { validateScenePair, validateSequence } from './validation'

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

async function createTemporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'anhpt-scene-'))
  temporaryDirectories.push(directory)
  return directory
}

async function createPng(
  path: string,
  options: { channels: 3 | 4; height: number; width: number; alpha?: number },
) {
  await sharp({
    create: {
      width: options.width,
      height: options.height,
      channels: options.channels,
      background:
        options.channels === 4
          ? { r: 6, g: 31, b: 27, alpha: options.alpha ?? 1 }
          : '#061f1b',
    },
  })
    .png()
    .toFile(path)
}

async function createSprite(path: string, width = 64, height = 96) {
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: {
          create: {
            width: width - 2,
            height: height - 2,
            channels: 4,
            background: { r: 6, g: 31, b: 27, alpha: 1 },
          },
        },
        left: 1,
        top: 1,
      },
    ])
    .png()
    .toFile(path)
}

async function createValidScenePair(name: string) {
  const directory = await createTemporaryDirectory()
  const desktop = join(directory, `${name}.desktop.png`)
  const mobile = join(directory, `${name}.mobile.png`)
  await createPng(desktop, { channels: 3, width: 1536, height: 1024 })
  await createPng(mobile, { channels: 3, width: 1024, height: 1280 })
  return { desktop, mobile }
}

function createSceneRecord(name: string, desktop: string, mobile: string) {
  return {
    name,
    desktop,
    mobile,
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
  }
}

const bottomCenterAnchor = { xPercent: 50, yPercent: 100 }

async function createValidSequenceFrames() {
  const directory = await createTemporaryDirectory()
  const first = join(directory, 'first.png')
  const second = join(directory, 'second.png')
  await createSprite(first)
  await createSprite(second)
  return [
    { path: first, width: 64, height: 96, anchor: bottomCenterAnchor },
    { path: second, width: 64, height: 96, anchor: bottomCenterAnchor },
  ]
}

describe('asset validation', () => {
  it('rejects a scene pair with the wrong dimensions', async () => {
    const directory = await createTemporaryDirectory()
    const desktop = join(directory, 'home.desktop.png')
    const mobile = join(directory, 'home.mobile.png')
    await sharp({
      create: { width: 10, height: 10, channels: 3, background: '#061f1b' },
    })
      .png()
      .toFile(desktop)
    await sharp({
      create: { width: 10, height: 10, channels: 3, background: '#061f1b' },
    })
      .png()
      .toFile(mobile)

    await expect(
      validateScenePair(createSceneRecord('home', desktop, mobile)),
    ).rejects.toThrow('home: desktop scene must be 1536x1024')
  })

  it('rejects animation frames with mismatched dimensions', async () => {
    await expect(
      validateSequence({
        name: 'idle',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames: [
          { path: 'a.png', width: 64, height: 96, anchor: bottomCenterAnchor },
          { path: 'b.png', width: 65, height: 96, anchor: bottomCenterAnchor },
        ],
      }),
    ).rejects.toThrow('idle: frames must have the same dimensions; got 65x96')
  })

  it('rejects a scene pair whose mobile variant is not 1024x1280', async () => {
    const directory = await createTemporaryDirectory()
    const desktop = join(directory, 'home.desktop.png')
    const mobile = join(directory, 'home.mobile.png')
    await createPng(desktop, { channels: 3, width: 1536, height: 1024 })
    await createPng(mobile, { channels: 3, width: 1024, height: 1279 })

    await expect(
      validateScenePair(createSceneRecord('home', desktop, mobile)),
    ).rejects.toThrow('home: mobile scene must be 1024x1280; got 1024x1279')
  })

  it('rejects a four-channel scene with transparency', async () => {
    const { desktop, mobile } = await createValidScenePair('coast')
    await createPng(desktop, {
      channels: 4,
      width: 1536,
      height: 1024,
      alpha: 0.5,
    })

    await expect(
      validateScenePair(createSceneRecord('coast', desktop, mobile)),
    ).rejects.toThrow('coast: desktop scene alpha minimum must be 255; got 128')
  })

  it('accepts opaque three-channel scene variants', async () => {
    const { desktop, mobile } = await createValidScenePair('guild')

    await expect(
      validateScenePair(createSceneRecord('guild', desktop, mobile)),
    ).resolves.toBeUndefined()
  })

  it('rejects a sequence with fewer than two frames', async () => {
    const [first] = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'blink',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames: [first],
      }),
    ).rejects.toThrow(
      'blink: animated sequences require at least two frames; got 1',
    )
  })

  it('rejects a sequence with a non-PNG frame', async () => {
    const frames = await createValidSequenceFrames()
    const jpg = frames[0]?.path.replace('.png', '.jpg')
    if (!jpg) throw new Error('fixture frame missing')
    await sharp(frames[0]?.path).jpeg().toFile(jpg)

    await expect(
      validateSequence({
        name: 'talk',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames: [
          { path: jpg, width: 64, height: 96, anchor: bottomCenterAnchor },
          frames[1],
        ],
      }),
    ).rejects.toThrow('talk: frame must be a PNG; got first.jpg')
  })

  it('rejects a sequence frame without alpha', async () => {
    const directory = await createTemporaryDirectory()
    const opaque = join(directory, 'opaque.png')
    await createPng(opaque, { channels: 3, width: 64, height: 96 })
    const [, second] = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'point',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames: [
          { path: opaque, width: 64, height: 96, anchor: bottomCenterAnchor },
          second,
        ],
      }),
    ).rejects.toThrow(
      'point: frame opaque.png must include an alpha channel; got 3',
    )
  })

  it('rejects a sequence frame without a transparent margin', async () => {
    const directory = await createTemporaryDirectory()
    const edgeToEdge = join(directory, 'edge-to-edge.png')
    await createPng(edgeToEdge, { channels: 4, width: 64, height: 96 })
    const [, second] = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'think',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames: [
          {
            path: edgeToEdge,
            width: 64,
            height: 96,
            anchor: bottomCenterAnchor,
          },
          second,
        ],
      }),
    ).rejects.toThrow(
      'think: frame edge-to-edge.png must have a transparent margin',
    )
  })

  it('rejects a frame declaration that does not match its PNG dimensions', async () => {
    const frames = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'read',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames: frames.map((frame) => ({ ...frame, width: 63 })),
      }),
    ).rejects.toThrow('read: frame first.png must be 63x96; got 64x96')
  })

  it('rejects a sequence with an invalid fallback index', async () => {
    const frames = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'celebrate',
        durationMs: 600,
        loop: true,
        fallback: 2,
        anchor: bottomCenterAnchor,
        frames,
      }),
    ).rejects.toThrow(
      'celebrate: fallback index must be between 0 and 1; got 2',
    )
  })

  it('rejects a sequence with a non-positive duration', async () => {
    const frames = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'run-loading',
        durationMs: 0,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames,
      }),
    ).rejects.toThrow('run-loading: duration must be positive; got 0')
  })

  it('accepts a structurally valid sequence', async () => {
    const frames = await createValidSequenceFrames()

    await expect(
      validateSequence({
        name: 'idle',
        durationMs: 600,
        loop: true,
        fallback: 0,
        anchor: bottomCenterAnchor,
        frames,
      }),
    ).resolves.toBeUndefined()
  })
})
