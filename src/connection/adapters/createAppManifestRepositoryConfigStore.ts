import { readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { type AppManifest, parseAppManifest } from '@ankhorage/contracts';

import type { GitHubRepositoryConnectionIdentity } from '../definitions/GitHubRepositoryConnectionResult.js';
import type { RepositoryConfigStore } from '../ports/RepositoryConfigStore.js';

const CONFIG_FILE_NAME = 'ankh.config.json';

/** Create the atomic store for a standalone app's canonical manifest. */
export function createAppManifestRepositoryConfigStore(): RepositoryConfigStore {
  return {
    readManifestAsync,
    updateRepositoryAsync,
  };
}

/** Read and validate the canonical app manifest from disk. */
async function readManifestAsync(projectPath: string): Promise<AppManifest> {
  const configPath = join(projectPath, CONFIG_FILE_NAME);
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(configPath, 'utf8')) as unknown;
  } catch (error) {
    throw new Error(`Unable to read ${CONFIG_FILE_NAME}: ${getErrorMessage(error)}`, {
      cause: error,
    });
  }
  const result = parseAppManifest(parsed);
  if (!result.ok) {
    throw new Error(`Invalid ${CONFIG_FILE_NAME}: ${result.message}`);
  }
  return result.manifest;
}

/** Atomically update only the repository section of the canonical manifest. */
async function updateRepositoryAsync(
  projectPath: string,
  repository: GitHubRepositoryConnectionIdentity,
): Promise<void> {
  const configPath = join(projectPath, CONFIG_FILE_NAME);
  const manifest = await readManifestAsync(projectPath);
  const nextManifest: AppManifest = {
    ...manifest,
    repository: { provider: 'github', ...repository },
  };
  const tempPath = `${configPath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(nextManifest, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  try {
    await rename(tempPath, configPath);
  } catch (error) {
    try {
      await writeFile(tempPath, '', 'utf8');
    } catch {
      // The original error is the useful failure for callers.
    }
    throw new Error(`Unable to update ${CONFIG_FILE_NAME}: ${getErrorMessage(error)}`, {
      cause: error,
    });
  }
}

/** Convert unknown filesystem failures to safe messages without exposing file contents. */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'unknown filesystem error';
}
