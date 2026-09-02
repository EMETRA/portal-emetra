import * as yup from "yup";
import { normalizeUrl } from "../lib/casillero/google-drive";
import {
  dpiSchema,
  emailSchema,
  googleDriveUrlSchema,
  nitSchema,
  passwordSchema,
} from "./casillero";

export const registroIndividualSchema = yup.object({
  // Datos personales
  firstName: yup.string().required("El nombre es requerido"),
  secondName: yup.string().optional(),
  firstLastName: yup.string().required("El primer apellido es requerido"),
  secondLastName: yup.string().optional(),

  // Cuenta
  email: emailSchema,
  confirmEmail: emailSchema
    .oneOf([yup.ref("email")], "Los correos electrónicos no coinciden"),
  nit: nitSchema,

  // Datos adicionales
  dateOfBirth: yup.string().required("La fecha de nacimiento es requerida"),
  nationality: yup
    .string()
    .required("La nacionalidad es requerida")
    .length(2, "Usa el código de país (ej: GT)"),
  residenceCountry: yup
    .string()
    .required("El país de residencia es requerido")
    .length(2, "Usa el código de país (ej: GT)"),

  // Documento DPI
  documentNumber: yup
    .string()
    .required("El número de DPI es requerido")
    .matches(/^\d{13}$/, "El DPI debe tener 13 dígitos. Sin espacios"),
  documentCountry: yup
    .string()
    .required("El país del documento es requerido")
    .length(2, "Usa el código de país (ej: GT)"),
  documentIssuedOn: yup
    .string()
    .required("La fecha de emisión es requerida"),
  documentExpiresOn: yup
    .string()
    .required("La fecha de vencimiento es requerida"),
});

export type RegistroIndividualData = yup.InferType<typeof registroIndividualSchema>;

export const registroLegalSchema = yup.object({
  dpi: dpiSchema,
  nit: nitSchema,
  email: emailSchema,
  confirmEmail: emailSchema
    .oneOf([yup.ref("email")], "Los correos electrónicos no coinciden"),
  password: passwordSchema,
  confirmPassword: yup.string()
    .required("Confirma tu contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
  rtuLink: googleDriveUrlSchema,
  mandateLink: googleDriveUrlSchema,
}).test(
  "distinct-drive-links",
  "El enlace de RTU y el Mandato Representante Legal no pueden ser el mismo.",
  (value) => {
    if (!value?.rtuLink || !value?.mandateLink) return true;
    return normalizeUrl(value.rtuLink) !== normalizeUrl(value.mandateLink);
  },
);

export type RegistroLegalData = yup.InferType<typeof registroLegalSchema>;

// export const VerifyEmailCode = yup.string().required("El código de verificación es requerido");

export const verifyEmailSchema = yup.object({
  code: yup.string().required("El código de verificación es requerido"),
  password: passwordSchema,
  confirmPassword: yup.string()
    .required("Confirma tu contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});