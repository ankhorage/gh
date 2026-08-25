import { defineParadoxConfig } from '@ankhorage/paradox';

export default defineParadoxConfig({
  mode: 'write',
  docs: {
    title: '@ankhorage/gh',
    description:
      'Focused, typed GitHub integration for Ankhorage, powered by the local gh and git CLIs.',
  },
  package: {
    entrypoints: ['src/index.ts'],
  },
  output: {
    dir: 'paradox',
  },
});
