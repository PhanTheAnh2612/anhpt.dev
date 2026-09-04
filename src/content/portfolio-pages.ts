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
    label: 'OFF THE BEATEN PATH',
    title: 'Secret Base',
    introduction:
      'A quiet room for discoveries, experiments, mistakes, and future reminders.',
    heading: "Today's discovery",
    discovery: 'Prefer the simplest boundary that can stay correct.',
    note: 'Good abstractions do not hide the work. They make the next decision easier to understand.',
  },
  badges: {
    label: 'THE MILESTONES ALONG THE WAY',
    title: 'Badge Case',
    introduction:
      'A collection of learning milestones and the challenges still ahead.',
    disclaimer: 'Portfolio milestones, not saved visitor progress.',
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
    introduction:
      'Find a course or journal entry by title, description, category, or tag.',
    empty: 'Enter a topic to search the local courses and journal.',
    noResults:
      'No matching entries. Try a broader topic or explore the world map.',
  },
  notFound: {
    label: 'A WILD 404 APPEARED!',
    title: 'This route is not on the map.',
    description: 'The trail ends here, but your learning journey does not.',
  },
} as const
