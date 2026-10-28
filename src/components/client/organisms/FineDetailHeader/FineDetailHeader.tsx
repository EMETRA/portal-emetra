"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FineCategory } from "@/types/fines";
import type { CasilleroObligationStatus } from "@/lib/casillero/types";
import { ETIQUETA_ESTADO_COBRO } from "@/lib/casillero/obligations";
import styles from "./FineDetailHeader.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import CategoryBadge from "../../atoms/CategoryBadge/CategoryBadge";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";

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

    const articulo =
        article && numeral ? (
            <p className={styles.article}>
                Artículo {article} <span className={styles.dot}>•</span> Numeral {numeral}
            </p>
        ) : (
            <PendienteApi campo="artículo y numeral" />
        );

    const verImagen = (className: string) =>
        onVerImagen ? (
            <button type="button" className={className} onClick={onVerImagen}>
                Ver imagen
            </button>
        ) : (
            <PendienteApi campo="evidencia (imagen)" />
        );

    return (
        <CardGeneral padding="lg" className={styles.card}>
        {isMobile ? (
            <>
            <h2 className={styles.code}>
                {series && number ? `Remisión: ${series}${number}` : <PendienteApi campo="serie y número" />}
            </h2>

            <div className={styles.mobileBadgeRow}>
                {badges}
                <span className={styles.amount}>Q{totalAmount}</span>
            </div>
            {montoOriginal}

            <div className={styles.mobileBody}>
                <p className={styles.description}>{description}</p>
                {date ? <p className={styles.meta}>{date}</p> : <PendienteApi campo="fecha" />}
                {location ? <p className={styles.meta}>{location}</p> : <PendienteApi campo="lugar" />}
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
                {/* Sin ningún dato, solo las marcas: no queda una fila vacía ocupando espacio. */}
                {series || number ? (
                    <div className={styles.codeRow}>
                    {series ? <h2 className={styles.code}>Serie: {series}</h2> : <PendienteApi campo="serie" />}
                    {number ? <h2 className={styles.code}>Número: {number}</h2> : <PendienteApi campo="número" />}
                    </div>
                ) : (
                    <PendienteApi campo="serie y número" />
                )}

                {badges}

                <p className={styles.description}>{description}</p>
                {date && location ? (
                    <p className={styles.meta}>
                    {date} <span className={styles.dot}>•</span> {location}
                    </p>
                ) : date || location ? (
                    <p className={styles.meta}>
                    {date ?? <PendienteApi campo="fecha" />} {location ?? <PendienteApi campo="lugar" />}
                    </p>
                ) : (
                    <>
                    <PendienteApi campo="fecha" />
                    <PendienteApi campo="lugar" />
                    </>
                )}
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
