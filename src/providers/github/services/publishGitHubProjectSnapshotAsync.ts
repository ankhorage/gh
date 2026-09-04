import type { ProjectSnapshot } from '../../../connection/definitions/ProjectSnapshot.js';
import type {
  GitHubBootstrap,
  GitHubRepositoryGateway,
  GitHubRepositoryTarget,
} from '../ports/GitHubRepositoryGateway.js';

export interface GitHubSnapshotPublication {
  readonly commitSha: string;
}

/** Publish a complete snapshot through bootstrap, one app commit, and verified cleanup. */
export async function publishGitHubProjectSnapshotAsync(
  gateway: GitHubRepositoryGateway,
  target: GitHubRepositoryTarget,
  snapshot: ProjectSnapshot,
  existingBootstrapCommitSha?: string,
): Promise<GitHubSnapshotPublication> {
  const bootstrap: GitHubBootstrap = existingBootstrapCommitSha
    ? { branch: 'ankh-bootstrap', commitSha: existingBootstrapCommitSha }
    : await gateway.initializeBootstrapAsync(target);
  const published = await gateway.publishSnapshotAsync(target, snapshot, bootstrap.commitSha);
  await gateway.verifyPublishedSnapshotAsync(target, snapshot, published.commitSha);
  await gateway.setDefaultBranchAsync(target);
  await gateway.deleteBootstrapAsync(target, bootstrap);
  return { commitSha: published.commitSha };
}
