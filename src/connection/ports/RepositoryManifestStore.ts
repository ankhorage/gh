import type { RepositoryManifest } from '@ankhorage/contracts/repository';

export interface RepositoryManifestStore {
  readConfigAsync(projectPath: string): Promise<RepositoryManifest | undefined>;
  updateRepositoryAsync(projectPath: string, repository: RepositoryManifest): Promise<void>;
}
