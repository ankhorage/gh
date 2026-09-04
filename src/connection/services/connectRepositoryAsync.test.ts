import { expect, test } from 'bun:test';

import { connectRepositoryAsync } from './connectRepositoryAsync.js';

test('rejects a GitHub repository manifest whose canonical URL does not match identity', async () => {
  const result = await connectRepositoryAsync({
    repository: {
      provider: 'github',
      owner: 'ankhorage',
      name: 'demo',
      url: 'https://github.com/other/demo',
      defaultBranch: 'main',
    },
  });

  expect(result).toEqual({
    status: 'conflict',
    stage: 'manifest',
    code: 'repository-url-mismatch',
    message: 'Repository URL must match https://github.com/ankhorage/demo.',
    repository: {
      provider: 'github',
      owner: 'ankhorage',
      name: 'demo',
      url: 'https://github.com/other/demo',
      defaultBranch: 'main',
    },
  });
});
