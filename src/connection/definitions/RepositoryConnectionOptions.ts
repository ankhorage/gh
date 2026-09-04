import type { RepositoryManifest } from '@ankhorage/contracts/repository';

export type RepositoryVisibility = 'private' | 'public';

export interface RepositoryConnectionOptions {
  readonly repository: RepositoryManifest;
  readonly projectPath?: string;
  readonly visibility?: RepositoryVisibility;
}
