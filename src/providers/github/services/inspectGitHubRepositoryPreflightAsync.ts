import { basename, resolve } from 'node:path';

import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { ProjectSnapshot } from '../../../connection/definitions/ProjectSnapshot.js';
import type { ProjectSnapshotReader } from '../../../connection/ports/ProjectSnapshotReader.js';
import type { RepositoryManifestStore } from '../../../connection/ports/RepositoryManifestStore.js';
import type {
  GitHubRepositoryConnectionIdentity,
  GitHubRepositoryConnectionOptions,
} from '../definitions/index.js';
import type {
  GitHubRemoteRepository,
  GitHubRepositoryGateway,
  GitHubRepositoryTarget,
} from '../ports/GitHubRepositoryGateway.js';

export interface GitHubRepositoryPreflight {
  readonly target: GitHubRepositoryTarget;
  readonly identity: GitHubRepositoryConnectionIdentity;
  readonly manifest?: RepositoryManifest;
  readonly snapshot: ProjectSnapshot;
  readonly remote: GitHubRemoteRepository;
}

/** Inspect all local and remote state before allowing a repository mutation. */
export async function inspectGitHubRepositoryPreflightAsync(
  options: GitHubRepositoryConnectionOptions,
  gateway: GitHubRepositoryGateway,
  snapshotReader: ProjectSnapshotReader,
  manifestStore: RepositoryManifestStore,
): Promise<GitHubRepositoryPreflight> {
  const projectPath = options.projectPath ?? process.cwd();
  await gateway.assertAvailableAsync();
  await gateway.assertAuthenticatedAsync();
  const manifest = await manifestStore.readConfigAsync(projectPath);
  const owner = options.owner ?? (await gateway.getAuthenticatedOwnerAsync());
  const name = options.name ?? manifest?.name ?? getDefaultRepositoryName(projectPath);
  validateName(owner, name);
  const visibility = options.visibility ?? 'private';
  const identity = {
    owner,
    name,
    url: `https://github.com/${owner}/${name}`,
    defaultBranch: 'main' as const,
  };
  if (manifest && !matchesIdentity(manifest, identity)) {
    throw new PreflightError(
      'conflict',
      'repository-mismatch',
      'Local repository manifest does not match the requested target.',
    );
  }
  const prospectiveManifest: RepositoryManifest = { provider: 'github', ...identity };
  const snapshot = await snapshotReader.readAsync(projectPath, prospectiveManifest);
  const target: GitHubRepositoryTarget = { ...identity, visibility };
  const remote = await gateway.inspectRepositoryAsync(target);
  validateRemoteState(remote, manifest, identity, visibility);
  return { target, identity, manifest, snapshot, remote };
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

/** Compare only the canonical identity fields persisted in the repository manifest. */
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
  manifest: RepositoryManifest | undefined,
  identity: GitHubRepositoryConnectionIdentity,
  visibility: GitHubRepositoryTarget['visibility'],
): void {
  if (remote.exists && !manifest) {
    throw new PreflightError(
      'conflict',
      'local-manifest-missing',
      'An existing repository cannot be adopted without a matching local manifest.',
    );
  }
  if (remote.exists && remote.visibility !== undefined && remote.visibility !== visibility) {
    throw new PreflightError(
      'conflict',
      'visibility-mismatch',
      'The existing repository has different visibility.',
    );
  }
  if (remote.exists && remote.mainManifest !== undefined) {
    if (!matchesIdentity(remote.mainManifest, identity)) {
      throw new PreflightError(
        'conflict',
        'remote-manifest-mismatch',
        'The remote repository manifest points to another repository.',
      );
    }
  }
}

/** Derive a stable repository name for projects without a repository manifest. */
function getDefaultRepositoryName(projectPath: string): string {
  return basename(resolve(projectPath));
}
