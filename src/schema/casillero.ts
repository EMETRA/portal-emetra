import * as yup from "yup";

/**
 * **Esquema de validación para el NIT**
 * @description El NIT puede tener 8 o 9 caracteres. son numeros y/o letras. no puede tener espacios
 * @example "1265786"
 * @example "1265786K"
 */
export const nitSchema = yup.string().required("El NIT es requerido").matches(/^[0-9a-zA-Z]{8,9}$/, "El NIT debe tener 8 o 9 caracteres. Sin espacios o guiones");

/**
 * **Esquema de validación para el DPI**
 * @description El DPI debe tener 13 dígitos. no puede tener espacios
 * @example "5684658530101"
 * @example "5684965250102"
 */
export const dpiSchema = yup.string().required("El DPI es requerido").matches(/^\d{13}$/, "El DPI debe tener 13 dígitos. Sin espacios");

/**
 * **Esquema de validación para el correo electrónico**
 * @description El correo electrónico debe ser un correo electrónico válido
 * @example "example@muniguate.com"
 * @example "example@gmail.com"
 * @example "example@yahoo.com"
 * @example "example@hotmail.com"
 * @example "example@outlook.com"
 * @example "example@live.com"
 * @example "example@aol.com"
 */
export const emailSchema = yup.string().required("El correo electrónico es requerido").email("El correo electrónico no es válido");

/**
  * **Esquema de validación para la contraseña**
  * @description La contraseña debe tener entre 8 y 16 caracteres. debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial
  * @example "Abc123!@"
  * @example "Abc123!@#"
  * @example "Abc123!@#$
  * @example "Abc123!@#$%
  * @example "Abc123!@#$%^
  * @example "Abc123!@#$%^&
  * @example "Abc123!@#$%^&*
  */
export const passwordSchema = yup
    .string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(16, "La contraseña debe tener menos de 16 caracteres")
    .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .matches(/[a-z]/, "La contraseña debe tener al menos una letra minúscula")
    .matches(/[0-9]/, "La contraseña debe tener al menos un número")
    .matches(/[!@#$%^&*]/, "La contraseña debe tener al menos un carácter especial");

/**
 * **Esquema de validación para el teléfono**
 * @description El teléfono debe tener 8 dígitos. no puede tener espacios
 * @example "12345678"
 * @example "98743216"
 */
export const cellPhoneSchema = yup.string().required("El teléfono es requerido").matches(/^\d{8}$/, "El teléfono debe tener 8 dígitos. Sin espacios");

