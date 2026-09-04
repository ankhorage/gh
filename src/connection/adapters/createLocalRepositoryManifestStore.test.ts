import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { RepositoryManifest } from '@ankhorage/contracts/repository';
import { expect, test } from 'bun:test';

import { createLocalRepositoryManifestStore } from './createLocalRepositoryManifestStore.js';

test('persists the complete slice at the canonical repository manifest path', async () => {
  const projectPath = await mkdtemp(join(tmpdir(), 'repository-manifest-store-'));
  const repository: RepositoryManifest = {
    provider: 'github',
    owner: 'ankhorage',
    name: 'demo',
    url: 'https://github.com/ankhorage/demo',
    defaultBranch: 'main',
  };

  try {
    const store = createLocalRepositoryManifestStore();
    await store.updateRepositoryAsync(projectPath, repository);

    expect(await store.readConfigAsync(projectPath)).toEqual(repository);
    expect(
      JSON.parse(
        await readFile(join(projectPath, '.ankhorage', 'repository.json'), 'utf8'),
      ) as unknown,
    ).toEqual(repository);
  } finally {
    await rm(projectPath, { recursive: true, force: true });
  }
});
