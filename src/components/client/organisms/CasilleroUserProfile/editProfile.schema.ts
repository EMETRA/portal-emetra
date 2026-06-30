import { emailSchema, cellPhoneSchema } from "@/schema/casillero";
import * as yup from "yup";

export const editProfileSchema = yup.object({
  email: emailSchema,
  phone: cellPhoneSchema,
});
