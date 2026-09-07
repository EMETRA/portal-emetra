import React, { useState } from "react";
import * as yup from "yup";
import { CasilleroCambioTelefonoProps } from "./types";
import { Button, Icon, Input } from "@/components/server/atoms";
import { PopOver } from "../../atoms/PopOver";
import { Text } from "@/components/atoms/Text";
import styles from "./CasilleroCambioTelefono.module.scss";
import { editPhoneSchema } from "./editPhone.schema";

export const CasilleroCambioTelefono = ({
    isOpen,
    onClose,
    oldPhone,
}: CasilleroCambioTelefonoProps) => {
    const [message, setMessage] = useState<string | null>(null);

    const handleClose = () => {
        setMessage(null);
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const newPhone = formData.get("newPhone") as string;
        try {
            await editPhoneSchema.validate({ newPhone }, { abortEarly: true });
        } catch (error) {
            setMessage(
                error instanceof yup.ValidationError
                ? error.message
                : "Revisa los campos del formulario."
        );
        return;
        }
        // TODO: Implementar la lógica para cambiar el teléfono
        // TODO: Implementar la lógica para notificar al usuario que el cambio de teléfono fue exitoso
        setMessage(null);
        handleClose();
    };

    return (
        <PopOver isOpen={isOpen} onClose={handleClose} position="center">
            <form className={styles.modalCard} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <div className={styles.detailsWrapper}>
                        <h2 className={styles.title}>
                            Cambiar teléfono
                        </h2>
                    </div>

                    <Icon name="Cross" width={24} height={24} className={styles.mainIcon} onClick={handleClose} />
                </div>
                <Text variant="Large">Ingresa tu nuevo teléfono</Text>
                {/* <Text variant="Small">Este teléfono será el nuevo teléfono de tu cuenta. Te notificaremos cuando el cambio de teléfono sea exitoso.</Text> */}
                {oldPhone && <Text variant="Small">Cambiarás tu teléfono de {oldPhone}</Text>}
                <label className={styles.inputLabel} htmlFor="newPhone">
                    <span>Teléfono</span>
                    <Input id="newPhone" name="newPhone" type="tel" className={styles.input} placeholder="12345678" pattern="[0-9]*" inputMode="numeric" required />
                </label>
                {message && <Text variant="Small" className={styles.errorMessage}>{message}</Text>}
                <Button variant="success" className={styles.submitButton} type="submit">
                    Cambiar teléfono
                </Button>
            </form>
        </PopOver>
    );
};

export default CasilleroCambioTelefono;