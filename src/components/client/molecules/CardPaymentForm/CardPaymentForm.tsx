"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./CardPaymentForm.module.scss";
import SecurityLogos from "../../atoms/SecurityLogos/SecurityLogos";
import { fetchMyContacts } from "@/lib/casillero/api";
import { useCasilleroProfileStore } from "@/store/useCasilleroProfileStore";

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
    const profile = useCasilleroProfileStore((state) => state.profile);
    const [firstName, setFirstName] = useState("");
    const [numero, setNumero] = useState("");
    const [expiracion, setExpiracion] = useState("");
    const [cvv, setCvv] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        if (!email && profile?.email) setEmail(profile.email);
    }, [email, profile?.email]);

    useEffect(() => {
        let active = true;
        void fetchMyContacts().then((result) => {
            if (!active) return;
            const contacts = result.items ?? [];
            const emailContact = contacts.find((contact) => contact.type === "EMAIL" && contact.primary)
                ?? contacts.find((contact) => contact.type === "EMAIL");
            const phoneContact = contacts.find((contact) => contact.type === "PHONE" && contact.primary)
                ?? contacts.find((contact) => contact.type === "PHONE");
            if (emailContact?.value && !email) setEmail(emailContact.value);
            if (phoneContact?.value && !phoneNumber) setPhoneNumber(phoneContact.value);
        }).catch(() => {
            // El correo del perfil sigue disponible como respaldo; el usuario puede completar los datos.
        });
        return () => { active = false; };
    }, []);

    const formatExpiration = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onPagar({
            firstName, lastName: "", numero: numero.replace(/\s/g, ""), expiracion, cvv,
            addressOne: String(form.get("addressOne") ?? ""), addressTwo: String(form.get("addressTwo") ?? ""),
            locality: String(form.get("locality") ?? ""), administrativeArea: String(form.get("administrativeArea") ?? "").toUpperCase(),
            postalCode: String(form.get("postalCode") ?? ""), country: String(form.get("country") ?? "GT").toUpperCase(),
            email, phoneNumber: phoneNumber.replace(/\D/g, ""),
        });
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>DATOS DE LA TARJETA</h2>

        <div className={styles.field}>
            <label className={styles.label}>Nombre de la tarjeta:</label>
            <input
            type="text"
            className={styles.input}
            placeholder="Nombre completo en la tarjeta"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
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
                onChange={(e) => setExpiracion(formatExpiration(e.target.value))}
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
