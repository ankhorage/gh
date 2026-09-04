import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { GitHubRepositoryConnectionIdentity } from '../definitions/GitHubRepositoryConnectionResult.js';
import type { RepositoryManifestStore } from '../ports/RepositoryManifestStore.js';

const CONFIG_DIRECTORY = '.ankhorage';
const CONFIG_FILE_NAME = 'gh.json';

/** Create the atomic store for gh's project-local configuration. */
export function createGitHubRepositoryManifestStore(): RepositoryManifestStore {
  return { readConfigAsync, updateRepositoryAsync };
}

/** Read gh configuration, treating an absent file as an unconfigured project. */
async function readConfigAsync(projectPath: string): Promise<RepositoryManifest | undefined> {
  const configPath = getConfigPath(projectPath);
  try {
    const parsed: unknown = JSON.parse(await readFile(configPath, 'utf8'));
    if (!isConfig(parsed)) throw new Error(`Invalid ${getRelativeConfigPath()}.`);
    return parsed;
  } catch (error) {
    if (isMissingFile(error)) return undefined;
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid ${getRelativeConfigPath()}: invalid JSON.`, { cause: error });
    }
    throw new Error(`Unable to read ${getRelativeConfigPath()}: ${getErrorMessage(error)}`, {
      cause: error,
    });
  }
}

/** Atomically persist only gh's repository identity. */
async function updateRepositoryAsync(
  projectPath: string,
  repository: GitHubRepositoryConnectionIdentity,
): Promise<void> {
  const directory = join(projectPath, CONFIG_DIRECTORY);
  const configPath = getConfigPath(projectPath);
  const tempPath = `${configPath}.tmp`;
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(tempPath, `${JSON.stringify(repository, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  try {
    await rename(tempPath, configPath);
  } catch (error) {
    throw new Error(`Unable to update ${getRelativeConfigPath()}: ${getErrorMessage(error)}`, {
      cause: error,
    });
  }
}

/** Build the canonical project-local gh configuration path. */
function getConfigPath(projectPath: string): string {
  return join(projectPath, CONFIG_DIRECTORY, CONFIG_FILE_NAME);
}

/** Return the config path used in user-facing errors. */
function getRelativeConfigPath(): string {
  return `${CONFIG_DIRECTORY}/${CONFIG_FILE_NAME}`;
}

/** Validate the intentionally small gh-owned configuration shape. */
function isConfig(value: unknown): value is RepositoryManifest {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<RepositoryManifest>;
  return (
    candidate.provider === 'github' &&
    typeof candidate.owner === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.url === 'string' &&
    candidate.defaultBranch === 'main'
  );
}

/** Identify an absent configuration file without hiding other filesystem failures. */
function isMissingFile(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

/** Convert unknown filesystem failures to safe messages. */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'unknown filesystem error';
}
