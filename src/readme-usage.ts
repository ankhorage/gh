/***
 * Connect a project folder to its source repository
 *
 * `@ankhorage/repository` consumes only the project's `RepositoryManifest` slice and delegates
 * GitHub operations to the local authenticated `gh` adapter. It creates a missing repository,
 * publishes the project snapshot to `main`, stores only the repository slice in
 * `.ankhorage/repository.json`, and refuses unrelated existing repositories.
 *
 * See [`examples/basic-usage.ts`](../examples/basic-usage.ts) for a complete programmatic example.
 *
 * @usage
 */
import { connectRepositoryAsync } from '@ankhorage/repository';

const result = await connectRepositoryAsync({
  projectPath: './my-project',
  repository: {
    provider: 'github',
    owner: 'ankhorage',
    name: 'my-project',
    url: 'https://github.com/ankhorage/my-project',
    defaultBranch: 'main',
  },
  visibility: 'private',
});

if (result.status === 'conflict' || result.status === 'recoverable-failure') {
  console.error(`${result.status}: ${result.message}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(result));
}
