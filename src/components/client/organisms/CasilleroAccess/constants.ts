// constants.ts
import type { IconType } from "@/components/server/atoms";
import type { TwoFactorType } from "@/lib/casillero/types";

export const twoFactorMethods: { id: TwoFactorType; icon: IconType; label: string }[] = [
  { id: "CORREO",       icon: "Mail",                   label: "Correo electrónico"    },
  { id: "TOTP",         icon: "GoogleAuthenticator",    label: "Authenticator"         },
  { id: "RECUPERACION", icon: "MicrosoftAuthenticator", label: "Código de recuperación" },
];