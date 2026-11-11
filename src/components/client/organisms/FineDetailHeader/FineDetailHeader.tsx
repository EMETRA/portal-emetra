"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { FineBreakdown, FineCategory } from "@/types/fines";
import { formatearQuetzales } from "@/lib/casillero/montos";
import styles from "./FineDetailHeader.module.scss";
import CardGeneral from "../../atoms/CardGeneral/CardGeneral";
import CategoryBadge from "../../atoms/CategoryBadge/CategoryBadge";
import PendienteApi from "../../atoms/PendienteApi/PendienteApi";
import { DATOS_DE_EJEMPLO } from "@/lib/casillero/datosDeEjemplo";

const EJEMPLO = DATOS_DE_EJEMPLO.multa;

/**
 * Serie, número, categoría y fecha vienen de la API; si llegan vacíos se muestra el dato
 * de ejemplo, sin marca de pendiente.
 * Lugar, artículo, numeral y evidencia la API todavía no los manda: en su lugar queda una
 * marca de pendiente (TODO [CASILLERO-BACKEND]).
 */
interface FineDetailHeaderProps {
    series?: string;
    number?: string;
    category?: FineCategory;
    /** Total a pagar, en quetzales. */
    totalAmount: number;
    /** Moneda ISO; sin ella se asume GTQ. */
    currency?: string;
    /** Solo si hay recargo o descuento: se muestra bajo el total. */
    breakdown?: FineBreakdown;
    /** Fecha y hora ya formateadas hasta las que vale el monto (validUntil de la API). */
    validUntil?: string;
    /** Motivo de la API cuando no se puede pagar (se muestra con canPay = false). */
    unavailableReason?: string;
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
    /** false = la API dice que no se puede pagar: el botón de pagar queda deshabilitado. */
    canPay?: boolean;
}

export default function FineDetailHeader({
    series,
    number,
    category,
    totalAmount,
    currency,
    breakdown,
    validUntil,
    unavailableReason,
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
            {category && <CategoryBadge category={category} />}
            {!canPay && <span className={styles.status}>No disponible para pago</span>}
        </div>
    );

    const total = formatearQuetzales(totalAmount, currency);

    // Desglose bajo el total como mini tabla (solo si hay recargo o descuento): un concepto
    // por fila, montos uno debajo del otro. En escritorio y tablet va a la derecha; en
    // celular, a todo el ancho bajo el monto. Debajo, el motivo si no se puede pagar.
    const montoOriginal = (
        <>
        {breakdown && (
            <dl className={isMobile ? styles.desgloseMobile : styles.desglose} aria-label="Desglose del monto">
                <div className={styles.desgloseFila}>
                    <dt>Base</dt>
                    <dd>{formatearQuetzales(breakdown.base, currency)}</dd>
                </div>
                {breakdown.surcharge > 0 && (
                    <div className={styles.desgloseFila}>
                        <dt>Recargo</dt>
                        <dd>+{formatearQuetzales(breakdown.surcharge, currency)}</dd>
                    </div>
                )}
                {breakdown.discount > 0 && (
                    <div className={styles.desgloseFila}>
                        <dt>Descuento</dt>
                        <dd>−{formatearQuetzales(breakdown.discount, currency)}</dd>
                    </div>
                )}
            </dl>
        )}
        {canPay && validUntil && <span className={styles.original}>Monto válido hasta el {validUntil}</span>}
        {!canPay && unavailableReason && <span className={styles.original}>{unavailableReason}</span>}
        </>
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
                {series || number ? `${series ?? ""}${number ?? ""}` : EJEMPLO.codigo}
            </h2>

            <div className={styles.mobileBadgeRow}>
                {badges}
                <span className={styles.amount}>{total}</span>
            </div>
            {montoOriginal}

            <div className={styles.mobileBody}>
                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>{date ?? EJEMPLO.fechaLarga}</p>
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
                <h2 className={styles.code}>Serie: {series ?? EJEMPLO.serie}</h2>
                <h2 className={styles.code}>Número: {number ?? EJEMPLO.numero}</h2>
                </div>

                {badges}

                <p className={styles.description}>{description}</p>
                <p className={styles.meta}>
                {date ?? EJEMPLO.fechaLarga}{" "}
                <span className={styles.dot}>•</span>{" "}
                {location ?? <PendienteApi campo="lugar" ejemplo={EJEMPLO.lugar} />}
                </p>
                {articulo}
            </div>

            <div className={styles.rightCol}>
                {/* Total y desglose van juntos; los botones quedan aparte, con su espacio. */}
                <div className={styles.totalBlock}>
                <span className={styles.totalLabel}>Total: {total}</span>
                {montoOriginal}
                </div>
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
