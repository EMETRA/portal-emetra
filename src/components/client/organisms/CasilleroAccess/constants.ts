import type { IconType } from "@/components/server/atoms";
import type { TwoFactorMethod } from "./types";

export const twoFactorMethods: { id: TwoFactorMethod; icon: IconType; label: string }[] = [
  { id: "google", icon: "GoogleAuthenticator", label: "Google Authenticator" },
  { id: "microsoft", icon: "MicrosoftAuthenticator", label: "Microsoft Authenticator" },
  { id: "email", icon: "Mail", label: "Correo electrónico" },
];
