import type { GitHubRepositoryVisibility } from '../../../../connection/definitions/GitHubRepositoryVisibility.js';

export interface ConnectCommandOptions {
  readonly projectPath?: string;
  readonly owner?: string;
  readonly name?: string;
  readonly visibility: GitHubRepositoryVisibility;
}
