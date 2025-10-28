import React from "react";
import {Card, Text} from "@components/atoms/index"
import {Input} from "@/components/server/atoms"
import styles from "./VehicleQueryCard.module.scss"
import classNames from "classnames";

type Props = {
  plate: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};


export default function VehicleQueryCard({ plate, onChange, onSubmit }: Props) {
    return (
        <Card className={styles.Card}>
            {/* fila: label + input + botón */}
            <div className={styles.Row}>
                <div className={styles.Field}>
                    <Text variant="Small" className={styles.Label}>
                        PLACA CONSULTADA
                    </Text>
                    <Input
                        type="text"
                        value={plate}
                        onChange={(e) => onChange(e.currentTarget.value)}
                        placeholder="C-123ABC"
                        className={styles.Input}
                        aria-label="Placa"
                    />
                </div>

                <button className={styles.CTA} onClick={onSubmit} type="button">
                    Consultar ahora
                </button>
            </div>

            {/* hints debajo */}
            <div className={styles.Hints}>
                <a className={styles.Link} href="#">Cambiar placa</a>
                <span aria-hidden>·</span>
                <span className={styles.Muted}>
                    Tipos válidos: P, A, C, M, O, U, E, CD, CI, MI, TCR, TC, EXT, CC, DIS
                </span>
            </div>

            {/* pasos */}
            <div className={styles.Steps}>
                <Step n={1} title="Consulta">
                    Ingresa tu placa y verifica tus remisiones.
                </Step>
                <Step n={2} title="Paga">
                    En línea, POS, bancos del sistema o cajas municipales.
                </Step>
                <Step n={3} title="Constancia">
                    Descarga tu comprobante digital al instante.
                </Step>
            </div>
        </Card>
    );
}

function Step({ n, title, children }: { n:number; title:string; children: React.ReactNode }) {
    return (
        <div className={styles.Step}>
            <span className={styles.Badge}>{n}</span>

            <h3 className={styles.StepTitle}>
                <Text variant="Large" className={styles.StepTitleText}>{title}</Text>
            </h3>

            <Text className={styles.StepDesc}>{children}</Text>
        </div>
    );
}
