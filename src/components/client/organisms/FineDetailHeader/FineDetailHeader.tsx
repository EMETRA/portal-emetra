"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FineCategory } from "@/types/fines";
import type { CasilleroObligationStatus } from "@/lib/casillero/types";
import { ETIQUETA_ESTADO_COBRO } from "@/lib/casillero/obligations";
import styles from "./FineDetailHeader.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import CategoryBadge from "../../atoms/CategoryBadge/CategoryBadge";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";

const EJEMPLO = DATOS_DE_EJEMPLO.multa;

/**
 * Los datos opcionales son los que la API de Cobros todavía no manda; en su lugar queda
 * una marca de pendiente (TODO [CASILLERO-BACKEND]).
 */
interface FineDetailHeaderProps {
    series?: string;
    number?: string;
    category?: FineCategory;
    totalAmount: number;
    /** Monto original, cuando es mayor que lo que falta por pagar (pago parcial). */
    originalAmount?: number;
    status?: CasilleroObligationStatus;
    description: string;
    date?: string;
    location?: string;
    article?: string;
    numeral?: string;
    /** Sin evidencia no se muestra el botón "Ver imagen". */
    onVerImagen?: () => void;
    /** true = "Ver imagen" abre una imagen de ejemplo; se marca como pendiente. */
    evidenciaDeEjemplo?: boolean;
    onPayThis: () => void;
    /** false = lo pagado o con pago en proceso: el botón de pagar queda deshabilitado. */
    canPay?: boolean;
}

export default function FineDetailHeader({
    series,
    number,
    category,
    totalAmount,
    originalAmount,
    status,
    description,
    date,
    location,
    article,
    numeral,
    onVerImagen,
    evidenciaDeEjemplo,
    onPayThis,
    canPay = true,
}: FineDetailHeaderProps) {
    const isMobile = useMediaQuery("(max-width: 520px)");

    const badges = (
        <div className={styles.badges}>
            {category ? <CategoryBadge category={category} /> : <PendienteApi campo="categoría" />}
            {status && (
                <span className={`${styles.status} ${styles[`status_${status}`] ?? ""}`}>
                    {ETIQUETA_ESTADO_COBRO[status]}
                </span>
            )}
        </div>
    );

    const montoOriginal = originalAmount !== undefined && (
        <span className={styles.original}>Monto original: Q{originalAmount}</span>
    );

    // El diseño se mantiene completo: donde falta un dato queda su marca de pendiente.
    const articulo = (
        <p className={styles.article}>
            Artículo {article ?? <PendienteApi campo="artículo" ejemplo={EJEMPLO.articulo} />}{" "}
            <span className={styles.dot}>•</span>{" "}
            Numeral {numeral ?? <PendienteApi campo="numeral" ejemplo={EJEMPLO.numeral} />}
        </p>
    );

    // Sin evidencia el botón se ve, pero deshabilitado.
    const verImagen = (className: string) => (
        <>
        <button type="button" className={className} onClick={onVerImagen} disabled={!onVerImagen}>
            Ver imagen
        </button>
        {(!onVerImagen || evidenciaDeEjemplo) && <PendienteApi campo="evidencia (imagen)" />}
        </>
    );

    return (
        <CardGeneral padding="lg" className={styles.card}>
        {isMobile ? (
            <>
            <h2 className={styles.code}>
                Remisión:{" "}
                {series && number ? `${series}${number}` : <PendienteApi campo="serie y número" ejemplo={EJEMPLO.codigo} />}
            </h2>

            <div className={styles.mobileBadgeRow}>
                {badges}
                <span className={styles.amount}>Q{totalAmount}</span>
            </div>
            {montoOriginal}

            <div className={styles.mobileBody}>
                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>{date ?? <PendienteApi campo="fecha" ejemplo={EJEMPLO.fechaLarga} />}</p>
                <p className={styles.meta}>{location ?? <PendienteApi campo="lugar" ejemplo={EJEMPLO.lugar} />}</p>
                {articulo}
                {verImagen(styles.verImagenButtonMobile)}
                <button type="button" className={styles.payButtonMobile} onClick={onPayThis} disabled={!canPay}>
                Pagar esta multa
                </button>
            </div>
            </>
        ) : (
            <div className={styles.topGrid}>
            <div className={styles.leftCol}>
                <div className={styles.codeRow}>
                <h2 className={styles.code}>Serie: {series ?? <PendienteApi campo="serie" ejemplo={EJEMPLO.serie} />}</h2>
                <h2 className={styles.code}>Número: {number ?? <PendienteApi campo="número" ejemplo={EJEMPLO.numero} />}</h2>
                </div>

                {badges}

                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>
                {date ?? <PendienteApi campo="fecha" ejemplo={EJEMPLO.fechaLarga} />}{" "}
                <span className={styles.dot}>•</span>{" "}
                {location ?? <PendienteApi campo="lugar" ejemplo={EJEMPLO.lugar} />}
                </p>
                {articulo}
            </div>

            <div className={styles.rightCol}>
                <span className={styles.totalLabel}>Total: Q{totalAmount}</span>
                {montoOriginal}
                <div className={styles.buttonCol}>
                {verImagen(styles.verImagenButton)}
                <button type="button" className={styles.payButton} onClick={onPayThis} disabled={!canPay}>
                    Pagar esta multa
                </button>
                </div>
            </div>
            </div>
        )}
        </CardGeneral>
    );
}
