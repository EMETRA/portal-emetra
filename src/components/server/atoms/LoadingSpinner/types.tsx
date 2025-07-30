/**
 * Propiedades para el componente LoadingSpinner.
 */
type LoadingSpinnerVariant = "page-wide" | "inline";

/**
 * Las propiedades del componente de spinner de carga.
 */
interface LoadingSpinnerProps {
  variant?: LoadingSpinnerVariant;
  visible?: boolean;
  className?: string;
}

export type { LoadingSpinnerProps, LoadingSpinnerVariant };
