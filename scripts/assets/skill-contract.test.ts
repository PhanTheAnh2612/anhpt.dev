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
})
