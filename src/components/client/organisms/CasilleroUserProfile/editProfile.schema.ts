import * as yup from "yup";

export const editProfileSchema = yup.object({
  firstName: yup.string().required("El nombre es requerido"),
  secondName: yup.string().optional(),
  firstLastName: yup.string().required("El primer apellido es requerido"),
  secondLastName: yup.string().optional(),
  dateOfBirth: yup.string().required("La fecha de nacimiento es requerida"),
  nationality: yup
    .string()
    .required("La nacionalidad es requerida")
    .length(2, "Usa el código de país (ej: GT)"),
  residenceCountry: yup
    .string()
    .required("El país de residencia es requerido")
    .length(2, "Usa el código de país (ej: GT)"),
});
