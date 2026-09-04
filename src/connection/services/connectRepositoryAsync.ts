import type { RepositoryManifest } from '@ankhorage/contracts/repository';

import type { RepositoryConnectionOptions } from '../definitions/RepositoryConnectionOptions.js';
import type {
  RepositoryConnectionFailure,
  RepositoryConnectionResult,
} from '../definitions/RepositoryConnectionResult.js';
import type {
  GitHubRepositoryConnectionFailure,
  GitHubRepositoryConnectionResult,
} from '../definitions/GitHubRepositoryConnectionResult.js';
import { connectGitHubRepositoryAsync } from './connectGitHubRepositoryAsync.js';

/*** Add the provider discriminant to the canonical repository identity returned by GitHub. */
function toRepositoryManifest(repository: {
  owner: string;
  name: string;
  url: string;
  defaultBranch: 'main';
}): RepositoryManifest {
  return { provider: 'github', ...repository };
}

/*** Identify the failure branch of the GitHub adapter result union. */
function isGitHubRepositoryConnectionFailure(
  result: GitHubRepositoryConnectionResult,
): result is GitHubRepositoryConnectionFailure {
  return result.status === 'recoverable-failure' || result.status === 'conflict';
}

/*** Convert the current GitHub adapter result into the provider-neutral repository result. */
function toRepositoryConnectionResult(
  result: GitHubRepositoryConnectionResult,
): RepositoryConnectionResult {
  if (isGitHubRepositoryConnectionFailure(result)) {
    return {
      status: result.status,
      stage: result.stage,
      code: result.code,
      message: result.message,
      ...(result.repository === undefined
        ? {}
        : { repository: toRepositoryManifest(result.repository) }),
    };
  }

  return {
    status: result.status,
    repository: toRepositoryManifest(result.repository),
    ...(result.appCommitSha === undefined ? {} : { appCommitSha: result.appCommitSha }),
  };
}

/*** Validate provider-specific identity fields before any repository side effect occurs. */
function validateRepositoryManifest(
  repository: RepositoryManifest,
): RepositoryConnectionFailure | null {
  const expectedUrl = `https://github.com/${repository.owner}/${repository.name}`;
  if (repository.url === expectedUrl) return null;

  return {
    status: 'conflict',
    stage: 'manifest',
    code: 'repository-url-mismatch',
    message: `Repository URL must match ${expectedUrl}.`,
    repository,
  };
}

/*** Connect the app project repository using only the standalone `RepositoryManifest` slice. */
export async function connectRepositoryAsync(
  options: RepositoryConnectionOptions,
): Promise<RepositoryConnectionResult> {
  const invalidManifest = validateRepositoryManifest(options.repository);
  if (invalidManifest) return invalidManifest;

  const result = await connectGitHubRepositoryAsync({
    ...(options.projectPath === undefined ? {} : { projectPath: options.projectPath }),
    owner: options.repository.owner,
    name: options.repository.name,
    ...(options.visibility === undefined ? {} : { visibility: options.visibility }),
  });
  return toRepositoryConnectionResult(result);
}
