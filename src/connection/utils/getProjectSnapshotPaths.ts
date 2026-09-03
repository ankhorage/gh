/** Return snapshot paths in deterministic order. */
export function getProjectSnapshotPaths(
  entries: readonly { readonly path: string }[],
): readonly string[] {
  return entries.map((entry) => entry.path).sort((left, right) => left.localeCompare(right));
}
