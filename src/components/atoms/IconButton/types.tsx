import { LucideIcon } from "lucide-react"

export interface IconButtonProps {
    icon: LucideIcon;
    onClick?: () => void;
    label?: string;
};