import type {
  ComponentNode,
  MarkdownDocument,
  MarkdownExtension,
} from '@tanstack/markdown'
import {
  commentComponentsExtension,
  parseComponentComment,
} from '@tanstack/markdown/extensions/comment-components'
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
type DirectiveName = keyof typeof directiveContract

const isDirectiveName = (name: string): name is DirectiveName =>
  Object.hasOwn(directiveContract, name)

const validateDirective = (
  name: string,
  attributes: Record<string, string>,
) => {
  if (!isDirectiveName(name)) {
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

const transformComponent = (node: ComponentNode): ComponentNode => {
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
}

const commentComponentExtension = commentComponentsExtension({
  transformComponent,
})

const isEndComment = (line: string, name: string) =>
  new RegExp(
    `^ {0,3}<!--\\s*::end:${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*-->\\s*$`,
    'i',
  ).test(line)

const findSameNameNestedEnd = (
  lines: string[],
  start: number,
  name: string,
) => {
  let depth = 1
  let hasSameNameNesting = false

  for (let index = start + 1; index < lines.length; index++) {
    const line = lines[index] ?? ''
    const nestedStart = parseComponentComment(line)
    if (nestedStart?.block && nestedStart.name === name) {
      depth++
      hasSameNameNesting = true
      continue
    }

    if (isEndComment(line, name)) {
      depth--
      if (depth === 0) {
        return { end: index, hasSameNameNesting }
      }
    }
  }

  return undefined
}

export const contentDirectiveExtension: MarkdownExtension = {
  name: 'content-directives',
  parseBlock(context) {
    const start = parseComponentComment(context.lines[context.index] ?? '')
    if (!start?.block) {
      return commentComponentExtension.parseBlock?.(context)
    }

    const nestedBlock = findSameNameNestedEnd(
      context.lines,
      context.index,
      start.name,
    )
    if (!nestedBlock?.hasSameNameNesting) {
      return commentComponentExtension.parseBlock?.(context)
    }

    context.consume(nestedBlock.end - context.index + 1)
    return transformComponent({
      attributes: start.attributes,
      children: context.parseBlocks(
        context.lines.slice(context.index + 1, nestedBlock.end).join('\n'),
      ),
      name: start.name,
      type: 'component',
    })
  },
}

export const parseContentMarkdown = (source: string): MarkdownDocument =>
  parseMarkdown(source, {
    extensions: [contentDirectiveExtension],
    frontmatter: true,
    headingIds: true,
  })
