"use server";

import { z } from "zod";

// Schema de validación con Zod
const contactSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Debe ser un correo electrónico válido"),
});

export type FormState = {
  errors?: {
    email?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validar los datos del formulario
  const validatedFields = contactSchema.safeParse({
    email: formData.get("email"),
  });

  // Si la validación falla, retornar errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor corrige los errores del formulario.",
    };
  }

  const { email } = validatedFields.data;

  try {
    // Aquí puedes agregar la lógica para enviar el email
    // Por ejemplo, enviar a un servicio de email, guardar en base de datos, etc.
    
    // Simulamos un delay para mostrar el comportamiento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Por ahora solo logueamos el email
    console.log("Nuevo contacto:", email);
    
    // Podrías enviar a un servicio como:
    // - SendGrid
    // - Resend  
    // - Nodemailer
    // - Guardar en una base de datos
    
    return {
      message: "¡Gracias! Te contactaremos pronto.",
      success: true,
    };
    
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return {
      message: "Hubo un error al enviar tu información. Inténtalo de nuevo.",
      success: false,
    };
  }
}
