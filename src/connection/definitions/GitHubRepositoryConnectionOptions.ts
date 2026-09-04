import type { GitHubRepositoryGateway } from '../ports/GitHubRepositoryGateway.js';
import type { ProjectSnapshotReader } from '../ports/ProjectSnapshotReader.js';
import type { RepositoryManifestStore } from '../ports/RepositoryManifestStore.js';
import type { GitHubRepositoryVisibility } from './GitHubRepositoryVisibility.js';

export interface GitHubRepositoryConnectionOptions {
  readonly projectPath?: string;
  readonly owner?: string;
  readonly name?: string;
  readonly visibility?: GitHubRepositoryVisibility;
}

export interface GitHubRepositoryConnectionDependencies {
  readonly gateway?: GitHubRepositoryGateway;
  readonly snapshotReader?: ProjectSnapshotReader;
  readonly configStore?: RepositoryManifestStore;
}
