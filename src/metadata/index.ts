export const REPOSITORY_PACKAGE_METADATA = {
  packageName: '@ankhorage/repository',
  manifestProperty: 'repository',
  contractSubpath: '@ankhorage/contracts/repository',
  providers: ['github'],
  capabilities: ['repository.connect'],
  github: {
    cli: 'gh',
    defaultBranch: 'main',
  },
} as const;
