import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
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
})
