import { createFileRoute, notFound } from '@tanstack/react-router'
import { LessonLayout } from '../../components/features/learning/lesson-layout'
import { getContent, getContentByKind } from '../../lib/content'

export const Route = createFileRoute('/courses/$slug')({
  loader: ({ params }) => {
    const entry = getContent('course', params.slug)
    if (!entry) throw notFound()
    return entry
  },
  component: Course,
})

function Course() {
  const entry = Route.useLoaderData()
  return <LessonLayout entry={entry} entries={getContentByKind('course')} />
}
