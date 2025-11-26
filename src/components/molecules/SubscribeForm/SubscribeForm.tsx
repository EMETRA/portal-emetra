'use client'
import React, { useState } from "react";
import {Input, Button}      from "../../server/atoms/index";
import Select     from "../../atoms/Select/Select";
import RadioGroup from "../../atoms/RadioGroup/RadioGroup";
import styles     from "./SubscribeForm.module.scss";
import { Text } from "@/components/atoms";
import Heading from "../../server/atoms/Heading/Heading";
import { DiameterIcon } from "lucide-react";

const suscripcionMap: Record<string, number> = {
  diario: 1,
  semanal: 2,
  anual: 3,
}

const SubscribeForm: React.FC = () => {
  const [sexo, setSexo] = useState("");
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [tipoPlaca, setTipoPlaca] = useState("");
  const [suscripcion, setSuscripcion] = useState("diario");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const nombre = (formData.get("nombres") as string) || "";
    const apellido = (formData.get("apellidos") as string) || "";
    const email = (formData.get("correo") as string) || "";
    const direccion = (formData.get("direccion") as string) || "";
    const telefono = (formData.get("telefono") as string) || "";
    const fechaNacRaw = (formData.get("nacimiento") as string) || "";
    const numeroPlaca = (formData.get("numeroPlaca") as string) || "";
    const empresa = (formData.get("nombreEmpresa") as string) || "";

    const fechaNac = fechaNacRaw ? fechaNacRaw.replace(/-/g, "/") : undefined;

    const body = {
      nombre,
      apellido,
      email,
      direccion: direccion || undefined,
      telefono: telefono || undefined,
      sexo: sexo || undefined,
      tipo_sol: tipoSolicitud, 
      fechaNac,
      suscripcion: suscripcionMap[suscripcion],
      placas: [
        {
          tipo_placa: tipoPlaca,
          numero_placa: numeroPlaca,
        },
      ],
      empresa: empresa || undefined,
    };

    try {
      const res = await fetch("/api/notificaciones/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error suscripción:", data);
        alert(data.message || "Error al crear suscripción");
        return;
      }

      alert(data.message || "Suscripción creada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <form className={styles.formBody} onSubmit={handleSubmit}>
      <Heading variant="Medium" className={styles.Title}> Suscripción multas </Heading>
      {/* Seccion datos personales */}
      <div className={styles.section}>
        <Heading variant="Small" className={styles.sectionTitle}> Datos personales </Heading>
        <div className={styles.row}>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Nombres</Text>
            <Input id="nombre" type ="text" name="nombres" placeholder="Nombre"/>
          </div>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Apellidos</Text>
            <Input id="apellido" type ="text" name="apellidos" placeholder="Apellido"/>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Fecha de Nacimiento</Text>
            <Input id="nacimiento" type ="date" name="nacimiento" placeholder="DD/MM/YYYY"/>          
          </div>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Correo electrónico</Text>
            <Input id="correo" type ="email" name="correo" placeholder="Ejemplo: juan@gmail.com"/>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Sexo</Text>
            <Select
              id="sexo"
              name="sexo"
              options={[
                { value: "M", label: "Masculino" },
                { value: "F", label: "Femenino" },
              ]}
              value={sexo}
              onChange={e => setSexo(e.target.value)}
            />
          </div>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Teléfono</Text>
            <Input id="telefono" type="tel" name="telefono" placeholder="########"/>
          </div>
        </div>

        <div className={`${styles.row} ${styles.fullWidth}`}>
          <div className={styles.formControl}>
              <Text variant="Small" className={styles.TextStyle}>Dirección</Text>
              <Input id="direccion" type="text" name="direccion" placeholder="###############"/>
          </div>
        </div>

      </div>

      {/* Sección datos institucionales */}
      <div className={styles.section}>
        <Heading variant="Small" className={styles.sectionTitle}> Datos Institucionales </Heading>

        <div className={styles.row}>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Tipo de solicitud</Text>
            <Select
              id="tipoSolicitud"
              name="tipoSolicitud"
              options={[
                { value: "I", label: "Individual" },
                { value: "E", label: "Empresa" },
              ]}
              value={tipoSolicitud}
              onChange={e => setTipoSolicitud(e.target.value)}
            />
          </div>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Nombre Empresa</Text>
            <Input id="nombreEmpresa" type="text" name="nombreEmpresa" placeholder="########"/>
          </div>
        </div>
      </div>

      {/* Sección datos vehiculares */}
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

      {/* Seccion datos Sustripción */}
      <div className={styles.section}>
        <Heading variant="Small" className={styles.sectionTitle}> Datos Suscripción </Heading>
        <div className={styles.row}>
          <div className={styles.formControl}>
            <Text variant="Small" className={styles.TextStyle}>Tipo de suscripción</Text>
            <RadioGroup
              name="suscripcion"
              options={[
                { label: "Diario", value: "diario" },
                { label: "Semanal", value: "semanal" },
                { label: "Anual", value: "mensual" },
              ]}
              selected={suscripcion}
              onChange={setSuscripcion}
            />
          </div>
        </div>
      </div>

      {/* Botón */}
      <div className={`${styles.row} ${styles.actions}`}>
        <Button type="submit">Suscribirse</Button>
      </div>
    </form>
  );
};

export default SubscribeForm;
