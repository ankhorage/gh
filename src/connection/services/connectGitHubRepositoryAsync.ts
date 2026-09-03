import { createGhCliGitHubRepositoryGateway } from '../adapters/createGhCliGitHubRepositoryGateway.js';
import { createGitHubRepositoryConfigStore } from '../adapters/createGitHubRepositoryConfigStore.js';
import { createLocalProjectSnapshotReader } from '../adapters/createLocalProjectSnapshotReader.js';
import type {
  GitHubRepositoryConnectionDependencies,
  GitHubRepositoryConnectionOptions,
} from '../definitions/GitHubRepositoryConnectionOptions.js';
import type {
  GitHubRepositoryConnectionFailure,
  GitHubRepositoryConnectionIdentity,
  GitHubRepositoryConnectionResult,
} from '../definitions/GitHubRepositoryConnectionResult.js';
import type { ProjectSnapshot } from '../definitions/ProjectSnapshot.js';
import type {
  GitHubRemoteRepository,
  GitHubRepositoryGateway,
  GitHubRepositoryTarget,
} from '../ports/GitHubRepositoryGateway.js';
import type { RepositoryConfigStore } from '../ports/RepositoryConfigStore.js';
import {
  inspectGitHubRepositoryPreflightAsync,
  PreflightError,
} from './inspectGitHubRepositoryPreflightAsync.js';
import { publishGitHubProjectSnapshotAsync } from './publishGitHubProjectSnapshotAsync.js';

/** Connect a standalone app to GitHub and publish its complete snapshot on `main`. */
export async function connectGitHubRepositoryAsync(
  options: GitHubRepositoryConnectionOptions = {},
  dependencies: GitHubRepositoryConnectionDependencies = {},
): Promise<GitHubRepositoryConnectionResult> {
  const gateway = dependencies.gateway ?? createGhCliGitHubRepositoryGateway();
  const snapshotReader = dependencies.snapshotReader ?? createLocalProjectSnapshotReader();
  const configStore = dependencies.configStore ?? createGitHubRepositoryConfigStore();
  let preflight;
  try {
    preflight = await inspectGitHubRepositoryPreflightAsync(
      options,
      gateway,
      snapshotReader,
      configStore,
    );
  } catch (error) {
    return toFailure(error, 'preflight');
  }
  const { target, identity, remote, snapshot } = preflight;
  const existing = await finishAlreadyConnectedAsync(gateway, target, identity, remote);
  if (existing) return existing;
  try {
    return await publishConnectionAsync(
      gateway,
      configStore,
      options.projectPath ?? process.cwd(),
      target,
      identity,
      remote,
      snapshot,
    );
  } catch (error) {
    return toFailure(error, 'publish', identity);
  }
}

/** Finish an idempotent connection and clean up its recognized bootstrap ref. */
async function finishAlreadyConnectedAsync(
  gateway: GitHubRepositoryGateway,
  target: GitHubRepositoryTarget,
  identity: GitHubRepositoryConnectionIdentity,
  remote: GitHubRemoteRepository,
): Promise<GitHubRepositoryConnectionResult | undefined> {
  if (
    !remote.mainConfig ||
    !remote.mainCommitSha ||
    remote.mainConfig.owner !== identity.owner ||
    remote.mainConfig.name !== identity.name
  ) {
    return undefined;
  }
  if (remote.bootstrapCommitSha) {
    await gateway.deleteBootstrapAsync(target, {
      branch: 'ankh-bootstrap',
      commitSha: remote.bootstrapCommitSha,
    });
  }
  return {
    status: 'already-connected',
    repository: identity,
    appCommitSha: remote.mainCommitSha,
  };
}

/** Persist the connection and publish the complete snapshot. */
async function publishConnectionAsync(
  gateway: GitHubRepositoryGateway,
  configStore: RepositoryConfigStore,
  projectPath: string,
  target: GitHubRepositoryTarget,
  identity: GitHubRepositoryConnectionIdentity,
  remote: GitHubRemoteRepository,
  snapshot: ProjectSnapshot,
): Promise<GitHubRepositoryConnectionResult> {
  await configStore.updateRepositoryAsync(projectPath, identity);
  if (!remote.exists) await gateway.createRepositoryAsync(target);
  const publication = await publishGitHubProjectSnapshotAsync(
    gateway,
    target,
    snapshot,
    remote.bootstrapCommitSha,
  );
  return { status: 'connected', repository: identity, appCommitSha: publication.commitSha };
}

/** Convert provider and validation errors into a stable public failure result. */
function toFailure(
  error: unknown,
  stage: string,
  repository?: { owner: string; name: string; url: string; defaultBranch: 'main' },
): GitHubRepositoryConnectionFailure {
  if (error instanceof PreflightError && error.kind === 'conflict') {
    return { status: 'conflict', stage, code: error.code, message: error.message, repository };
  }
  return {
    status: 'recoverable-failure',
    stage,
    code: error instanceof PreflightError ? error.code : 'operation-failed',
    message: error instanceof Error ? error.message : 'GitHub connection failed.',
    repository,
  };
}
