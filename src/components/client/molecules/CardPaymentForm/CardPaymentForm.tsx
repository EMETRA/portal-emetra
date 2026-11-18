"use client";

import { useState, type FormEvent } from "react";
import styles from "./CardPaymentForm.module.scss";
import SecurityLogos from "../../atoms/SecurityLogos/SecurityLogos";

export type CardPaymentData = {
        firstName: string; lastName: string; numero: string; expiracion: string; cvv: string;
        addressOne: string; addressTwo: string; locality: string; administrativeArea: string;
        postalCode: string; country: string; email: string; phoneNumber: string;
};

interface CardPaymentFormProps {
    onPagar: (data: CardPaymentData) => void;
    loading?: boolean;
}

export default function CardPaymentForm({ onPagar, loading }: CardPaymentFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [numero, setNumero] = useState("");
    const [expiracion, setExpiracion] = useState("");
    const [cvv, setCvv] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onPagar({
            firstName, lastName, numero: numero.replace(/\s/g, ""), expiracion, cvv,
            addressOne: String(form.get("addressOne") ?? ""), addressTwo: String(form.get("addressTwo") ?? ""),
            locality: String(form.get("locality") ?? ""), administrativeArea: String(form.get("administrativeArea") ?? "").toUpperCase(),
            postalCode: String(form.get("postalCode") ?? ""), country: String(form.get("country") ?? "GT").toUpperCase(),
            email: String(form.get("email") ?? ""), phoneNumber: String(form.get("phoneNumber") ?? "").replace(/\D/g, ""),
        });
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>DATOS DE LA TARJETA</h2>

        <div className={styles.field}>
            <label className={styles.label}>Nombre:</label>
            <input
            type="text"
            className={styles.input}
            placeholder="Nombre en la tarjeta"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            />
        </div>

        <div className={styles.field}>
            <label className={styles.label}>Apellido:</label>
            <input type="text" className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
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
            inputMode="numeric"
            required
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
                required
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
                inputMode="numeric"
                required
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

        <h2 className={styles.title}>DATOS DE FACTURACIÓN</h2>
        <div className={styles.field}><label className={styles.label}>Dirección:</label><input name="addressOne" className={styles.input} required /></div>
        <div className={styles.field}><label className={styles.label}>Complemento de dirección (opcional):</label><input name="addressTwo" className={styles.input} /></div>
        <div className={styles.row}>
            <div className={styles.field}><label className={styles.label}>Municipio/Ciudad:</label><input name="locality" className={styles.input} required /></div>
            <div className={styles.field}><label className={styles.label}>Departamento:</label><input name="administrativeArea" className={styles.input} maxLength={2} placeholder="GT" required /></div>
        </div>
        <div className={styles.row}>
            <div className={styles.field}><label className={styles.label}>Código postal:</label><input name="postalCode" className={styles.input} maxLength={10} required /></div>
            <div className={styles.field}><label className={styles.label}>País:</label><input name="country" className={styles.input} defaultValue="GT" maxLength={2} required /></div>
        </div>
        <div className={styles.row}>
            <div className={styles.field}><label className={styles.label}>Correo:</label><input name="email" type="email" className={styles.input} required /></div>
            <div className={styles.field}><label className={styles.label}>Teléfono:</label><input name="phoneNumber" inputMode="tel" className={styles.input} placeholder="50255555555" required /></div>
        </div>

        <button
            type="submit"
            className={styles.payButton}
            disabled={loading}
        >
            {loading ? "Procesando..." : "PAGAR"}
        </button>
        </form>
    );
}
