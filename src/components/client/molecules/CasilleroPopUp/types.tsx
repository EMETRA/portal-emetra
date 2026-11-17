import { ButtonVariant } from "@/components/server/atoms/Button/types";
import type { ReactNode } from "react";

export interface CasilleroPopUpProps {
    isOpen: boolean;
    variant?: 'default' | 'success' | 'warning' | 'error';
    title: string;
    description: string;
    children?: ReactNode;
    actions?: {
        text: string;
        variant: ButtonVariant;
        onClick: () => void;
    }[];
    onClose: () => void;
}
