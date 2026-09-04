import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { RepositoryManifestStore } from '../ports/RepositoryManifestStore.js';

const MANIFEST_DIRECTORY = '.ankhorage';
const MANIFEST_FILE_NAME = 'repository.json';

/*** Create the atomic local store for the project repository manifest slice. */
export function createLocalRepositoryManifestStore(): RepositoryManifestStore {
  return { readConfigAsync, updateRepositoryAsync };
}

/*** Read the repository manifest, treating an absent file as an unconfigured project. */
async function readConfigAsync(projectPath: string): Promise<RepositoryManifest | undefined> {
  const manifestPath = getManifestPath(projectPath);
  try {
    const parsed: unknown = JSON.parse(await readFile(manifestPath, 'utf8'));
    if (!isRepositoryManifest(parsed)) throw new Error(`Invalid ${getRelativeManifestPath()}.`);
    return parsed;
  } catch (error) {
    if (isMissingFile(error)) return undefined;
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid ${getRelativeManifestPath()}: invalid JSON.`, { cause: error });
    }
    throw new Error(`Unable to read ${getRelativeManifestPath()}: ${getErrorMessage(error)}`, {
      cause: error,
    });
  }
}

/*** Atomically persist only the repository manifest slice. */
async function updateRepositoryAsync(
  projectPath: string,
  repository: RepositoryManifest,
): Promise<void> {
  const directory = join(projectPath, MANIFEST_DIRECTORY);
  const manifestPath = getManifestPath(projectPath);
  const tempPath = `${manifestPath}.tmp`;
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(tempPath, `${JSON.stringify(repository, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  try {
    await rename(tempPath, manifestPath);
  } catch (error) {
    throw new Error(`Unable to update ${getRelativeManifestPath()}: ${getErrorMessage(error)}`, {
      cause: error,
    });
  }
}

/*** Build the canonical project-local repository manifest path. */
function getManifestPath(projectPath: string): string {
  return join(projectPath, MANIFEST_DIRECTORY, MANIFEST_FILE_NAME);
}

/*** Return the manifest path used in user-facing errors. */
function getRelativeManifestPath(): string {
  return `${MANIFEST_DIRECTORY}/${MANIFEST_FILE_NAME}`;
}

/*** Validate the intentionally small repository manifest shape. */
function isRepositoryManifest(value: unknown): value is RepositoryManifest {
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
