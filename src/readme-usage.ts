/***
 * Connect a project folder to GitHub
 *
 * `@ankhorage/gh` connects a standalone project directory to a GitHub
 * repository using the local, authenticated `gh` CLI. It creates a missing
 * repository, publishes the complete project snapshot to `main`, and safely
 * refuses unrelated existing repositories.
 *
 * See [`examples/basic-usage.ts`](../examples/basic-usage.ts) for a complete
 * programmatic example.
 *
 * @usage
 */
import { connectGitHubRepositoryAsync } from './index.js';

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
