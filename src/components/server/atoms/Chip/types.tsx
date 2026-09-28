export type ChipVariant = "default" | "outlined";

export interface ChipProps {
    label: string;
    variant?: ChipVariant;
    backgroundColor?: string;
    color?: string;
    className?: string;
}
