import type { RepositoryConfig } from '@ankhorage/contracts/repository';

import type { GitHubRepositoryConnectionIdentity } from '../definitions/GitHubRepositoryConnectionResult.js';

export interface RepositoryConfigStore {
  readConfigAsync(projectPath: string): Promise<RepositoryConfig | undefined>;
  updateRepositoryAsync(
    projectPath: string,
    repository: GitHubRepositoryConnectionIdentity,
  ): Promise<void>;
}
