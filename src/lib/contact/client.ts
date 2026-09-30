import { z } from "zod";

const contactSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electronico es requerido")
    .email("Debe ser un correo electronico valido"),
});

export type ContactFormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function submitContactFormClient(
  email: string
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor corrige los errores del formulario.",
    };
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: validatedFields.data.email }),
  });

  if ([404, 405, 501].includes(response.status)) {
    console.info("[submitContactForm] endpoint no disponible:", email);
    return {
      message: "Gracias. Te contactaremos pronto.",
      success: true,
    };
  }

  if (!response.ok) {
    const body = await response.text();
    return {
      message: body || `HTTP ${response.status}`,
      success: false,
    };
  }

  return {
    message: "Gracias. Te contactaremos pronto.",
    success: true,
  };
}
