import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { GitHubRepositoryVisibility } from '../definitions/GitHubRepositoryVisibility.js';
import type { ProjectSnapshot } from '../definitions/ProjectSnapshot.js';

export interface GitHubRepositoryTarget {
  readonly owner: string;
  readonly name: string;
  readonly visibility: GitHubRepositoryVisibility;
  readonly url: string;
  readonly defaultBranch: 'main';
}

export interface GitHubRemoteRepository {
  readonly exists: boolean;
  readonly owner: string;
  readonly name: string;
  readonly url: string;
  readonly visibility?: GitHubRepositoryVisibility;
  readonly defaultBranch?: string;
  readonly mainCommitSha?: string;
  readonly mainConfig?: RepositoryManifest;
  readonly bootstrapCommitSha?: string;
  readonly bootstrapMarker?: string;
}

export interface GitHubBootstrap {
  readonly commitSha: string;
  readonly branch: 'ankh-bootstrap';
}

export interface GitHubPublishedSnapshot {
  readonly commitSha: string;
}

export interface GitHubRepositoryGateway {
  assertAvailableAsync(): Promise<void>;
  assertAuthenticatedAsync(): Promise<void>;
  getAuthenticatedOwnerAsync(): Promise<string>;
  inspectRepositoryAsync(target: GitHubRepositoryTarget): Promise<GitHubRemoteRepository>;
  createRepositoryAsync(target: GitHubRepositoryTarget): Promise<void>;
  initializeBootstrapAsync(target: GitHubRepositoryTarget): Promise<GitHubBootstrap>;
  publishSnapshotAsync(
    target: GitHubRepositoryTarget,
    snapshot: ProjectSnapshot,
    parentCommitSha: string,
  ): Promise<GitHubPublishedSnapshot>;
  verifyPublishedSnapshotAsync(
    target: GitHubRepositoryTarget,
    snapshot: ProjectSnapshot,
    commitSha: string,
  ): Promise<void>;
  setDefaultBranchAsync(target: GitHubRepositoryTarget): Promise<void>;
  deleteBootstrapAsync(target: GitHubRepositoryTarget, bootstrap: GitHubBootstrap): Promise<void>;
}
