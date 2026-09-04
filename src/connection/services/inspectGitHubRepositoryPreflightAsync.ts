import { basename, resolve } from 'node:path';

import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type {
  GitHubRepositoryConnectionIdentity,
  GitHubRepositoryConnectionOptions,
} from '../definitions/index.js';
import type { ProjectSnapshot } from '../definitions/ProjectSnapshot.js';
import type {
  GitHubRemoteRepository,
  GitHubRepositoryGateway,
  GitHubRepositoryTarget,
} from '../ports/GitHubRepositoryGateway.js';
import type { ProjectSnapshotReader } from '../ports/ProjectSnapshotReader.js';
import type { RepositoryManifestStore } from '../ports/RepositoryManifestStore.js';

export interface GitHubRepositoryPreflight {
  readonly target: GitHubRepositoryTarget;
  readonly identity: GitHubRepositoryConnectionIdentity;
  readonly config?: RepositoryManifest;
  readonly snapshot: ProjectSnapshot;
  readonly remote: GitHubRemoteRepository;
}

/** Inspect all local and remote state before allowing a repository mutation. */
export async function inspectGitHubRepositoryPreflightAsync(
  options: GitHubRepositoryConnectionOptions,
  gateway: GitHubRepositoryGateway,
  snapshotReader: ProjectSnapshotReader,
  configStore: RepositoryManifestStore,
): Promise<GitHubRepositoryPreflight> {
  const projectPath = options.projectPath ?? process.cwd();
  await gateway.assertAvailableAsync();
  await gateway.assertAuthenticatedAsync();
  const config = await configStore.readConfigAsync(projectPath);
  const owner = options.owner ?? (await gateway.getAuthenticatedOwnerAsync());
  const name = options.name ?? config?.name ?? getDefaultRepositoryName(projectPath);
  validateName(owner, name);
  const visibility = options.visibility ?? 'private';
  const identity = {
    owner,
    name,
    url: `https://github.com/${owner}/${name}`,
    defaultBranch: 'main' as const,
  };
  if (config && !matchesIdentity(config, identity)) {
    throw new PreflightError(
      'conflict',
      'repository-mismatch',
      'Local repository config does not match the requested target.',
    );
  }
  const prospectiveConfig: RepositoryManifest = { provider: 'github', ...identity };
  const snapshot = await snapshotReader.readAsync(projectPath, prospectiveConfig);
  const target: GitHubRepositoryTarget = { ...identity, visibility };
  const remote = await gateway.inspectRepositoryAsync(target);
  validateRemoteState(remote, config, identity, visibility);
  return { target, identity, config, snapshot, remote };
}

export class PreflightError extends Error {
  readonly kind: 'conflict' | 'recoverable-failure';
  readonly code: string;

  constructor(kind: 'conflict' | 'recoverable-failure', code: string, message: string) {
    super(message);
    this.name = 'PreflightError';
    this.kind = kind;
    this.code = code;
  }
}

/** Validate GitHub owner and repository names without invoking the provider. */
function validateName(owner: string, name: string): void {
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,98}[A-Za-z0-9])?$/u.test(owner)) {
    throw new PreflightError('conflict', 'invalid-owner', 'GitHub owner is invalid.');
  }
  if (!/^[A-Za-z0-9._-]{1,100}$/u.test(name) || name === '.' || name === '..') {
    throw new PreflightError('conflict', 'invalid-name', 'GitHub repository name is invalid.');
  }
}

/** Compare only the canonical identity fields persisted in gh config. */
function matchesIdentity(
  repository: RepositoryManifest | undefined,
  identity: GitHubRepositoryConnectionIdentity,
): boolean {
  return (
    repository?.provider === 'github' &&
    repository.owner === identity.owner &&
    repository.name === identity.name &&
    repository.url === identity.url
  );
}

/** Reject remote state that cannot be safely resumed or connected. */
function validateRemoteState(
  remote: GitHubRemoteRepository,
  config: RepositoryManifest | undefined,
  identity: GitHubRepositoryConnectionIdentity,
  visibility: GitHubRepositoryTarget['visibility'],
): void {
  if (remote.exists && !config) {
    throw new PreflightError(
      'conflict',
      'local-config-missing',
      'An existing repository cannot be adopted without a matching local config.',
    );
  }
  if (remote.exists && remote.visibility !== undefined && remote.visibility !== visibility) {
    throw new PreflightError(
      'conflict',
      'visibility-mismatch',
      'The existing repository has different visibility.',
    );
  }
  if (remote.exists && remote.mainConfig !== undefined) {
    if (!matchesIdentity(remote.mainConfig, identity)) {
      throw new PreflightError(
        'conflict',
        'remote-config-mismatch',
        'The remote gh config points to another repository.',
      );
    }
  }
}

/** Derive a stable repository name for projects without gh configuration. */
function getDefaultRepositoryName(projectPath: string): string {
  return basename(resolve(projectPath));
}
