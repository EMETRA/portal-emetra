'use client'
import React from "react";
import { Card, Text } from "@components/atoms";
import { Input } from "@/components/server/atoms";
import styles from "./VehicleQueryCard.module.scss";

type Props = {
  initialPlate: string;
};

export default function VehicleQueryCard({ initialPlate = "" }: Props) {
  const [plate, setPlate] = React.useState(initialPlate);
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageType, setMessageType] = React.useState<"success" | "error" | null>(null);
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

  const previewPDF = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setMessageType(null);

      //Consultar remisiones
      const consulta = await fetch("/api/sat/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate }),
      });

      if (!consulta.ok) {
        const errorData = await consulta.json();
        setMessage(errorData.message || "Error al consultar remisiones");
        return;
      }

      const consultaJson = await consulta.json().catch(() => null);

      if (!consultaJson) {
        setMessage("Error al consultar remisiones");
        setMessageType("error");
        return;
      }

      if (consultaJson.error === true) {
        setMessage("Placa solvente");
        setMessageType("success");
        return;
      }

      if (consultaJson.success !== true) {
        setMessage(consultaJson.message || "Error al consultar remisiones");
        setMessageType("error");
        return;
      }

      //Generar PDF
      const pdfRes = await fetch("/api/sat/getpdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate }),
      });

      if (!pdfRes.ok) {
        const errorData = await pdfRes.json().catch(() => null);
        setMessage(
          errorData?.message || "No se pudo obtener la notificación en PDF"
        );
        setMessageType("error");
        return;
      }

      const pdfData = await pdfRes.json();

      const res = await fetch("/api/sat/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pdfData),
      });

      if (!res.ok) {
        console.error("No se pudo generar el PDF");
        setMessage("No se pudo generar el PDF.");
        setMessageType("error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      setLoading(false);
    }
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
                  onChange={(e) => isEditing && setPlate(e.currentTarget.value)}
                  placeholder="C-123ABC"
                  className={styles.Input}
                  aria-label="Placa"
                  disabled={!isEditing || loading}
                  readOnly={!isEditing}
                />
            </div>

            {/* Col 2, fila 1: botón */}
            <button className={styles.CTA} onClick={previewPDF} type="button"> {loading ? "Consultando..." : "Consultar ahora"} </button>

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
            {message && messageType === "success" && (
              <div className={styles.SolventBanner}>
                <Text variant="Small" className={styles.SolventText}>
                  {message}
                </Text>
              </div>
            )}

            {message && messageType === "error" && (
              <Text variant="Small" className={styles.ErrorText}>
                {message}
              </Text>
            )}
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
