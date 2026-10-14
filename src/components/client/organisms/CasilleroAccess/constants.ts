// constants.ts
import type { IconType } from "@/components/server/atoms";
import type { TwoFactorType } from "@/lib/casillero/types";

/**
 * Métodos del segundo factor. `hint` explica dónde encontrar el código.
 */
export const twoFactorMethods: { id: TwoFactorType; icon: IconType; label: string; hint: string }[] = [
  {
    id: "CORREO",
    icon: "Mail",
    label: "Correo electrónico",
    hint: "Ingresa el código que te enviamos por correo.",
  },
  {
    id: "TOTP",
    icon: "GoogleAuthenticator",
    label: "Authenticator",
    hint: "Ingresa el código que muestra tu app de autenticación.",
  },
  {
    id: "RECUPERACION",
    icon: "MicrosoftAuthenticator",
    label: "Código de recuperación",
    hint: "Ingresa uno de tus códigos de recuperación.",
  },
];
