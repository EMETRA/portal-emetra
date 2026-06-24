import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CasilleroNotification } from "./index";

const meta: Meta<typeof CasilleroNotification> = {
    title: "Molecules/CasilleroNotification",
    component: CasilleroNotification,
    argTypes: {
        title: {
            control: { type: "text" },
            description: "Título de la notificación",
        },
        description: {
            control: { type: "text" },
            description: "Descripción de la notificación",
        },
        date: {
            control: { type: "text" },
            description: "Fecha de la notificación",
        },
        time: {
            control: { type: "text" },
            description: "Hora de la notificación",
        },
        isOpen: {
            control: { type: "boolean" },
            description: "Controla la visibilidad del modal",
        },
        onClose: {
            action: "close",
            description: "Cierra el modal",
        },
        onDownload: {
            action: "download",
            description: "Descarga la notificación",
        },
    },
};

export default meta;

export const Default: StoryObj<typeof CasilleroNotification> = {
    args: {
        title: "Notificación de pago",
        description: "Estas seguro de cancelar este ticket, este ticket lo encontraras en el apartado de cancelados",
        date: "2026-06-22",
        time: "12:00:00",
        isOpen: true,
        onClose: () => {},
        onDownload: () => {},
    },
};