import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

const skill = (name: string) =>
  readFile(
    new URL(`../../.agents/skills/${name}/SKILL.md`, import.meta.url),
    'utf8',
  )

describe('visual skill contract', () => {
  it.each(['anhpt-art-direction'])('%s has valid frontmatter', async (name) => {
    const source = await skill(name)
    expect(source).toMatch(/^---\nname: [a-z0-9-]+\ndescription: .+\n---/)
  })

  it.each([
    'scene-generation',
    'character-animation',
    'content-element-generation',
    'asset-atlas-pipeline',
  ])('%s routes to the shared art bible', async (name) => {
    expect(await skill(name)).toContain('../anhpt-art-direction/')
  })

  it('keeps generation responsibilities separate', async () => {
    expect(await skill('scene-generation')).toContain('environment-only')
    expect(await skill('scene-generation')).toContain('1536x1024')
    expect(await skill('scene-generation')).toContain('1024x1280')
    expect(await skill('character-animation')).toContain('run-loading')
    expect(await skill('character-animation')).toContain(
      'Never ask the image model to pack the atlas',
    )
    expect(await skill('content-element-generation')).toContain('trainer-tip')
    expect(await skill('asset-atlas-pipeline')).toContain(
      'does not generate artwork',
    )
  })

  it('routes legacy sprite requests without retaining atlas generation', async () => {
    const source = await skill('sprite-generation')
    expect(source).toContain('../character-animation/SKILL.md')
    expect(source).toContain('../anhpt-pixel-portfolio/SKILL.md')
    expect(source).not.toContain('complete atlas')
  })

  it('keeps portfolio composition manifest-driven', async () => {
    const source = await skill('anhpt-pixel-portfolio')
    expect(source).toContain('registered scene/sprite manifests')
    expect(source).toContain('unregistered image prompts')
    expect(source).toContain('manual atlas offsets')
  })
})
