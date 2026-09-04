import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { GitHubRepositoryConnectionIdentity } from '../definitions/GitHubRepositoryConnectionResult.js';

export interface RepositoryManifestStore {
  readConfigAsync(projectPath: string): Promise<RepositoryManifest | undefined>;
  updateRepositoryAsync(
    projectPath: string,
    repository: GitHubRepositoryConnectionIdentity,
  ): Promise<void>;
}
