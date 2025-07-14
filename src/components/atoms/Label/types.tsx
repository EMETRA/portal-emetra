/**
 * Tipo de variante de etiqueta.
 */
type LabelVariant = "default" | "success" | "warning" | "danger" | "info";

/**
 * Las propiedades del componente de etiqueta.
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: LabelVariant;
}

export type { LabelProps, LabelVariant };
