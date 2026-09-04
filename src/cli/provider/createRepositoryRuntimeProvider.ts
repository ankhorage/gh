import { repositoryPackageMetadata } from '../../metadata/repositoryPackageMetadata.js';
import {
  type ConnectCommandRequest,
  runConnectCommandAsync,
} from '../commands/connect/runConnectCommandAsync.js';

export interface RepositoryRuntimeProvider {
  readonly id: 'repository';
  readonly category: 'repository';
  readonly version: string;
  readonly capabilities: readonly ['repository.connect'];
  readonly commands: readonly [
    {
      readonly path: readonly ['connect'];
      readonly capability: 'repository.connect';
      readonly summary: string;
    },
  ];
  readonly handlers: readonly [
    {
      readonly path: readonly ['connect'];
      readonly handler: (request: ConnectCommandRequest) => Promise<{ readonly exitCode: number }>;
    },
  ];
}

/** Create the package-level Ankh provider for `ankh repository connect`. */
export function createRepositoryRuntimeProvider(): RepositoryRuntimeProvider {
  return {
    id: repositoryPackageMetadata.provider,
    category: repositoryPackageMetadata.category,
    version: repositoryPackageMetadata.version,
    capabilities: ['repository.connect'],
    commands: [
      {
        path: ['connect'],
        capability: 'repository.connect',
        summary: repositoryPackageMetadata.command.summary,
      },
    ],
    handlers: [{ path: ['connect'], handler: runConnectCommandAsync }],
  };
}
