
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  errorMessage?: string;
  label?: string;
  size?: number;
}

export type { CheckboxProps };
