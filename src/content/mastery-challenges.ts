export type MasteryChallenges = {
  challenges: ReadonlyArray<{ title: string; description: string }>
  reward: string
}

export const masteryChallenges: Readonly<Record<string, MasteryChallenges>> = {
  'frontend-foundations': {
    challenges: [
      {
        title: 'Build the smallest page',
        description:
          'Create a personal homepage with semantic headings, navigation, and a main content region before adding visual detail.',
      },
      {
        title: 'Test the foundations',
        description:
          'Use only the keyboard, then disable JavaScript. Check that the content and navigation still work at a narrow screen width.',
      },
      {
        title: 'Add one typed interaction',
        description:
          'Add a small TypeScript interaction and explain how it improves the page without hiding essential content.',
      },
    ],
    reward:
      'A responsive homepage with an accessible foundation you can keep extending.',
  },
  'react-interfaces': {
    challenges: [
      {
        title: 'Build a project filter',
        description:
          'Create a project list with a clearly labelled, keyboard-friendly filter. Keep the source list separate from the selected filter.',
      },
      {
        title: 'Derive the visible list',
        description:
          'Calculate matching projects during render instead of synchronizing a second list with an effect. Include an honest empty state.',
      },
      {
        title: 'Explain the state boundary',
        description:
          'Describe which component owns the filter, which props its children need, and how you would test the interaction.',
      },
    ],
    reward:
      'A small React interface whose state and accessibility choices you can explain.',
  },
  'nestjs-api': {
    challenges: [
      {
        title: 'Separate the responsibilities',
        description:
          'Build a tiny guestbook endpoint with HTTP handling in a controller and application decisions in a service.',
      },
      {
        title: 'Validate the boundary',
        description:
          'Try valid, missing, and malformed input. Return understandable errors without exposing internal details.',
      },
      {
        title: 'Connect the interface',
        description:
          'Read the endpoint from a React page and provide loading, empty, and error states.',
      },
    ],
    reward: 'A small API boundary that is clear enough to maintain and test.',
  },
  'postgres-basics': {
    challenges: [
      {
        title: 'Model a small record',
        description:
          'Create a projects or guestbook table with a primary key and constraints that express its essential rules.',
      },
      {
        title: 'Use safe queries',
        description:
          'Insert and retrieve records using parameterized queries. Verify that invalid records fail without changing valid data.',
      },
      {
        title: 'Plan a schema change',
        description:
          'Describe a small migration and how you would verify existing records remain usable afterward.',
      },
    ],
    reward:
      'A simple, durable data model with explicit rules and safe query boundaries.',
  },
  'deploy-your-site': {
    challenges: [
      {
        title: 'Reproduce the build',
        description:
          'Install and build the project from a clean checkout using the committed lockfile.',
      },
      {
        title: 'Check the public URL',
        description:
          'Verify HTTPS, asset loading, and direct links to nested pages on both mobile and desktop.',
      },
      {
        title: 'Write a release checklist',
        description:
          'Record which configuration is public, how secrets are supplied, and how to return to the previous working release.',
      },
    ],
    reward:
      'A repeatable release process and a website you know how to verify.',
  },
  'web-security': {
    challenges: [
      {
        title: 'Map the trust boundaries',
        description:
          'List where user input, identity, and stored data cross boundaries in your own website.',
      },
      {
        title: 'Test authorization',
        description:
          'In a local test environment, verify that one account cannot change another account’s data by changing a request identifier.',
      },
      {
        title: 'Explain the next defense',
        description:
          'Choose the highest-impact risk in your notes and explain the smallest concrete change that reduces it.',
      },
    ],
    reward:
      'A practical threat model and a clearer understanding of your application’s boundaries.',
  },
  'developer-tips': {
    challenges: [
      {
        title: 'Automate a repeatable check',
        description:
          'Add one command that runs the project checks you otherwise repeat by hand.',
      },
      {
        title: 'Reproduce a small bug',
        description:
          'Write down the smallest reproduction and use browser or terminal tools to test a specific explanation.',
      },
      {
        title: 'Leave useful notes',
        description:
          'Create a short release checklist that another developer could follow without relying on your memory.',
      },
    ],
    reward: 'A calmer daily workflow with checks and notes you can reuse.',
  },
  'system-design-foundations': {
    challenges: [
      {
        title: 'Start with requirements',
        description:
          'Describe the users, data, constraints, and failure modes of the website you built.',
      },
      {
        title: 'Draw the smallest architecture',
        description:
          'Show the browser, server, and storage boundaries. Explain one request from start to finish.',
      },
      {
        title: 'Discuss a tradeoff',
        description:
          'Choose a potential traffic or reliability problem and compare two responses before adding a new service.',
      },
    ],
    reward:
      'An architecture you can explain through requirements and tradeoffs, not just technology names.',
  },
}

export const defaultMasteryChallenges: MasteryChallenges = {
  challenges: [
    {
      title: 'Build the checkpoint',
      description:
        'Revisit this lesson’s checkpoint and make the smallest working version in your own project.',
    },
    {
      title: 'Check your assumptions',
      description:
        'Try a normal case, an empty case, and a failure case. Write down what you observe.',
    },
    {
      title: 'Explain the choice',
      description:
        'Describe why your approach works and one tradeoff you would revisit as the project grows.',
    },
  ],
  reward: 'A practical example and a set of notes you can return to.',
}
