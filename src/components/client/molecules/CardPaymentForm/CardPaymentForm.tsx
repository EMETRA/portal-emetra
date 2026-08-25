"use client";

import { useState } from "react";
import styles from "./CardPaymentForm.module.scss";
import SecurityLogos from "../../atoms/SecurityLogos/SecurityLogos";

interface CardPaymentFormProps {
    onPagar: (data: { nombre: string; numero: string; expiracion: string; cvv: string }) => void;
    loading?: boolean;
}

export default function CardPaymentForm({ onPagar, loading }: CardPaymentFormProps) {
    const [nombre, setNombre] = useState("");
    const [numero, setNumero] = useState("");
    const [expiracion, setExpiracion] = useState("");
    const [cvv, setCvv] = useState("");

    const handleSubmit = () => {
        onPagar({ nombre, numero, expiracion, cvv });
    };

    return (
        <div className={styles.card}>
        <h2 className={styles.title}>DATOS DE LA TARJETA</h2>

        <div className={styles.field}>
            <label className={styles.label}>Nombre:</label>
            <input
            type="text"
            className={styles.input}
            placeholder="Nombre en la tarjeta"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            />
        </div>

        <div className={styles.field}>
            <label className={styles.label}>Número de tarjeta:</label>
            <input
            type="text"
            className={styles.input}
            placeholder="Número de tarjeta"
            maxLength={19}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            />
        </div>

        <div className={styles.row}>
            <div className={styles.field}>
            <label className={styles.label}>Fecha de expiración</label>
            <input
                type="text"
                className={styles.input}
                placeholder="Expira MM/YY"
                maxLength={5}
                value={expiracion}
                onChange={(e) => setExpiracion(e.target.value)}
            />
            </div>
            <div className={styles.field}>
            <label className={styles.label}>Código de seguridad:</label>
            <input
                type="text"
                className={styles.input}
                placeholder="Código de seguridad"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
            />
            </div>
        </div>

        <div className={styles.cvvHint}>
        <div className={styles.cvvTooltipWrapper}>
            <span className={styles.cvvLink}>¿Qué es esto?</span>
            <div className={styles.tooltip}>
            El código de seguridad (CVV) son los 3 dígitos que se encuentran en el reverso de tu tarjeta.</div>
        </div>
        <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        aria-hidden="true"
        className={styles.cvvArrow}
        >
        {/* curva de abajo-derecha hacia arriba-izquierda */}
        <path
            d="M24 28 C24 16 8 16 4 4"
            stroke="#1b2a6b"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
        />
        {/* punta de flecha apuntando arriba */}
        <path
            d="M2 8 L4 2 L9 6"
            stroke="#1b2a6b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </svg>
        </div>

        <SecurityLogos />

        <button
            type="button"
            className={styles.payButton}
            onClick={handleSubmit}
            disabled={loading}
        >
            {loading ? "Procesando..." : "PAGAR"}
        </button>
        </div>
    );
}