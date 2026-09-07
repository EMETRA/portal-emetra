import React, { useState } from "react";
import * as yup from "yup";
import { CasilleroCambioCorreoProps } from "./types";
import { Button, Icon, Input } from "@/components/server/atoms";
import { PopOver } from "../../atoms/PopOver";
import { Text } from "@/components/atoms/Text";
import styles from "./CasilleroCambioCorreo.module.scss";
import { editEmailSchema } from "./editEmail.schema";

export const CasilleroCambioCorreo = ({
    isOpen,
    onClose,
}: CasilleroCambioCorreoProps) => {
    const [message, setMessage] = useState<string | null>(null);

    const handleClose = () => {
        setMessage(null);
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const newEmail = formData.get("newEmail") as string;
        try {
            await editEmailSchema.validate({ newEmail }, { abortEarly: true });
        } catch (error) {
            setMessage(
                error instanceof yup.ValidationError
                ? error.message
                : "Revisa los campos del formulario."
        );
        return;
        }
        console.log(newEmail);
        // TODO: Implementar la lógica para cambiar el correo electrónico
        // TODO: Implementar la lógica para notificar al usuario que el cambio de correo electrónico fue exitoso
        setMessage(null);
        handleClose();
    };

    return (
        <PopOver isOpen={isOpen} onClose={handleClose} position="center">
            <form className={styles.modalCard} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <div className={styles.detailsWrapper}>
                        <h2 className={styles.title}>
                            Cambiar correo electrónico
                        </h2>
                    </div>

                    <Icon name="Cross" width={24} height={24} className={styles.mainIcon} onClick={handleClose} />
                </div>
                <Text variant="Large">Ingresa tu nuevo correo electrónico</Text>
                <Text variant="Small">Este correo electrónico será el nuevo correo electrónico de tu cuenta. Te notificaremos cuando el cambio de correo electrónico sea exitoso.</Text>
                <label className={styles.inputLabel} htmlFor="newEmail">
                    <span>Correo electrónico</span>
                    <Input id="newEmail" name="newEmail" type="email" className={styles.input} placeholder="example@muniguate.com" required />
                </label>
                {message && <Text variant="Small" className={styles.errorMessage}>{message}</Text>}
                <Button variant="success" className={styles.submitButton} type="submit">
                    Cambiar correo electrónico
                </Button>
            </form>
        </PopOver>
    );
};

export default CasilleroCambioCorreo;