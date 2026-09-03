type ProjectSnapshotEntryMode = '100644' | '100755';
type ProjectSnapshotEntryEncoding = 'utf-8' | 'base64';

export interface ProjectSnapshotEntry {
  readonly path: string;
  readonly mode: ProjectSnapshotEntryMode;
  readonly content: string;
  readonly encoding: ProjectSnapshotEntryEncoding;
}
