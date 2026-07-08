import { nitSchema, dpiSchema } from "@/schema/casillero";
import * as yup from "yup";

export const newEmployeeSchema = yup.object({
  nit: nitSchema,
  dpi: dpiSchema,
});
