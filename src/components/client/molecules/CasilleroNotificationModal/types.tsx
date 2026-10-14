
export interface CasilleroNotificationModalProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onDownload?: (id: string) => void;
    /** Se llama si el backend responde 401 al pedir el detalle (sesión vencida). */
    onSesionVencida?: () => void;
}
