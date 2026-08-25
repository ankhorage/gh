import { expect, test } from 'bun:test';

import * as packageApi from './index.js';

test('keeps the bootstrap public API intentionally empty', () => {
  expect(Object.keys(packageApi)).toEqual([]);
});
