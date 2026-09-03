import type { GitHubRepositoryConfig } from '../definitions/GitHubRepositoryConfig.js';
import type { GitHubRepositoryConnectionIdentity } from '../definitions/GitHubRepositoryConnectionResult.js';

export interface RepositoryConfigStore {
  readConfigAsync(projectPath: string): Promise<GitHubRepositoryConfig>;
  updateRepositoryAsync(
    projectPath: string,
    repository: GitHubRepositoryConnectionIdentity,
  ): Promise<void>;
}
