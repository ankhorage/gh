import type { GitHubRepositoryConfig } from './GitHubRepositoryConfig.js';
import type { ProjectSnapshotEntry } from './ProjectSnapshotEntry.js';

export interface ProjectSnapshot {
  readonly projectPath: string;
  readonly config: GitHubRepositoryConfig;
  readonly entries: readonly ProjectSnapshotEntry[];
}
