import { expect, test } from 'bun:test';

import * as packageApi from './index.js';

test('exports only the intentional public API', () => {
  expect(Object.keys(packageApi).sort()).toEqual(['connectGitHubRepositoryAsync']);
});
