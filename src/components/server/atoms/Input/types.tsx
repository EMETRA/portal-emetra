/**
 * Variantes del componente Input
 */
type InputVariant = "default" | "success" | "danger";

/**
 * Propiedades del componente Input que extienden un input normal de React.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  className?: string;
}

export type { InputProps };
