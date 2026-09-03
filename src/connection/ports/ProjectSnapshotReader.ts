import type { GitHubRepositoryConfig } from '../definitions/GitHubRepositoryConfig.js';
import type { ProjectSnapshot } from '../definitions/ProjectSnapshot.js';

export interface ProjectSnapshotReader {
  readAsync(projectPath: string, configOverride: GitHubRepositoryConfig): Promise<ProjectSnapshot>;
}
