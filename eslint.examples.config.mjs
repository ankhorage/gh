import { createConfig } from '@ankhorage/devtools/eslint';

const exampleFiles = ['examples/**/*.{ts,tsx}'];

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
  project: ['./tsconfig.eslint.json'],
  files: exampleFiles,
});
