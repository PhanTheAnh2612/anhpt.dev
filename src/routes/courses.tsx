import { Outlet, createFileRoute } from '@tanstack/react-router'
import { isCourseCategory } from '../lib/learning-path'

export const Route = createFileRoute('/courses')({
  validateSearch: (search: Record<string, unknown>) => ({
    category: isCourseCategory(search.category) ? search.category : undefined,
  }),
  component: CoursesLayout,
})

function CoursesLayout() {
  return <Outlet />
}
