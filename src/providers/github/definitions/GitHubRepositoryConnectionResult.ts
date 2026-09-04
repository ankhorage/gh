export type GitHubRepositoryConnectionStatus = 'connected' | 'already-connected';

export interface GitHubRepositoryConnectionIdentity {
  readonly owner: string;
  readonly name: string;
  readonly url: string;
  readonly defaultBranch: 'main';
}

interface GitHubRepositoryConnectionSuccess {
  readonly status: GitHubRepositoryConnectionStatus;
  readonly repository: GitHubRepositoryConnectionIdentity;
  readonly appCommitSha?: string;
}

type GitHubRepositoryConnectionFailureKind = 'recoverable-failure' | 'conflict';

export interface GitHubRepositoryConnectionFailure {
  readonly status: GitHubRepositoryConnectionFailureKind;
  readonly stage: string;
  readonly code: string;
  readonly message: string;
  readonly repository?: GitHubRepositoryConnectionIdentity;
}

export type GitHubRepositoryConnectionResult =
  GitHubRepositoryConnectionSuccess | GitHubRepositoryConnectionFailure;
