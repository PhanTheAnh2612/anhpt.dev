import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { runInNewContext } from 'node:vm'
import sharp from 'sharp'
import ts from 'typescript'
import { afterEach, describe, expect, it } from 'vitest'
import type { SceneSource, SequenceSource } from './contracts'

const run = promisify(execFile)
const projectRoot = resolve(import.meta.dirname, '../..')
const cli = fileURLToPath(import.meta.resolve('tsx/cli'))
const directories: string[] = []

afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((path) =>
      rm(path, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      }),
    ),
  )
})

async function createProject() {
  const root = await mkdtemp(join(tmpdir(), 'anhpt-publication-'))
  directories.push(root)
  await Promise.all(
    ['character', 'content', 'world', 'scenes'].map((name) =>
      mkdir(join(root, 'assets-src', name), { recursive: true }),
    ),
  )
  return root
}

async function build(root: string, script: 'pack-atlases' | 'generate-scenes') {
  await run(
    process.execPath,
    [cli, join(projectRoot, 'scripts/assets', `${script}.ts`)],
    { cwd: root },
  )
}

async function addSequence(root: string, name: string, loop: boolean) {
  const directory = join(root, 'assets-src/character', name)
  await mkdir(directory, { recursive: true })
  const anchor = { xPercent: 50, yPercent: 100 }
  const frames = await Promise.all(
    ['#ff0000', '#00ff00'].map(async (color, index) => {
      const path = `${index}.png`
      await sharp({
        create: { width: 2, height: 2, channels: 4, background: color },
      })
        .extend({
          top: 1,
          bottom: 1,
          left: 1,
          right: 1,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(join(directory, path))
      return { path, width: 4, height: 4, anchor }
    }),
  )
  const sequence: SequenceSource = {
    name,
    durationMs: 600,
    loop,
    fallback: 1,
    anchor,
    frames,
  }
  await writeFile(join(directory, 'sequence.json'), JSON.stringify(sequence))
}

async function addScene(root: string) {
  const directory = join(root, 'assets-src/scenes/coast')
  await mkdir(directory, { recursive: true })
  const area = {
    xPercent: 10,
    yPercent: 10,
    widthPercent: 40,
    heightPercent: 30,
  }
  const scene: SceneSource = {
    name: 'coast',
    desktop: 'desktop.png',
    mobile: 'mobile.png',
    desktopDimensions: { width: 1536, height: 1024 },
    mobileDimensions: { width: 1024, height: 1280 },
    focalArea: { desktop: area, mobile: { ...area, xPercent: 20 } },
    safeZones: { title: { desktop: area, mobile: area } },
    anchors: {
      anh: {
        desktop: { xPercent: 30, yPercent: 90, scale: 2 },
        mobile: { xPercent: 60, yPercent: 80, scale: 0.8 },
      },
    },
  }
  await Promise.all(
    ['desktop', 'mobile'].map((variant) =>
      sharp({
        create: {
          ...(variant === 'desktop'
            ? scene.desktopDimensions
            : scene.mobileDimensions),
          channels: 3,
          background: '#123456',
        },
      })
        .png()
        .toFile(join(directory, `${variant}.png`)),
    ),
  )
  await writeFile(join(directory, 'coast.scene.json'), JSON.stringify(scene))
  return scene
}

function evaluateManifest(source: string) {
  const context = { exports: {} as Record<string, any> }
  runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    context,
  )
  return context.exports
}

async function publishedBytes(root: string) {
  const paths = [
    'public/assets/atlases/character.png',
    'public/assets/atlases/content.png',
    'public/assets/atlases/world.png',
    'src/generated/sprite-manifest.ts',
    'src/generated/sprite-atlases.css',
    'src/generated/scene-manifest.ts',
    'public/assets/scenes/coast.desktop.png',
    'public/assets/scenes/coast.mobile.png',
  ]
  return Promise.all(paths.map((path) => readFile(join(root, path))))
}

describe('real asset publication', () => {
  it('replaces placeholders, preserves metadata, and repeats byte-identical nonempty outputs', async () => {
    const root = await createProject()
    await build(root, 'pack-atlases')
    const empty = await sharp(
      join(root, 'public/assets/atlases/character.png'),
    ).metadata()
    expect([empty.width, empty.height]).toEqual([1, 1])
    await addSequence(root, 'idle', true)
    await addSequence(root, 'success', false)
    const scene = await addScene(root)
    await build(root, 'pack-atlases')
    await build(root, 'generate-scenes')
    const first = await publishedBytes(root)
    const atlas = await sharp(first[0])
      .raw()
      .toBuffer({ resolveWithObject: true })
    expect([atlas.info.width, atlas.info.height]).toEqual([8, 8])
    expect([
      ...atlas.data.subarray((1 * 8 + 1) * 4, (1 * 8 + 1) * 4 + 4),
    ]).toEqual([255, 0, 0, 255])
    expect([
      ...atlas.data.subarray((1 * 8 + 5) * 4, (1 * 8 + 5) * 4 + 4),
    ]).toEqual([0, 255, 0, 255])
    const sprites = evaluateManifest(first[3].toString())
    expect(sprites.spriteManifest.idle.anchor).toEqual({
      xPercent: 50,
      yPercent: 100,
    })
    expect(sprites.spriteManifest.idle.frames[1]).toEqual({
      x: 4,
      y: 0,
      width: 4,
      height: 4,
      anchor: { xPercent: 50, yPercent: 100 },
    })
    expect(sprites.spriteAtlases.character).toEqual({
      src: '/assets/atlases/character.png',
      width: 8,
      height: 8,
    })
    const scenes = evaluateManifest(first[5].toString())
    expect(scenes.sceneManifest.coast).toEqual({
      desktop: {
        src: '/assets/scenes/coast.desktop.png',
        width: 1536,
        height: 1024,
      },
      mobile: {
        src: '/assets/scenes/coast.mobile.png',
        width: 1024,
        height: 1280,
      },
      anchors: scene.anchors,
      focalArea: scene.focalArea,
      safeZones: scene.safeZones,
    })
    expect(first[6]).toEqual(
      await readFile(join(root, 'assets-src/scenes/coast/desktop.png')),
    )
    expect(first[7]).toEqual(
      await readFile(join(root, 'assets-src/scenes/coast/mobile.png')),
    )
    await build(root, 'pack-atlases')
    await build(root, 'generate-scenes')
    expect(await publishedBytes(root)).toEqual(first)
  }, 30000)

  it('ends non-loop animations on the final frame while loops and reduced motion retain their own frames', async () => {
    const root = await createProject()
    await addSequence(root, 'idle', true)
    await addSequence(root, 'success', false)
    await build(root, 'pack-atlases')
    const css = (
      await readFile(join(root, 'src/generated/sprite-atlases.css'), 'utf8')
    ).replace(/\s+/g, ' ')
    expect(css).toMatch(
      /@keyframes pixel-animation-idle .*?100% \{ background-position: 0px 0px;/,
    )
    expect(css).toMatch(
      /@keyframes pixel-animation-success .*?100% \{ background-position: -4px -4px;/,
    )
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\).*?\.pixel-animation--idle \{ animation: none; background-position: -4px 0px;/,
    )
    expect(css).toMatch(/--pixel-anchor-x: 50%; --pixel-anchor-y: 100%;/)
  }, 15000)

  it('rejects unsafe or invalid scene metadata before publishing any files', async () => {
    const root = await createProject()
    const scene = await addScene(root)
    const record = join(root, 'assets-src/scenes/coast/coast.scene.json')
    const output = join(root, 'public/assets/scenes')
    await mkdir(output, { recursive: true })
    const sentinel = join(output, 'coast.desktop.png')
    await writeFile(sentinel, 'previous approved image')
    for (const invalid of [
      { ...scene, name: '../escape' },
      { ...scene, safeZones: {} },
      { ...scene, mobile: 'missing.png' },
    ]) {
      await writeFile(record, JSON.stringify(invalid))
      await expect(build(root, 'generate-scenes')).rejects.toThrow()
      expect(await readFile(sentinel, 'utf8')).toBe('previous approved image')
    }
  }, 15000)

  it('compiles literal generated catalogs with runtime consumers and rejects unknown names and slots', async () => {
    const root = await createProject()
    await addSequence(root, 'idle', true)
    await addScene(root)
    await build(root, 'pack-atlases')
    await build(root, 'generate-scenes')
    const virtualFiles = new Map<string, string>()
    for (const name of ['sprite-manifest', 'scene-manifest']) {
      virtualFiles.set(
        resolve(projectRoot, `src/generated/${name}.ts`),
        await readFile(join(root, `src/generated/${name}.ts`), 'utf8'),
      )
    }
    const consumer = resolve(projectRoot, 'src/generated/fixture-consumer.tsx')
    virtualFiles.set(
      consumer,
      `
      import { PixelScene } from '../components/shared/pixel-scene'
      import { PixelSprite } from '../components/shared/pixel-sprite'
      import { PixelAnimation } from '../components/shared/pixel-animation'
      const valid = <><PixelScene name="coast" overlays={{ anh: <span /> }} /><PixelSprite name="idle" frame={0} /><PixelAnimation name="idle" /></>
      // @ts-expect-error unregistered scene
      const missingScene = <PixelScene name="missing" />
      // @ts-expect-error unregistered overlay
      const missingSlot = <PixelScene name="coast" overlays={{ missing: <span /> }} />
      // @ts-expect-error unregistered sprite
      const missingSprite = <PixelSprite name="missing" frame={0} />
      // @ts-expect-error unregistered animation
      const missingAnimation = <PixelAnimation name="missing" />
    `,
    )
    const options: ts.CompilerOptions = {
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      types: ['node'],
    }
    const host = ts.createCompilerHost(options)
    const originalRead = host.readFile.bind(host)
    const originalExists = host.fileExists.bind(host)
    host.readFile = (path) =>
      virtualFiles.get(resolve(path)) ?? originalRead(path)
    host.fileExists = (path) =>
      virtualFiles.has(resolve(path)) || originalExists(path)
    const program = ts.createProgram([consumer], options, host)
    const errors = ts
      .getPreEmitDiagnostics(program)
      .map((diagnostic) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      )
    expect(errors).toEqual([])
  }, 30000)
})
