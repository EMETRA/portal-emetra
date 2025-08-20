"use client";
import { Separator } from "@/components/atoms/Separator";
import { Button, Input } from "@/components/server/atoms";
import Select from "@/components/atoms/Select/Select";
import classNames from "classnames";
import styles from "./page.module.scss";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@/components/server/atoms";

const MapInput = dynamic(
  () => import("@/components/client/atoms/MapInput/MapInput"),
  { ssr: false }
);

const tipoEventoOptions = [
  { value: "", label: "Seleccione un tipo de evento" },
  { value: "concierto", label: "Concierto" },
  { value: "deportivo", label: "Deportivo" },
  { value: "religioso", label: "Religioso" },
  { value: "cultural", label: "Cultural" },
  { value: "otro", label: "Otro" },
];

type Parqueo = {
  descripcion: string;
  direccion: string;
  coords: [number, number];
  capacidad: number;
  usados: number;
};

const defaultCoords: [number, number] = [14.6269386, -90.5160683];

const Page: React.FC = () => {
  const [coords, setCoords] = useState<[number, number]>(defaultCoords);
  const [parqueos, setParqueos] = useState<Parqueo[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const data = {
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion"),
      tipo: formData.get("tipo"),
      organizador: formData.get("organizador"),
      telefono: formData.get("telefono"),
      correo: formData.get("correo"),
      visitantes: formData.get("visitantes"),
      inicio: formData.get("inicio"),
      fin: formData.get("fin"),
      direccion: formData.get("direccion"),
      coords, // ubicación del evento
      parqueos,
    };

    console.log(data);
  };

  const handleAddParqueo = () => {
    setParqueos([
      ...parqueos,
      {
        descripcion: "",
        direccion: "",
        coords: defaultCoords,
        capacidad: 0,
        usados: 0,
      },
    ]);
  };

  const handleRemoveParqueo = (idx: number) => {
    setParqueos(parqueos.filter((_, i) => i !== idx));
  };

  const handleParqueoChange = (
    idx: number,
    field: keyof Parqueo,
    value: any
  ) => {
    setParqueos((prev) =>
      prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              [field]: value,
            }
          : p
      )
    );
  };

  return (
    <div className={classNames(styles.FormWrapper)}>
      <Link href="/predice" className={classNames(styles.BackButton)}>
        ← Volver
      </Link>
      <Separator>
        <h1>Nuevo Evento</h1>
      </Separator>
      <div className={classNames(styles.Alert)}>
        <strong>Advertencia</strong>
        <p className={classNames(styles.AlertText)}>
          DECLARO: a) Que los datos e información suministrada son fidedignos y
          que conozco las consecuencias de una declaración falsa; b) Que eximo
          de toda responsabilidad administrativa, civil, penal o de cualquier
          otra índole a EMETRA y Municipalidad de Guatemala; c) Que me
          comprometo a cumplir con el plan de estacionamiento de vehículos del
          evento en la fecha, lugar y horario autorizado por EMETRA, sin
          perjuicio de las autorizaciones o permisos de otras autoridades, que
          deban obtener para su realización los organizadores de eventos.
        </p>
      </div>

      <Separator>
        <h2>Datos del evento</h2>
      </Separator>
      <form className={classNames(styles.Form)} onSubmit={handleSubmit}>
        <label>
          Nombre del evento
          <Input type="text" name="nombre" required />
        </label>
        <label>
          Descripción
          <Input type="text" name="descripcion" required />
        </label>
        <label>
          Tipo
          <Select name="tipo" options={tipoEventoOptions} required />
        </label>
        <label>
          Organizador o Representante Legal
          <Input type="text" name="organizador" required />
        </label>
        <label>
          Número de Teléfono
          <Input type="tel" name="telefono" required />
        </label>
        <label>
          Correo Electrónico
          <Input type="email" name="correo" required />
        </label>
        <label>
          Estimado de visitantes
          <Input type="number" name="visitantes" min={0} required />
        </label>
        <label>
          Fecha y hora de inicio
          <Input type="datetime-local" name="inicio" required />
        </label>
        <label>
          Fecha y hora de finalización
          <Input type="datetime-local" name="fin" required />
        </label>
        <label>
          Lugar o Dirección
          <Input type="text" name="direccion" required />
        </label>
        <Separator>
          <h2>Ubicación del Evento</h2>
        </Separator>
        <p>
          Arrastra el marcador para ajustar la ubicación del evento. Asegúrate
          de que el marcador esté en el centro del área del evento.
        </p>
        <MapInput value={coords} onChange={setCoords} />

        <Separator>
          <h2>Parqueos del Evento</h2>
        </Separator>
        <div>
          {parqueos.map((parqueo, idx) => (
            <div key={idx} className={classNames(styles.ParqueoCard)}>
              <div className={classNames(styles.ParqueoHeader)}>
                <strong>Parqueo #{idx + 1}</strong>
                <Button
                  type="button"
                  variant="danger"
                  className={classNames(styles.RemoveButton)}
                  onClick={() => handleRemoveParqueo(idx)}
                  title="Eliminar parqueo"
                >
                  <Icon name="Delete" />
                </Button>
              </div>
              <div className={classNames(styles.ParqueoForm)}>
                <label>
                  Nombre o descripción
                  <Input
                    type="text"
                    value={parqueo.descripcion}
                    onChange={(e) =>
                      handleParqueoChange(idx, "descripcion", e.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Dirección
                  <Input
                    type="text"
                    value={parqueo.direccion}
                    onChange={(e) =>
                      handleParqueoChange(idx, "direccion", e.target.value)
                    }
                    required
                  />
                </label>
                <label>
                  Latitud y Longitud
                  <MapInput
                    value={parqueo.coords}
                    onChange={(val) => handleParqueoChange(idx, "coords", val)}
                  />
                </label>
                <label>
                  Capacidad Total
                  <Input
                    type="number"
                    min={0}
                    value={parqueo.capacidad}
                    onChange={(e) =>
                      handleParqueoChange(
                        idx,
                        "capacidad",
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </label>
                <label>
                  Capacidad Usada
                  <Input
                    type="number"
                    min={0}
                    value={parqueo.usados}
                    onChange={(e) =>
                      handleParqueoChange(idx, "usados", Number(e.target.value))
                    }
                    required
                  />
                </label>
              </div>
              <Separator />
            </div>
          ))}
          <Button
            type="button"
            variant="success"
            className={classNames(styles.AddButton)}
            onClick={handleAddParqueo}
          >
            + Agregar parqueo
          </Button>
        </div>
        <Button type="submit" className={classNames(styles.SubmitButton)}>
          Enviar evento
        </Button>
      </form>
    </div>
  );
};

export default Page;
