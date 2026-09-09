import { createFileRoute } from '@tanstack/react-router'
import { BadgeCase } from '../components/features/discovery/badge-case'
import { badges } from '../content/badges'

export const Route = createFileRoute('/badges')({
  validateSearch: (search: Record<string, unknown>): { tag?: string } => ({
    tag: typeof search.tag === 'string' ? search.tag : undefined,
  }),
  component: BadgesPage,
})
function BadgesPage() {
  const { tag } = Route.useSearch()
  return <BadgeCase badges={badges} activeTag={tag} />
}
