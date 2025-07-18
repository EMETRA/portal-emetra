import { FileListType, validateMimeType } from "@/utils/form";
import * as yup from "yup";

/**
 * **Interfaz de perfil de roles en usuarios**
 * @param id Identificador del perfil
 * @param nombre Nombre del perfil
 * @param descripcion Descripción del perfil
 */
interface Profile {
  id: number;
  nombre: string;
  descripcion: string;
}

/**
 * **Enumeración de estados de verificación**
 */
enum VerificationStatus {
  /**
   * **Revisión en Medios de Transporte**
   */
  MDT_REVISION = 0,
  /**
   * **Revisión Jurídica (Legalización)**
   */
  JUDICIAL_REVISION = 1,
  /**
   * **Verificado**
   */
  VERIFIED = 2,
}

/**
 * **Interfaz de usuario**
 * @param id Identificador del usuario
 * @param nombres Nombres del usuario
 * @param apellidos Apellidos del usuario
 * @param fecha_nacimiento Fecha de nacimiento del usuario
 * @param dpi Número de DPI del usuario
 * @param nit NIT del usuario
 * @param telefono Teléfono del usuario
 * @param correo Correo electrónico del usuario
 * @param foto URL de la foto del usuario
 * @param dpi_doc URL del documento de DPI del usuario
 * @param verificado Estado de verificación del usuario
 * @param perfil_usuario Perfil del usuario (permisos)
 * @param permisos Permisos del usuario
 */
interface User {
  id?: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  dpi: string;
  nit: string;
  telefono: string;
  correo: string;
  foto: string;
  dpi_doc: string;
  verificado: VerificationStatus;
  perfil_usuario?: Profile;
  permisos?: string[];
}

/**
 * **Interfaz de campos de petición de inicio de sesión**
 * @param correo Correo electrónico del usuario
 * @param clave Contraseña del usuario
 */
interface LoginRequest {
  correo: string;
  clave: string;
}

/**
 * **Interfaz de campos de petición de registro**
 * @param nombres Nombres del usuario
 * @param apellidos Apellidos del usuario
 * @param telefono Teléfono del usuario
 * @param correo Correo electrónico del usuario
 * @param fecha_nacimiento Fecha de nacimiento del usuario
 * @param clave Contraseña del usuario
 * @param dpi Número de DPI del usuario
 * @param dpi_doc Documento de DPI del usuario
 * @param nit NIT del usuario
 * @param foto Foto del usuario
 */
interface RegisterRequest {
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  clave: string;
  dpi: string;
  dpi_doc: File;
  nit: string;
  foto: File;
}

/**
 * **Esquema de validación para petición de inicio de sesión**
 */
const LoginSchema = yup.object({
  correo: yup
    .string()
    .email("Por favor, ingrese un correo electrónico válido")
    .required("Por favor, ingrese su correo electrónico"),
  clave: yup.string().required("Por favor, ingrese su contraseña"),
});

/**
 * **Interfaz de respuesta de inicio de sesión**
 * @param access_token Token de acceso
 * @param refresh_token Token de refresco
 * @param id Identificador del usuario
 */
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  id: number;
}

/**
 * **Interfaz de respuesta de registro**
 * @param nombres Nombres del usuario
 * @param apellidos Apellidos del usuario
 * @param fecha_nacimiento Fecha de nacimiento del usuario
 * @param dpi Número de DPI del usuario
 * @param nit NIT del usuario
 * @param telefono Teléfono del usuario
 * @param correo Correo electrónico del usuario
 * @param foto URL de la foto del usuario
 * @param dpi_doc URL del documento de DPI del usuario
 * @param id Identificador del usuario
 * @param verificado Indica si el usuario está verificado
 * @param permisos Permisos del usuario
 */
interface RegisterResponse {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  dpi: string;
  nit: string;
  telefono: string;
  correo: string;
  foto: string;
  dpi_doc: string;
  id: number;
  verificado: number;
  permisos: string[];
}

/**
 * **Interfaz para los datos del formulario de registro**
 */
interface RegisterFormType {
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  clave: string;
  confirmclave: string;
  dpi_doc: FileListType;
  dpi: string;
  foto: FileListType;
  fecha_nacimiento: string;
  nit: string;
}

/**
 * **Esquema para validar los datos del formulario de registro**
 */
