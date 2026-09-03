import { createFileRoute, notFound } from '@tanstack/react-router'
import { TopicMastery } from '../../components/features/learning/topic-mastery'
import {
  defaultMasteryChallenges,
  masteryChallenges,
} from '../../content/mastery-challenges'
import { getContent } from '../../lib/content'

export const Route = createFileRoute('/courses/$slug_/mastery')({
  loader: ({ params }) => {
    const entry = getContent('course', params.slug)
    if (!entry) throw notFound()
    return {
      entry,
      mastery: masteryChallenges[entry.slug] ?? defaultMasteryChallenges,
    }
  },
  component: Mastery,
})

function Mastery() {
  const { entry, mastery } = Route.useLoaderData()
  return <TopicMastery entry={entry} mastery={mastery} />
}
