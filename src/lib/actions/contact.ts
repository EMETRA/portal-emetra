"use server";

import { z } from "zod";
import { BackendError, backendFetch } from "@/lib/backend/client";

const contactSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electronico es requerido")
    .email("Debe ser un correo electronico valido"),
});

export type FormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor corrige los errores del formulario.",
    };
  }

  const { email } = validatedFields.data;

  try {
    await backendFetch("/contact", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    if (error instanceof BackendError && [404, 405, 501].includes(error.status)) {
      console.info("[submitContactForm] endpoint no disponible:", email);
    } else {
      console.error("Error al procesar el formulario:", error);
      const message =
        error instanceof BackendError
          ? error.message
          : "Hubo un error al enviar tu informacion. Intentalo de nuevo.";
      return {
        message,
        success: false,
      };
    }
  }

  return {
    message: "Gracias. Te contactaremos pronto.",
    success: true,
  };
}
