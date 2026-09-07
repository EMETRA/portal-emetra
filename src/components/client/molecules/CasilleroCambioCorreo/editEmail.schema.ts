import * as yup from "yup";

export const editEmailSchema = yup.object({
    newEmail: yup.string().email("Correo electrónico inválido").required("Correo electrónico es requerido"),
}).required();

