export type MasteryChallenges = {
  challenges: ReadonlyArray<{ title: string; description: string }>
  reward: string
}

export const masteryChallenges: Readonly<Record<string, MasteryChallenges>> = {
  'typescript-and-fetch': {
    challenges: [
      {
        title: 'Model the hotel flow',
        description:
          'Define room and reservation types, then compile with no unchecked property access in the request path.',
      },
      {
        title: 'Exercise every response',
        description:
          'Show useful loading, empty, success, validation, and offline outcomes without losing the entered reservation.',
      },
      {
        title: 'Explain the trust boundary',
        description:
          'Identify which browser checks help the guest and which rules the API must repeat.',
      },
    ],
    reward:
      'A responsive hotel form whose browser behavior and network boundary you can explain.',
  },
  'react-api-states': {
    challenges: [
      {
        title: 'Compose the dashboard',
        description:
          'Use owned shadcn/ui primitives to render rooms, an empty reservation list, and a labelled booking form.',
      },
      {
        title: 'Connect the API',
        description:
          'Create a reservation, reload server data, and preserve input when the API reports a room conflict.',
      },
      {
        title: 'Test like a receptionist',
        description:
          'Complete the flow with a keyboard at 390 pixels wide and verify each asynchronous state is understandable.',
      },
    ],
    reward:
      'A small React front desk interface built from shadcn/ui source you can inspect and adapt.',
  },
  'nestjs-tests-configuration': {
    challenges: [
      {
        title: 'Expose the hotel boundary',
        description:
          'Implement room reads, reservation creation, and named stay transitions with controllers delegating to services.',
      },
      {
        title: 'Reject invalid stays',
        description:
          'Prove invalid dates, unknown rooms, overlaps, and impossible status transitions return stable HTTP errors.',
      },
      {
        title: 'Reproduce from configuration',
        description:
          'Start and test the API from a clean checkout using only committed files plus values documented in .env.example.',
      },
    ],
    reward:
      'A tested NestJS API whose module boundaries and reservation rules remain clear.',
  },
  'sqlite-migrations-backups': {
    challenges: [
      {
        title: 'Build from zero',
        description:
          'Apply every migration to a new SQLite file and verify constraints reject an invalid stay.',
      },
      {
        title: 'Persist safe queries',
        description:
          'Create and read a reservation with prepared statements, including a guest name containing an apostrophe.',
      },
      {
        title: 'Prove the backup',
        description:
          'Restore a backup to another path and verify room and reservation records through the API.',
      },
    ],
    reward:
      'A reproducible SQLite schema and a restore procedure you have actually exercised.',
  },
  'release-operations': {
    challenges: [
      {
        title: 'Reproduce the repository',
        description:
          'Clone from GitHub, install with the lockfile, apply migrations, and pass every check using the README alone.',
      },
      {
        title: 'Verify the Cloudflare release',
        description:
          'Test the Pages frontend and D1-backed Worker API on mobile and desktop, including an overlapping booking.',
      },
      {
        title: 'Practice a failure',
        description:
          'Simulate an API failure and document the user message, privacy-safe log evidence, and rollback decision.',
      },
    ],
    reward:
      'A deployed Hotel Manager demo with a repeatable build, durable demo data, and an operational checklist.',
  },
}

export const defaultMasteryChallenges: MasteryChallenges = {
  challenges: [
    {
      title: 'Build the checkpoint',
      description:
        'Complete this lesson’s checkpoint in the Hotel Manager and keep the smallest working version.',
    },
    {
      title: 'Test the boundary',
      description:
        'Try the normal case, empty or missing input, and one realistic failure; record what the user observes.',
    },
    {
      title: 'Explain the decision',
      description:
        'Describe why the approach fits this small application and what would make you revisit it.',
    },
  ],
  reward: 'A working Hotel Manager increment and concise notes you can reuse.',
}
