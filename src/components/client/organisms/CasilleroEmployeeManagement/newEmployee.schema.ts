import * as yup from "yup";

export const newEmployeeSchema = yup.object({
  // el NIT puede tener 8 o 9 caracteres. son numeros y/o letras. no puede tener espacios
  nit: yup.string().required("El NIT es requerido").matches(/^[0-9a-zA-Z]{8,9}$/, "El NIT debe tener 8 o 9 caracteres. Sin espacios o guiones"),
  dpi: yup.string().required("El DPI es requerido").matches(/^\d{13}$/, "El DPI debe tener 13 dígitos"),
});
