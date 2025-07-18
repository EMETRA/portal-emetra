import { FileListType } from "./types";

/**
 * Función para validar el MimeType de los archivos
 */
const validateMimeType = (fileList: FileListType, mimeTypes: string[]) => {
  if (!fileList || fileList.length === 0) return false;
  for (let i = 0; i < fileList.length; i++) {
    if (!mimeTypes.includes(fileList[i].type)) {
      return false;
    }
  }
  return true;
};

export { validateMimeType };
