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
