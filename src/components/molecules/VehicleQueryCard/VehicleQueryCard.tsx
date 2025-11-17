import React from "react";
import { Card, Text } from "@components/atoms";
import { Input } from "@/components/server/atoms";
import styles from "./VehicleQueryCard.module.scss";

type Props = {
  plate: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function VehicleQueryCard({ plate, onChange, onSubmit }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const toggleEdit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsEditing((prev) => {
      const next = !prev;
      if (!prev) {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        });
      }
      return next;
    });
  };

  return (
    <Card className={styles.Card}>
        <div className={styles.firstBlock}>
            <div className={styles.Field}>
                <Text variant="Small" className={styles.Label}>
                  PLACA CONSULTADA
                </Text>
                <Input
                  ref={inputRef}
                  type="text"
                  value={plate}
                  onChange={(e) => isEditing && onChange(e.currentTarget.value)}
                  placeholder="C-123ABC"
                  className={styles.Input}
                  aria-label="Placa"
                  disabled={!isEditing}
                  readOnly={!isEditing}
                />
            </div>

            {/* Col 2, fila 1: botón */}
            <button className={styles.CTA} onClick={onSubmit} type="button">Consultar ahora </button>

            {/* Fila 2: Hints — ocupa ambas columnas */}
            <div className={styles.Hints}>
                <div className={styles.block}>
                    <a className={styles.Link} onClick={toggleEdit} aria-pressed={isEditing}
                      aria-label={isEditing ? "Terminar edición de placa" : "Cambiar placa"}
                    >
                      {isEditing ? "Listo" : "Cambiar placa"}
                    </a>
                    <span aria-hidden>·</span>
                </div>

                <div className={styles.hintsBody}>
                    <span className={styles.Muted}>
                        Tipos válidos: P, A, C, M, O, U, E, CD, CI, MI, TCR, TC, EXT, CC, DIS.{" "}
                    </span>
                    <span className={styles.Muted}>Formatos: </span>
                    <span className={styles.tipe_Badge}>TIPO-1XXX</span>
                    <span className={styles.tipe_Badge}>TIPO-11XXX</span>
                    <span className={styles.tipe_Badge}>TIPO-111XXX</span>
                    <span className={styles.Muted}> (sin vocales)</span>
                    <span className={styles.Muted}>Ej.: </span>
                    <span className={styles.tipe_Badge}>P-18RT</span>
                    <span className={styles.tipe_Badge}>M-11CRS</span>
                    <span className={styles.tipe_Badge}>O-111RT</span>   
                </div>
            </div>
        </div>

        {/* pasos */}
        <div className={styles.secondBlock}>
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
        </div>
    </Card>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.Step}>
      <span className={styles.Badge}>{n}</span>

      <h3 className={styles.StepTitle}>
        <Text variant="Large" className={styles.StepTitleText}>
          {title}
        </Text>
      </h3>

      <Text className={styles.StepDesc}>{children}</Text>
    </div>
  );
}
