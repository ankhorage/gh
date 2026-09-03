import type { RepositoryConfig } from '@ankhorage/contracts/repository';

import type { ProjectSnapshotEntry } from './ProjectSnapshotEntry.js';

export interface ProjectSnapshot {
  readonly projectPath: string;
  readonly config: RepositoryConfig;
  readonly entries: readonly ProjectSnapshotEntry[];
}
