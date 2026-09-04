import type { ContentKind } from './content'

export type SearchableEntry = {
  kind: ContentKind
  slug: string
  title: string
  description: string
  tags: ReadonlyArray<string>
  category: string
}

export function searchContent<T extends SearchableEntry>(
  entries: ReadonlyArray<T>,
  query: string,
): T[] {
  const tokens = query
    .toLocaleLowerCase('en')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (tokens.length === 0) return []
  return entries.filter((entry) => {
    const haystack = [
      entry.title,
      entry.description,
      entry.category,
      ...entry.tags,
    ]
      .join(' ')
      .toLocaleLowerCase('en')
    return tokens.every((token) => haystack.includes(token))
  })
}
