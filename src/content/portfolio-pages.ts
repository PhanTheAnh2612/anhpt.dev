export const portfolioPages = {
  home: {
    title: 'anhpt.dev',
    subtitle: "A frontend engineer's journey through the world of software.",
    greeting: "Hi, I'm Anh. Let's learn, build, and level up together.",
    label: 'FRONTEND RANGER · A NEW ADVENTURE',
  },
  journey: {
    label: 'NEW ADVENTURE · 8 REGIONS',
    title: 'Build & Ship a Website',
    introduction:
      'Follow the dotted trail from your first line of HTML to a secure, deployed website. Focus or hover over an island to inspect it, then choose a route.',
  },
  secretBase: {
    label: 'SELECTED WORK · 2 PROJECTS',
    title: 'Project Archive',
    introduction:
      'A closer look at the products I help shape, from production advertising technology to a new zero-config publishing workspace.',
    projects: [
      {
        name: 'Knorex XPO',
        company: 'Knorex Company',
        status: 'Confidential',
        scene: 'secret-base',
        description:
          'XPO is Knorex’s AI-powered platform for building, launching, tracking, reporting on, and optimizing advertising across channels from one place.',
        role: 'Frontend Engineer',
        responsibilities: [
          'Turn complex campaign and reporting workflows into clear, dependable product experiences.',
          'Build maintainable frontend features with close attention to quality, performance, and usability.',
          'Own delivery, support urgent initiatives, and collaborate across product, design, and engineering.',
        ],
        confidentiality:
          'The work is locked because the product and implementation details are confidential. This overview only describes my public-facing responsibilities.',
        cta: {
          label: 'View my LinkedIn',
          href: 'https://www.linkedin.com/in/anhpt2612/',
          disabled: false,
        },
      },
      {
        name: 'EzBuilder',
        company: 'Independent project',
        status: 'In development',
        scene: 'ezbuilder',
        description:
          'A zero-config content workspace where people can manage pages, posts, and reusable site content without maintaining their own publishing stack.',
        role: 'Product creator & frontend engineer',
        responsibilities: [
          'Design a focused authoring experience inspired by the accessibility of WordPress and Framer.',
          'Create reusable content models for pages, posts, and future publishing workflows.',
          'Build an approachable foundation that works immediately while leaving room for deeper customization.',
        ],
        confidentiality:
          'The workshop is still being assembled. Product access will open when the core editing and publishing flow is ready.',
        cta: { label: 'Coming soon', disabled: true },
      },
    ],
  },
  badges: {
    label: 'ACHIEVEMENTS & CERTIFICATES',
    title: 'Badge Archive',
    introduction:
      'A chronological record of recognition earned at work and certificates collected along the learning trail.',
    disclaimer:
      'Sample records for now — verified links and details are coming next.',
    empty:
      'No achievements carry this tag yet. Choose another tag or return to all achievements.',
  },
  journal: {
    label: 'FIELD NOTES',
    title: 'Journal',
    introduction:
      'Small discoveries, useful mistakes, and notes from the learning trail.',
    empty:
      'No notes carry this tag yet. Choose another tag or return to all notes.',
  },
  search: {
    label: 'THE RANGER INDEX',
    title: 'Search the trail',
    introduction: 'Find a journal entry by title, description, or tag.',
    empty: 'Enter a topic to search the journal.',
    noResults:
      'No matching entries. Try a broader topic or explore the world map.',
  },
  notFound: {
    label: 'A WILD 404 APPEARED!',
    title: 'This route is not on the map.',
    description: 'The trail ends here, but your learning journey does not.',
  },
} as const
