// Tipos de variante de botón.
type ButtonVariant = "default" | "success" | "warning" | "danger";

// Propiedades del componente Button que extienden un botón normal de React.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  children?: React.ReactNode | string;
}

export type { ButtonProps, ButtonVariant };
