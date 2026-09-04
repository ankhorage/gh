import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { ProjectSnapshotEntry } from './ProjectSnapshotEntry.js';

export interface ProjectSnapshot {
  readonly projectPath: string;
  readonly config: RepositoryManifest;
  readonly entries: readonly ProjectSnapshotEntry[];
}
