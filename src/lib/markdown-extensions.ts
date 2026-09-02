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
type BlockDirectiveMarker = {
  column: number
  line: number
  name: string
}
type CodeFence = {
  marker: '`' | '~'
  size: number
}

export type MarkdownSourceContext = {
  sourceLabel?: string
}

const defaultSourceLabel = '<MarkdownContent source>'

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

const parseEndComment = (line: string) => {
  const match = line.match(
    /^ {0,3}<!--\s*::end:([A-Za-z][\w-]*)(.*?)\s*-->\s*$/i,
  )
  if (!match) {
    return undefined
  }

  return {
    name: match[1].toLowerCase(),
    valid: !match[2].trim(),
  }
}

const markerError = (
  sourceLabel: string,
  marker: Pick<BlockDirectiveMarker, 'column' | 'line'>,
  message: string,
) => new Error(`${sourceLabel}:${marker.line}:${marker.column}: ${message}`)

const parseFenceStart = (line: string): CodeFence | undefined => {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
  const fence = match?.[1]
  if (!fence) {
    return undefined
  }

  return {
    marker: fence[0] as CodeFence['marker'],
    size: fence.length,
  }
}

const isFenceEnd = (line: string, fence: CodeFence) => {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})\s*$/)
  const closingFence = match?.[1]

  return (
    closingFence !== undefined &&
    closingFence[0] === fence.marker &&
    closingFence.length >= fence.size
  )
}

const validateDirectiveBoundaries = (source: string, sourceLabel: string) => {
  const stack: BlockDirectiveMarker[] = []
  const lines = source.split(/\r?\n/)
  let fence: CodeFence | undefined

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? ''
    if (fence) {
      if (isFenceEnd(line, fence)) {
        fence = undefined
      }
      continue
    }

    const openingFence = parseFenceStart(line)
    if (openingFence) {
      fence = openingFence
      continue
    }

    const marker = { column: line.indexOf('<!--') + 1, line: index + 1 }
    const end = parseEndComment(line)

    if (end) {
      if (!end.valid) {
        throw markerError(
          sourceLabel,
          marker,
          `directive boundary: malformed closing directive "${end.name}"`,
        )
      }

      const opening = stack.at(-1)
      if (!opening) {
        throw markerError(
          sourceLabel,
          marker,
          `directive boundary: stray closing directive "${end.name}"`,
        )
      }
      if (opening.name !== end.name) {
        throw markerError(
          sourceLabel,
          marker,
          `directive boundary: mismatched closing directive "${end.name}"; expected "${opening.name}"`,
        )
      }

      stack.pop()
      continue
    }

    const component = parseComponentComment(line)
    if (!component) {
      if (/^ {0,3}<!--\s*::/.test(line)) {
        throw markerError(
          sourceLabel,
          marker,
          'directive boundary: malformed directive marker',
        )
      }
      continue
    }

    try {
      validateDirective(component.name, component.attributes)
    } catch (error) {
      throw markerError(
        sourceLabel,
        marker,
        error instanceof Error ? error.message : String(error),
      )
    }

    if (component.block) {
      stack.push({ ...marker, name: component.name })
    }
  }

  const opening = stack.at(-1)
  if (opening) {
    throw markerError(
      sourceLabel,
      opening,
      `directive boundary: missing closing directive "${opening.name}"`,
    )
  }
}

const findSameNameNestedEnd = (
  lines: string[],
  start: number,
  name: string,
) => {
  let depth = 1
  let hasSameNameNesting = false
  let hasCodeFence = false
  let fence: CodeFence | undefined

  for (let index = start + 1; index < lines.length; index++) {
    const line = lines[index] ?? ''
    if (fence) {
      if (isFenceEnd(line, fence)) {
        fence = undefined
      }
      continue
    }

    const openingFence = parseFenceStart(line)
    if (openingFence) {
      hasCodeFence = true
      fence = openingFence
      continue
    }

    const nestedStart = parseComponentComment(line)
    if (nestedStart?.block && nestedStart.name === name) {
      depth++
      hasSameNameNesting = true
      continue
    }

    if (parseEndComment(line)?.name === name) {
      depth--
      if (depth === 0) {
        return { end: index, hasCodeFence, hasSameNameNesting }
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
    if (
      !nestedBlock ||
      (!nestedBlock.hasSameNameNesting && !nestedBlock.hasCodeFence)
    ) {
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

export const parseContentMarkdown = (
  source: string,
  context: MarkdownSourceContext = {},
): MarkdownDocument => {
  validateDirectiveBoundaries(source, context.sourceLabel ?? defaultSourceLabel)

  return parseMarkdown(source, {
    extensions: [contentDirectiveExtension],
    frontmatter: true,
    headingIds: true,
  })
}
