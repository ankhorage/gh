import type { ConnectCommandOptions } from './definitions/ConnectCommandOptions.js';

/** Parse the deterministic `ankh gh connect` positional argument and flags. */
export function parseConnectCommandOptions(argv: readonly string[]): ConnectCommandOptions {
  let projectPath: string | undefined;
  let owner: string | undefined;
  let name: string | undefined;
  let visibility: ConnectCommandOptions['visibility'] = 'private';
  let visibilityFlag = false;
  for (let index = 0; index < argv.length; index += 1) {
    const [argument] = argv.slice(index);
    if (argument === undefined) continue;
    if (argument === '--public' || argument === '--private') {
      if (visibilityFlag) throw new Error('--public and --private are mutually exclusive.');
      visibilityFlag = true;
      visibility = argument.slice(2) as ConnectCommandOptions['visibility'];
      continue;
    }
    if (argument === '--owner' || argument === '--name') {
      const [value] = argv.slice(index + 1);
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value.`);
      index += 1;
      if (argument === '--owner') owner = value;
      else name = value;
      continue;
    }
    if (argument.startsWith('--')) throw new Error(`Unknown option: ${argument}`);
    if (projectPath) throw new Error('Only one project path may be provided.');
    projectPath = argument;
  }
  return { projectPath, owner, name, visibility };
}
