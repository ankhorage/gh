import type { AppManifest } from '@ankhorage/contracts';

import type { ProjectSnapshotEntry } from './ProjectSnapshotEntry.js';

export interface ProjectSnapshot {
  readonly projectPath: string;
  readonly manifest: AppManifest;
  readonly entries: readonly ProjectSnapshotEntry[];
}
