import { cellPhoneSchema } from "@/schema/casillero";
import * as yup from "yup";

export const editPhoneSchema = yup.object({
  newPhone: cellPhoneSchema,
});
