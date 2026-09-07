import * as yup from "yup";

export const editEmailSchema = yup.object({
  newEmail: yup
    .string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico es requerido"),
});

export const completeEmailChangeSchema = yup.object({
  stepUpCode: yup
    .string()
    .required("Ingresa el código enviado a tu correo actual"),
  newEmailCode: yup
    .string()
    .required("Ingresa el código enviado a tu correo nuevo"),
});

