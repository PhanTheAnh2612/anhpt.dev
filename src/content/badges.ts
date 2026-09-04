export type Badge = {
  name: string
  description: string
  state: 'Earned' | 'Locked'
}

export const badges: ReadonlyArray<Badge> = [
  {
    name: 'Rookie Compass',
    description: 'Found a dependable path through the fundamentals.',
    state: 'Earned',
  },
  {
    name: 'Explorer Sun',
    description: 'Learned beyond the marked trail.',
    state: 'Earned',
  },
  {
    name: 'Component Crystal',
    description: 'Built reusable interfaces with clear boundaries.',
    state: 'Earned',
  },
  {
    name: 'Quality Guardian',
    description: 'Protected accessibility, performance, and maintainability.',
    state: 'Earned',
  },
  {
    name: 'API Architect',
    description: 'Next challenge: design a clear, dependable API.',
    state: 'Locked',
  },
  {
    name: 'Data Keeper',
    description: 'Next challenge: model and safely evolve a database.',
    state: 'Locked',
  },
  {
    name: 'Launch Beacon',
    description:
      'Next challenge: take a website from development to production.',
    state: 'Locked',
  },
  {
    name: 'System Pathfinder',
    description: 'Next challenge: explain a reliable system and its tradeoffs.',
    state: 'Locked',
  },
]
