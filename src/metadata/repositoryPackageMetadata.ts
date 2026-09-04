import packageJson from '../../package.json';

export const repositoryPackageMetadata = {
  packageName: packageJson.name,
  provider: 'repository' as const,
  category: 'repository' as const,
  version: packageJson.version,
  capabilities: ['repository.connect'] as const,
  command: {
    path: ['connect'] as const,
    capability: 'repository.connect' as const,
    summary: 'Create or safely resume a source repository connection.',
  },
} as const;
