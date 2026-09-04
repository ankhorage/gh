import type { RepositoryManifest } from '@ankhorage/contracts/repository';

export type RepositoryConnectionStatus = 'connected' | 'already-connected';

interface RepositoryConnectionSuccess {
  readonly status: RepositoryConnectionStatus;
  readonly repository: RepositoryManifest;
  readonly appCommitSha?: string;
}

export interface RepositoryConnectionFailure {
  readonly status: 'recoverable-failure' | 'conflict';
  readonly stage: string;
  readonly code: string;
  readonly message: string;
  readonly repository?: RepositoryManifest;
}

export type RepositoryConnectionResult = RepositoryConnectionSuccess | RepositoryConnectionFailure;
