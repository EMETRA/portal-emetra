export type FileRejectReason = "limit" | "type" | "size";

export type UploadItemStatus = "loaded" | "error";

export type UploadItem = {
  id: string;
  file: File;
  status: UploadItemStatus;
  error?: FileRejectReason;
};

export type FileUploaderProps = {
  /** Tipos MIME exactos, los mismos que recibe el input. Por ejemplo `image/jpeg`. */
  accept: string[];
  /** Tamaño máximo de cada archivo, en bytes. */
  maxSizeBytes: number;
  /** Cantidad máxima de archivos, incluyendo las que están en error. */
  maxFiles: number;
  /** Archivos que terminaron de cargar, en el orden de la lista. */
  onChange?: (files: File[]) => void;
  dropLabel?: string;
  selectLabel?: string;
  invalidTypeMessage?: string;
  invalidSizeMessage?: string;
  limitMessage?: string;
  disabled?: boolean;
};
