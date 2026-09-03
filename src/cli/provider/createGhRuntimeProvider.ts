import { ghPackageMetadata } from '../../metadata/ghPackageMetadata.js';
import {
  type ConnectCommandRequest,
  runConnectCommandAsync,
} from '../commands/connect/runConnectCommandAsync.js';

export interface GhRuntimeProvider {
  readonly id: 'gh';
  readonly category: 'gh';
  readonly version: string;
  readonly capabilities: readonly ['gh.connect'];
  readonly commands: readonly [
    {
      readonly path: readonly ['connect'];
      readonly capability: 'gh.connect';
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

/** Create the package-level Ankh provider for `ankh gh connect`. */
export function createGhRuntimeProvider(): GhRuntimeProvider {
  return {
    id: ghPackageMetadata.provider,
    category: ghPackageMetadata.category,
    version: ghPackageMetadata.version,
    capabilities: ['gh.connect'],
    commands: [
      {
        path: ['connect'],
        capability: 'gh.connect',
        summary: ghPackageMetadata.command.summary,
      },
    ],
    handlers: [{ path: ['connect'], handler: runConnectCommandAsync }],
  };
}
