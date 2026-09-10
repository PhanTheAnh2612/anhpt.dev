export const learningPath = [
  {
    slug: 'fundamentals',
    order: 1,
    title: 'Web Fundamentals',
    icon: 'JS',
    mapClass: 'map-stop--fundamentals',
    description: 'HTML, CSS, JavaScript, and TypeScript—the browser basics.',
  },
  {
    slug: 'react',
    order: 2,
    title: 'ReactJS',
    icon: 'RE',
    mapClass: 'map-stop--react',
    description:
      'Build accessible interfaces from components, state, and data.',
    journalTag: 'ReactJS',
  },
  {
    slug: 'nestjs',
    order: 3,
    title: 'NestJS',
    icon: 'NS',
    mapClass: 'map-stop--nestjs',
    description: 'Create a structured API when your website needs a backend.',
  },
  {
    slug: 'databases',
    order: 4,
    title: 'SQLite',
    icon: 'SQ',
    mapClass: 'map-stop--databases',
    description: 'Model, query, and safely evolve relational data with SQLite.',
  },
  {
    slug: 'deployment',
    order: 5,
    title: 'Deployment',
    icon: 'CF',
    mapClass: 'map-stop--deployment',
    description: 'Connect a domain, configure hosting, and ship to production.',
  },
  {
    slug: 'security',
    order: 6,
    title: 'Security',
    icon: 'SEC',
    mapClass: 'map-stop--security',
    description: 'This content will be available soon.',
    journalTag: 'Auth',
  },
  {
    slug: 'tips',
    order: 7,
    title: 'Tips & Tricks',
    icon: 'TIP',
    mapClass: 'map-stop--tips',
    description: 'This content will be available soon.',
  },
  {
    slug: 'system-design',
    order: 8,
    title: 'System Design',
    icon: 'SYS',
    mapClass: 'map-stop--system-design',
    description: 'This content will be available soon.',
  },
] as const

export type CourseCategory = (typeof learningPath)[number]['slug']

export function isCourseCategory(value: unknown): value is CourseCategory {
  return learningPath.some((category) => category.slug === value)
}

export function getLearningCategory(slug: CourseCategory | undefined) {
  return learningPath.find((category) => category.slug === slug)
}
