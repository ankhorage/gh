import type { AppManifest } from '@ankhorage/contracts';

import type { ProjectSnapshot } from '../definitions/ProjectSnapshot.js';

export interface ProjectSnapshotReader {
  readAsync(projectPath: string, manifestOverride: AppManifest): Promise<ProjectSnapshot>;
}
