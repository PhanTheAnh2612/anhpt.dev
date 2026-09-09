import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { LessonLayout } from '../../components/features/learning/lesson-layout'
import { getContent, getContentByKind } from '../../lib/content'

export const Route = createFileRoute('/courses/$slug')({
  loader: ({ params }) => {
    const entry = getContent('course', params.slug)
    if (!entry) {
      const replacement = legacyCourseRedirects[params.slug]
      if (replacement) {
        throw redirect({
          to: '/courses/$slug',
          params: { slug: replacement.slug },
          search: { category: replacement.category },
          replace: true,
        })
      }
      throw notFound()
    }
    return entry
  },
  component: Course,
})

const legacyCourseRedirects = {
  'deploy-your-site': {
    slug: 'cloudflare-web-deployment',
    category: 'deployment',
  },
  'developer-tips': { slug: 'git-github-workflow', category: 'deployment' },
  'frontend-foundations': {
    slug: 'how-the-web-works',
    category: 'fundamentals',
  },
  'nestjs-api': { slug: 'nestjs-project-structure', category: 'nestjs' },
  'postgres-basics': { slug: 'sqlite-hotel-schema', category: 'databases' },
  'react-interfaces': { slug: 'react-shadcn-setup', category: 'react' },
  'system-design-foundations': {
    slug: 'cloudflare-nestjs-container',
    category: 'deployment',
  },
  'web-security': {
    slug: 'web-accessibility-security',
    category: 'fundamentals',
  },
} as const

function Course() {
  const entry = Route.useLoaderData()
  return <LessonLayout entry={entry} entries={getContentByKind('course')} />
}
