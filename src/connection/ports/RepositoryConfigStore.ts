import type { AppManifest } from '@ankhorage/contracts';

import type { GitHubRepositoryConnectionIdentity } from '../definitions/GitHubRepositoryConnectionResult.js';

export interface RepositoryConfigStore {
  readManifestAsync(projectPath: string): Promise<AppManifest>;
  updateRepositoryAsync(
    projectPath: string,
    repository: GitHubRepositoryConnectionIdentity,
  ): Promise<void>;
}
