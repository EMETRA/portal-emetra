import type { IconType } from "../../atoms";
import React from "react";

/**
 * Props de ServiceItem (dos iconos + etiqueta).
 */
export interface ServiceItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Nombre del primer ícono */
  iconA: IconType;
  /** Nombre del segundo ícono */
  iconB: IconType;
  /** Texto del servicio */
  label: string;
  className?: string;
  href?: string;
}
