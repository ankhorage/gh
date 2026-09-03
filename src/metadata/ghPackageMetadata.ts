export const ghPackageMetadata = {
  packageName: '@ankhorage/gh',
  provider: 'gh' as const,
  category: 'gh' as const,
  version: '0.1.0',
  capabilities: ['gh.connect'] as const,
  command: {
    path: ['connect'] as const,
    capability: 'gh.connect' as const,
    summary: 'Create or safely resume a GitHub repository connection.',
  },
} as const;
