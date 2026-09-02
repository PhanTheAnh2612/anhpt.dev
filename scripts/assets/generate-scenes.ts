import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig as resolvePrettierConfig } from 'prettier'
import type { SceneSource } from './contracts'

export type SceneManifestEntry = {
  desktop: { src: string }
  mobile: { src: string }
  anchors: SceneSource['anchors']
}

export async function generateSceneManifest(
  scenes: SceneSource[],
  outputFile: string,
): Promise<void> {
  const manifest = Object.fromEntries(
    scenes.map((scene) => [
      scene.name,
      {
        desktop: { src: `/assets/scenes/${scene.name}.desktop.png` },
        mobile: { src: `/assets/scenes/${scene.name}.mobile.png` },
        anchors: scene.anchors,
      },
    ]),
  )
  await mkdir(resolve(outputFile, '..'), { recursive: true })
  await writeFile(
    outputFile,
    await format(
      [
        "import type { SceneSource } from '../../scripts/assets/contracts'",
        '',
        'export type SceneManifestEntry = {',
        '  desktop: { src: string }',
        '  mobile: { src: string }',
        "  anchors: SceneSource['anchors']",
        '}',
        '',
        `export const sceneManifest = ${JSON.stringify(manifest, null, 2)} as const satisfies Record<string, SceneManifestEntry>`,
        '',
      ].join('\n'),
      {
        ...(await resolvePrettierConfig(outputFile)),
        filepath: outputFile,
      },
    ),
  )
}

async function loadScenes(directory: string): Promise<SceneSource[]> {
  const recordPaths = await findSceneRecordPaths(directory)

  return Promise.all(
    recordPaths.map(async (recordPath) => {
      const record = JSON.parse(
        await readFile(recordPath, 'utf8'),
      ) as SceneSource
      const recordDirectory = resolve(recordPath, '..')

      return {
        ...record,
        desktop: resolve(recordDirectory, record.desktop),
        mobile: resolve(recordDirectory, record.mobile),
      }
    }),
  )
}

async function findSceneRecordPaths(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const paths: string[] = []

  for (const entry of entries) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      paths.push(...(await findSceneRecordPaths(path)))
    } else if (entry.isFile() && entry.name.endsWith('.scene.json')) {
      paths.push(path)
    }
  }

  return paths.sort()
}

async function publishScenes(scenes: SceneSource[], projectRoot: string) {
  const outputDirectory = resolve(projectRoot, 'public/assets/scenes')
  await mkdir(outputDirectory, { recursive: true })
  await Promise.all(
    scenes.flatMap((scene) => [
      copyFile(
        scene.desktop,
        join(outputDirectory, `${scene.name}.desktop.png`),
      ),
      copyFile(scene.mobile, join(outputDirectory, `${scene.name}.mobile.png`)),
    ]),
  )
}

async function buildScenes() {
  const root = resolve(process.cwd())
  const scenes = await loadScenes(resolve(root, 'assets-src/scenes'))
  await publishScenes(scenes, root)
  await generateSceneManifest(
    scenes,
    resolve(root, 'src/generated/scene-manifest.ts'),
  )
}

const currentFile = fileURLToPath(import.meta.url)

if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  buildScenes().catch((error: unknown) => {
    const detail = error instanceof Error ? error.message : String(error)
    console.error(detail)
    process.exitCode = 1
  })
}
