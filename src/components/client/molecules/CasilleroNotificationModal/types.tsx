
export interface CasilleroNotificationModalProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onDownload?: (id: string) => void;
}
