import type { GitHubRepositoryConnectionResult } from '../../../connection/definitions/GitHubRepositoryConnectionResult.js';
import { connectGitHubRepositoryAsync } from '../../../connection/services/connectGitHubRepositoryAsync.js';
import { parseConnectCommandOptions } from './parseConnectCommandOptions.js';

export interface ConnectCommandRequest {
  readonly argv?: readonly string[];
  readonly stdout?: (line: string) => void;
  readonly stderr?: (line: string) => void;
}

/** Run the connect command and map structured results to deterministic CLI exit codes. */
export async function runConnectCommandAsync(
  request: ConnectCommandRequest = {},
): Promise<{ readonly exitCode: number }> {
  const stdout = request.stdout ?? console.log;
  const stderr = request.stderr ?? console.error;
  let options;
  try {
    options = parseConnectCommandOptions(request.argv ?? []);
  } catch (error) {
    stderr(error instanceof Error ? error.message : 'Invalid connect options.');
    return { exitCode: 2 };
  }
  const result = await connectGitHubRepositoryAsync(options);
  writeResult(result, stdout, stderr);
  return {
    exitCode: result.status === 'connected' || result.status === 'already-connected' ? 0 : 1,
  };
}

/** Write a safe result without raw process output or credentials. */
function writeResult(
  result: GitHubRepositoryConnectionResult,
  stdout: (line: string) => void,
  stderr: (line: string) => void,
): void {
  const line = JSON.stringify(result);
  if (result.status === 'connected' || result.status === 'already-connected') stdout(line);
  else stderr(line);
}
