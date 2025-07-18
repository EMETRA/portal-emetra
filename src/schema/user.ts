import { FileListType, validateMimeType } from "@/utils/form";
import * as yup from "yup";

/**
 * **Interfaz para petición de actualización de usuario**
 * @param nombres Nombres del usuario
 * @param apellidos Apellidos del usuario
 * @param correo Correo electrónico del usuario
 * @param fecha_nacimiento Fecha de nacimiento del usuario
 * @param dpi Documento Personal de Identificación del usuario
 * @param dpi_doc Archivo del Documento Personal de Identificación del usuario
 * @param nit Número de Identificación Tributaria del usuario
 * @param foto Foto del usuario
 */
interface UpdateUserRequest {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  fecha_nacimiento?: string;
  dpi?: string;
  dpi_doc?: File;
  nit?: string;
  foto?: File;
}

const UpdateUserSchema = yup.object({
  id: yup.number().required("Por favor, ingrese el ID del usuario"),
  nombres: yup.string().optional(),
  apellidos: yup.string().optional(),
  correo: yup.string().email("Por favor, ingrese un correo válido").optional(),
  fecha_nacimiento: yup.string().optional(),
  dpi: yup.string().optional(),
  dpi_doc: yup
    .mixed<FileListType>()
    .optional()
    .test("fileType", "Formato de archivo no válido", (value) => {
      return (
        value &&
        validateMimeType(value, ["application/pdf", "image/jpeg", "image/png"])
      );
    }),
  nit: yup.string().optional(),
  foto: yup
    .mixed<FileListType>()
    .optional()
    .test("fileType", "Formato de archivo no válido", (value) => {
      return value && validateMimeType(value, ["image/jpeg", "image/png"]);
    }),
});

export type { UpdateUserRequest };
export { UpdateUserSchema };
