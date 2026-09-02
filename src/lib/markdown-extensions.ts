import type { MarkdownDocument } from '@tanstack/markdown'
import { commentComponentsExtension } from '@tanstack/markdown/extensions/comment-components'
import { parseMarkdown } from '@tanstack/markdown/parser'
import { spriteManifest } from '../generated/sprite-manifest'

const spriteName = Symbol('registered-sprite-name')

export const directiveContract = {
  'trainer-tip': { pose: ['idle', 'think', 'question', 'point', 'teach'] },
  note: {},
  warning: {},
  remember: {},
  quest: {
    difficulty: ['beginner', 'intermediate', 'advanced'],
    reward: spriteName,
  },
  challenge: { difficulty: ['beginner', 'intermediate', 'advanced'] },
  exercise: {},
  quiz: {},
  reward: { icon: spriteName },
  badge: { icon: spriteName },
  success: {},
  locked: {},
  current: {},
  'code-example': {},
  terminal: {},
  architecture: {},
  resource: {},
} as const

type AttributeRule = readonly string[] | typeof spriteName

const validateDirective = (
  name: string,
  attributes: Record<string, string>,
) => {
  if (!Object.hasOwn(directiveContract, name)) {
    throw new Error(`Unknown directive "${name}".`)
  }

  const contract = directiveContract[name] as Record<string, AttributeRule>

  for (const [attribute, value] of Object.entries(attributes)) {
    if (!Object.hasOwn(contract, attribute)) {
      throw new Error(`${name}: unknown attribute "${attribute}"`)
    }

    const rule = contract[attribute]
    if (rule === spriteName) {
      if (!Object.hasOwn(spriteManifest, value)) {
        throw new Error(`${name}: unknown sprite "${value}" for "${attribute}"`)
      }
      continue
    }

    if (!rule.includes(value)) {
      throw new Error(`${name}: invalid value "${value}" for "${attribute}"`)
    }
  }
}

export const contentDirectiveExtension = commentComponentsExtension({
  transformComponent(node) {
    validateDirective(node.name, node.attributes)
    return {
      ...node,
      properties: {
        'data-directive': node.name,
        ...Object.fromEntries(
          Object.entries(node.attributes).map(([name, value]) => [
            `data-${name}`,
            value,
          ]),
        ),
      },
      tagName: `content-${node.name}`,
    }
  },
})

export const parseContentMarkdown = (source: string): MarkdownDocument =>
  parseMarkdown(source, {
    extensions: [contentDirectiveExtension],
    frontmatter: true,
    headingIds: true,
  })
