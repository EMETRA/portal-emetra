'use client'

import styles from "./UnsubscribeForm.module.scss";
import React, { useState } from "react";
import {Input, Button}      from "../../server/atoms/index";
import Select     from "../../atoms/Select/Select";
import { Text } from "@/components/atoms";
import Heading from "../../server/atoms/Heading/Heading";


const UnsubscribeForm: React.FC = () => {
  const [tipoPlaca, setTipoPlaca] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setStatus("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const tipo = (formData.get("tipoPlaca") as string) || "";
    const placa = (formData.get("numeroPlaca") as string) || "";

    const body = {
      Tipo: tipo,
      Placa: placa,
    };

    try {
      const res = await fetch("/api/notificaciones/desuscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Error al eliminar la suscripción");
      }else{
        setStatus("success");
        setMessage(data.message || "Se eliminó la suscripción correctamente");
        form.reset();
        setTipoPlaca("");
      }

      alert(data.message || "Se eliminó la suscripción correctamente");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formBody} onSubmit={handleSubmit}>
      <Heading variant="Medium" className={styles.Title}> Suscripción multas </Heading>

      <div className={styles.section}>
        <Heading variant="Small" className={styles.sectionTitle}> Datos Vehículo </Heading>
        <div className={styles.row}>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Seleccione Tipo de placa</Text>
            <Select
              id="tipoPlaca"
              name="tipoPlaca"
              options={[
                { value: "P", label: "Particular" },
                { value: "M", label: "Moto" },
                { value: "C", label: "Camión" },
              ]}
              value={tipoPlaca}
              onChange={e => setTipoPlaca(e.target.value)}
            />
          </div>

          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Ingrese placa</Text>
            <Input id="numeroPlaca" type="text" name="numeroPlaca" placeholder="########"/>
          </div>
        </div>
      </div>

      {/* Botón */}
      <div className={`${styles.row} ${styles.actions}`}>
        <Button type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Desuscribirse"}
        </Button>
      </div>

      {/* Mensaje de feedback */}
      {message && status === "success" && (
        <p className={styles.successMessage}>{message}</p>
      )}
      {message && status === "error" && (
        <p className={styles.errorMessage}>{message}</p>
      )}
    </form>
  );
};

export default UnsubscribeForm;
