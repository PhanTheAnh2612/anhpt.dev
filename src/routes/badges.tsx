import { createFileRoute } from '@tanstack/react-router'
import { BadgeCase } from '../components/features/discovery/badge-case'
import { badges } from '../content/badges'

export const Route = createFileRoute('/badges')({ component: BadgesPage })
function BadgesPage() {
  return <BadgeCase badges={badges} />
}
