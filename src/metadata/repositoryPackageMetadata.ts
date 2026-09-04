export const repositoryPackageMetadata = {
  packageName: '@ankhorage/repository',
  provider: 'repository' as const,
  category: 'repository' as const,
  version: '0.3.1',
  capabilities: ['repository.connect'] as const,
  command: {
    path: ['connect'] as const,
    capability: 'repository.connect' as const,
    summary: 'Create or safely resume a source repository connection.',
  },
} as const;
