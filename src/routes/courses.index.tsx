import { createFileRoute } from '@tanstack/react-router'
import { CourseOverview } from '../components/features/learning/course-overview'
import { getContentByKind } from '../lib/content'

export const Route = createFileRoute('/courses/')({ component: Courses })

function Courses() {
  const { category } = Route.useSearch()
  return (
    <CourseOverview category={category} entries={getContentByKind('course')} />
  )
}
