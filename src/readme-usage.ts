/***
 * Connect a project folder to GitHub
 *
 * `@ankhorage/gh` connects a project directory to GitHub using the local,
 * authenticated `gh` CLI. It creates a missing repository, publishes the
 * project snapshot to `main`, and refuses unrelated existing repositories.
 *
 * See [`examples/basic-usage.ts`](../examples/basic-usage.ts) for a complete
 * programmatic example.
 *
 * @usage
 */
import { connectGitHubRepositoryAsync } from '@ankhorage/gh';

const result = await connectGitHubRepositoryAsync({
  projectPath: './my-project',
  owner: 'ankhorage',
  name: 'my-project',
  visibility: 'private',
});

if (result.status === 'conflict' || result.status === 'recoverable-failure') {
  console.error(`${result.status}: ${result.message}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(result));
}
