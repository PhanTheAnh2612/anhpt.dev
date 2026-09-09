export type Badge = {
  id: string
  title: string
  description: string
  issuer: 'Knorex' | 'Educative' | 'Other'
  issuedAt: string
  detailsHref: string
}

export const badges: ReadonlyArray<Badge> = [
  {
    id: 'knorex-five-year-milestone',
    title: 'Five-Year Milestone',
    description: 'Recognized for five consecutive years of contribution.',
    issuer: 'Knorex',
    issuedAt: '2026-06-01',
    detailsHref: 'https://www.linkedin.com/in/anhpt2612/',
  },
  {
    id: 'educative-frontend-system-design',
    title: 'Frontend System Design',
    description: 'Completed a practical course in scalable frontend systems.',
    issuer: 'Educative',
    issuedAt: '2026-03-01',
    detailsHref: 'https://www.educative.io/',
  },
  {
    id: 'knorex-performance-award',
    title: 'Performance Award',
    description: 'Recognized for dependable delivery and team contribution.',
    issuer: 'Knorex',
    issuedAt: '2025-12-01',
    detailsHref: 'https://www.linkedin.com/in/anhpt2612/',
  },
  {
    id: 'educative-advanced-react',
    title: 'Advanced React Patterns',
    description:
      'Completed coursework in reusable and maintainable React patterns.',
    issuer: 'Educative',
    issuedAt: '2025-08-01',
    detailsHref: 'https://www.educative.io/',
  },
  {
    id: 'other-web-accessibility',
    title: 'Web Accessibility Foundations',
    description: 'Completed a foundation course in inclusive web experiences.',
    issuer: 'Other',
    issuedAt: '2025-02-01',
    detailsHref: 'https://www.linkedin.com/in/anhpt2612/',
  },
]
