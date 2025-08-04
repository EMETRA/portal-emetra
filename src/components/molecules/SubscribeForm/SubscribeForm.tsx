'use client'
import React, { useState } from "react";
import {Input, Button}      from "../../server/atoms/index";
import Select     from "../../atoms/Select/Select";
import RadioGroup from "../../atoms/RadioGroup/RadioGroup";
import styles     from "./SubscribeForm.module.scss";
import { Text } from "@/components/atoms";
import Heading from "../../server/atoms/Heading/Heading";
const SubscribeForm: React.FC = () => {
  const [sexo, setSexo] = useState("");
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [tipoPlaca, setTipoPlaca] = useState("");
  const [suscripcion, setSuscripcion] = useState("diario");

  return (
    <form className={styles.formBody}>
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
                { value: "OP1", label: "OP1" },
                { value: "OP2", label: "OP2" },
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
                { label: "Mensual", value: "mensual" },
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
