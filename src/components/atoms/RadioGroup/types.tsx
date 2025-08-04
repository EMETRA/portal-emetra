export interface RadioOption {
    label: string;
    value: string;
}

export interface RadioGroupProps {
    name: string;
    options: RadioOption[];
    selected?: string;
    onChange: (value: string) => void;
    className?: string;
}