const RegisterSchema = yup
  .object({
    /**
     * Nombres del usuario deben ser strings y son obligatorios
     */
    nombres: yup.string().required("Por favor, ingrese sus nombres"),
    /**
     * Apellidos del usuario deben ser strings y son obligatorios
     */
    apellidos: yup.string().required("Por favor, ingrese sus apellidos"),
    /**
     * Teléfono del usuario debe ser un string de 8 dígitos y es obligatorio
     */
    telefono: yup
      .string()
      .matches(
        /^\d{8}$/,
        "Por favor, ingrese un número de teléfono válido de 8 dígitos"
      )
      .required("Por favor, ingrese su teléfono"),
    /**
     * Correo electrónico del usuario debe ser un string y es obligatorio
     */
    correo: yup
      .string()
      .email("Por favor, ingrese un correo válido")
      .typeError("Por favor, ingrese un correo válido")
      .required("Por favor, ingrese su correo"),
    /**
     * Contraseña del usuario debe ser un string y es obligatorio
     */
    clave: yup
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("Por favor, ingrese una contraseña de al menos 8 caracteres"),
    /**
     * Confirmación de la contraseña del usuario debe ser un string, es obligatorio y debe coincidir con la contraseña anterior
     */
    confirmclave: yup
      .string()
      .oneOf([yup.ref("clave")], "Las contraseñas deben coincidir")
      .required("Por favor, confirme su contraseña"),
    /**
     * DPI del usuario debe ser un archivo y es obligatorio
     */
    dpi_doc: yup
      .mixed<FileListType>()
      .required("Por favor, suba su DPI")
      .test("fileRequired", "Por favor, suba su DPI", (value) => {
        return value && value.length > 0;
      })
      .test("fileType", "Formato de archivo no válido", (value) => {
        return validateMimeType(value, [
          "application/pdf",
          "image/jpeg",
          "image/png",
        ]);
      }),

    /**
     * Número de DPI
     */
    dpi: yup
      .string()
      .matches(
        /^[1-9][0-9]{12}$/,
        "El DPI debe tener 13 dígitos y no puede comenzar con 0"
      )
      .required("Por favor, ingrese su DPI"),

    /**
     * Fecha de nacimiento
     */

    fecha_nacimiento: yup
      .string()
      .required("Por favor, ingrese su fecha de nacimiento"),

    /**
     * Fotografía del usuario debe ser un archivo y es obligatorio
     */
    foto: yup
      .mixed<FileListType>()
      .required("Por favor, suba su foto")
      .test("fileRequired", "Por favor, suba su foto", (value) => {
        return value && value.length > 0;
      })
      .test("fileType", "Formato de archivo no válido", (value) => {
        return validateMimeType(value, ["image/jpeg", "image/png"]);
      }),

    nit: yup.string().required("Por favor, ingrese su NIT"),
  })
  .required();

/**
 * **Interfaz para los datos de la petición de envío de correo de verificación**
 * @param correo Correo electrónico del usuario
 */
interface SendVerifyEmailRequest {
  correo: string;
}

/**
 * **Esquema para validar los datos de la petición de envío de correo de verificación**
 */
const SendVerifyEmailSchema = yup.object({
  /**
   * Correo electrónico del usuario
   */
  correo: yup
    .string()
    .email("Por favor, ingrese un correo electrónico válido")
    .required("Por favor, ingrese su correo electrónico"),
});

/**
 * **Interfaz para los datos de la petición de verificación de correo**
 * @param token Token de verificación
 */
interface VerifyEmailRequest {
  token: string;
}

/**
 * **Esquema para validar los datos de la petición de verificación de correo**
 */
const VerifyEmailSchema = yup.object({
  /**
   * Token de verificación
   */
  token: yup.string().required("Token de verificación inválido"),
});

/**
 * **Interfaz para la respuesta de la petición de envío de correo de verificación**
 * @param mensaje Mensaje de la respuesta
 * @param correo Correo electrónico al que se envió el correo
 */
interface VerifyEmailResponse {
  mensaje: string;
  correo: string;
}

/**
 * **Interfaz para la petición de envío de correo de recuperación de contraseña**
 * @param correo Correo electrónico del usuario
 */
interface SendRecoveryEmailRequest {
  correo: string;
}

/**
 * **Esquema para validar los datos de la petición de envío de correo de recuperación de contraseña**
 */
const SendRecoveryEmailSchema = yup.object({
  correo: yup
    .string()
    .email("Por favor, ingrese un correo electrónico válido")
    .required("Por favor, ingrese su correo electrónico"),

  clave: yup
    .string()

    .required("Por favor, ingrese su contraseña"),
});

/**
 * **Interfaz para la petición de recuperación de contraseña**
 * @param OTP Código de verificación
 * @param clave Nueva contraseña
 */
interface RecoverPasswordRequest {
  OTP: string;
  clave: string;
}

/**
 * **Esquema para validar los datos de la petición de recuperación de contraseña**
 */
const RecoverPasswordSchema = yup.object({
  OTP: yup
    .string()
    .max(6, "El código de verificación debe tener 6 dígitos")
    .min(6, "El código de verificación debe tener 6 dígitos")
    .required("Por favor, ingrese el código de verificación"),

  clave: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Por favor, ingrese una contraseña de al menos 8 caracteres"),
});

export type {
  Profile,
  User,
  RecoverPasswordRequest,
  SendRecoveryEmailRequest,
  SendVerifyEmailRequest,
  VerifyEmailResponse,
  VerifyEmailRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RegisterFormType,
  VerificationStatus,
};
export {
  RecoverPasswordSchema,
  LoginSchema,
  RegisterSchema,
  SendVerifyEmailSchema,
  VerifyEmailSchema,
  SendRecoveryEmailSchema,
};
