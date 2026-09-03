import { ButtonVariant } from "@/components/server/atoms/Button/types";

export interface CasilleroPopUpProps {
    isOpen: boolean;
    variant?: 'default' | 'success' | 'warning' | 'error';
    title: string;
    description: string;
    actions?: {
        text: string;
        variant: ButtonVariant;
        onClick: () => void;
    }[];
    onClose: () => void;
}
