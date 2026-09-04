import { connectGitHubRepositoryAsync } from '@ankhorage/repository';

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
