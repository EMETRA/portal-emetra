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
import {
  createPrediceEvent,
  type CreatePrediceEventPayload,
} from "@/lib/predice/api";
import { format } from "date-fns";

const MapInput = dynamic(
  () => import("@/components/client/atoms/MapInput/MapInput"),
  { ssr: false },
);

const tipoEventoOptions = [
  { value: "", label: "Seleccione un tipo de evento" },
  { value: "Deportivos", label: "Deportivo" },
  { value: "Beneficiencia", label: "Beneficencia" },
  { value: "Entretenimiento", label: "Entretenimiento" },
  { value: "Cultural", label: "Cultural" },
  { value: "Religioso", label: "Religioso" },
  { value: "Otro", label: "Otro" },
];

type Parqueo = {
  descripcion: string;
  direccion: string;
  coords: [number, number];
  capacidad: number;
  usados: number;
};

const defaultCoords: [number, number] = [14.6269386, -90.5160683];

function formatDateTimeField(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    date: format(date, "dd/MM/yyyy"),
    time: format(date, "HH:mm:ss"),
  };
}

const Page: React.FC = () => {
  const [coords, setCoords] = useState<[number, number]>(defaultCoords);
  const [parqueos, setParqueos] = useState<Parqueo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const inicio = formatDateTimeField(formData.get("inicio"));
    const fin = formatDateTimeField(formData.get("fin"));

    if (!inicio || !fin) {
      setErrorMessage(
        "Las fechas del evento no son válidas. Verifica los campos de inicio y finalización.",
      );
      return;
    }

    const estimado = Number(formData.get("visitantes") ?? 0);
    if (!Number.isFinite(estimado)) {
      setErrorMessage("El estimado de visitantes debe ser un número válido.");
      return;
    }

    const estado = Number(formData.get("estado") ?? 1);
    const muni = Number(formData.get("muni") ?? 1);

    if (!Number.isFinite(estado) || !Number.isFinite(muni)) {
      setErrorMessage("Los campos Municipio y Estado deben ser numéricos.");
      return;
    }

    const payload: CreatePrediceEventPayload = {
      nombre: String(formData.get("nombre") ?? ""),
      descripcion: String(formData.get("descripcion") ?? ""),
      propietario: String(formData.get("organizador") ?? ""),
      lugar: String(formData.get("direccion") ?? ""),
      fecha_inicial: inicio.date,
      fecha_final: fin.date,
      horai: inicio.time,
      horaf: fin.time,
      tipo: String(formData.get("tipo") ?? ""),
      categoria: String(formData.get("categoria") ?? ""),
      estimado,
      muni,
      chapa: formData.get("chapa")?.toString() || null,
      oficio: formData.get("oficio")?.toString() || null,
      latitud: coords[0],
      longitud: coords[1],
      telefono: String(formData.get("telefono") ?? ""),
      correo: String(formData.get("correo") ?? ""),
      tasa_compensatoria:
        formData.get("tasa_compensatoria")?.toString() || null,
      estado,
      parqueos: parqueos.map((parqueo) => ({
        id: null,
        descripcion: parqueo.descripcion,
        direccion: parqueo.direccion,
        capacidad: parqueo.capacidad,
        reservados: parqueo.usados,
        observaciones: null,
        lat: parqueo.coords[0],
        lng: parqueo.coords[1],
      })),
    };

    try {
      setIsSubmitting(true);
      await createPrediceEvent(payload);
      setSuccessMessage("Evento creado exitosamente.");
      form.reset();
      setCoords(defaultCoords);
      setParqueos([]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible crear el evento. Intenta nuevamente.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddParqueo = () => {
    setParqueos((prev) => [
      ...prev,
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
    setParqueos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleParqueoChange = <K extends keyof Parqueo>(
    idx: number,
    field: K,
    value: Parqueo[K],
  ) => {
    setParqueos((prev) =>
      prev.map((parqueo, index) =>
        index === idx
          ? {
              ...parqueo,
              [field]: value,
            }
          : parqueo,
      ),
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

      {successMessage && (
        <div className={classNames(styles.SuccessMessage)}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className={classNames(styles.ErrorMessage)}>{errorMessage}</div>
      )}

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
          Categoría
          <Input type="text" name="categoria" required />
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
          Municipio (ID)
          <Input type="number" name="muni" min={0} defaultValue={1} required />
        </label>
        <label>
          Estado
          <Input type="number" name="estado" min={0} defaultValue={1} required />
        </label>
        <label>
          Chapa
          <Input type="text" name="chapa" />
        </label>
        <label>
          Oficio
          <Input type="text" name="oficio" />
        </label>
        <label>
          Tasa compensatoria
          <Input type="text" name="tasa_compensatoria" />
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
                        Number(e.target.value),
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
        <Button
          type="submit"
          className={classNames(styles.SubmitButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar evento"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
