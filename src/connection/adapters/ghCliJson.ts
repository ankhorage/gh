interface GhRunnerResult {
  readonly stdout: string;
}

export interface GhJsonRunner {
  runAsync(args: readonly string[], input?: string): Promise<GhRunnerResult>;
}

/** Parse a JSON response from the GitHub CLI. */
export async function runGhJsonAsync(
  runner: GhJsonRunner,
  args: readonly string[],
  input?: string,
): Promise<unknown> {
  const result = await runner.runAsync(args, input);
  try {
    return JSON.parse(result.stdout) as unknown;
  } catch (error) {
    throw new Error('GitHub returned malformed JSON.', { cause: error });
  }
}

/** Return undefined for GitHub's not-found responses. */
export async function tryGhJsonAsync(
  runner: GhJsonRunner,
  args: readonly string[],
): Promise<unknown> {
  try {
    return await runGhJsonAsync(runner, args);
  } catch (error) {
    if (isGhNotFound(error)) return undefined;
    throw error;
  }
}

/** Extract a SHA from a GitHub ref response. */
export function getGhNestedSha(value: unknown): string | undefined {
  return isRecord(value) && isRecord(value.object) && typeof value.object.sha === 'string'
    ? value.object.sha
    : undefined;
}

/** Identify a not-found response without exposing command output. */
export function isGhNotFound(error: unknown): boolean {
  return error instanceof Error && /\b404\b|not found/iu.test(error.message);
}

/** Restrict diagnostics to stable, non-sensitive process error text. */
export function sanitizeGhError(value: string): string {
  return value.replaceAll(/\bgh[pousr]_[A-Za-z0-9_]+/gu, '[redacted]').slice(0, 500);
}

/** Narrow unknown JSON objects. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Narrow unknown strings. */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
