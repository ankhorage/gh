import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { ProjectSnapshot } from '../definitions/ProjectSnapshot.js';

export interface ProjectSnapshotReader {
  readAsync(projectPath: string, configOverride: RepositoryManifest): Promise<ProjectSnapshot>;
}
