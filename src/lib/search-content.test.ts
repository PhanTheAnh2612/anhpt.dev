import { describe, expect, it } from 'vitest'
import { searchContent } from './search-content'

const entries = [
  {
    kind: 'course',
    slug: 'react-interfaces',
    title: 'React interfaces',
    description: 'Learn hooks',
    tags: [],
    category: 'react',
  },
  {
    kind: 'journal',
    slug: 'hooks-notes',
    title: 'Notes on hooks',
    description: 'Small discoveries',
    tags: ['react'],
    category: '',
  },
  {
    kind: 'course',
    slug: 'web',
    title: 'Web foundations',
    description: 'Browser basics',
    tags: [],
    category: 'fundamentals',
  },
] as const

describe('local search', () => {
  it('requires every normalized query token across indexed fields, preserving order', () => {
    expect(
      searchContent(entries, '  REACT  hooks  ').map((entry) => entry.slug),
    ).toEqual(['react-interfaces', 'hooks-notes'])
    expect(
      searchContent(entries, 'fundamentals').map((entry) => entry.slug),
    ).toEqual(['web'])
    expect(searchContent(entries, 'hooks missing')).toEqual([])
  })
  it('does not invent results for a blank query', () => {
    expect(searchContent(entries, ' \t ')).toEqual([])
  })
})
