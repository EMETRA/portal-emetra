/**
 * Tipo personalizado de FileList compatible con yup
 */
type FileListType = FileList & {
  length: number;
  item(index: number): File | null;
  [Symbol.iterator](): IterableIterator<File>;
};

export type { FileListType };
