"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { EvialEvent, evialRequest } from "@/lib/evial/types";
import { EvialLoading, EvialProblem, Notice } from "./EvialCommon";
import styles from "./Evial.module.scss";
type Material = {
  CONTENIDO_ID: number;
  NOMBRE: string;
  MODULO: number;
  URL: string;
};
type EditorData = { evento: EvialEvent; contenidos: Material[] };
export default function EvialEditor({
  eventId,
  onClose,
  onSaved,
}: {
  eventId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [data, setData] = useState<EditorData | null>(null),
    [loading, setLoading] = useState(Boolean(eventId)),
    [error, setError] = useState<Error | null>(null),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [version, setVersion] = useState(0),
    [material, setMaterial] = useState<Material | null>(null);
  const pending = useRef(false);
  useEffect(() => {
    let active = true;
    if (!eventId) return;
    setLoading(true);
    evialRequest<EditorData>(`administracion/eventos/${eventId}/editor`)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((reason) => {
        if (active) setError(reason);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [eventId, version]);
  async function save(
    event: FormEvent<HTMLFormElement>,
    kind: "evento" | "material",
  ) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget,
      fields = new FormData(form),
      values = Object.fromEntries(fields.entries());
    const body =
      kind === "evento"
        ? { ...values, participantes: Number(values.participantes) }
        : { ...values, modulo: Number(values.modulo) };
    if (
      !window.confirm(
        kind === "evento"
          ? "¿Guardar los datos de esta capacitación?"
          : "¿Guardar este material para los participantes?",
      )
    )
      return;
    pending.current = true;
    setBusy(true);
    setError(null);
    setNotice("");
    try {
      const path =
        kind === "evento"
          ? `administracion/eventos${eventId ? "/" + eventId : ""}`
          : `administracion/eventos/${eventId}/contenidos${material ? "/" + material.CONTENIDO_ID : ""}`;
      await evialRequest(path, {
        method: (kind === "evento" ? eventId : material) ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      setNotice("Cambios guardados.");
      setVersion((old) => old + 1);
      if (kind === "material") {
        setMaterial(null);
        form.reset();
      }
      onSaved();
      if (!eventId) onClose();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason : new Error("No se pudo guardar"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  if (loading) return <EvialLoading />;
  const item = data?.evento;
  return (
    <section className={styles.card}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>ADMINISTRACIÓN DE CONTENIDO</p>
          <h2>{eventId ? "Editar capacitación" : "Nueva capacitación"}</h2>
        </div>
        <button className={styles.secondary} onClick={onClose}>
          Cerrar edición
        </button>
      </div>
      {error && <EvialProblem error={error} />}{" "}
      {notice && <Notice>{notice}</Notice>}
      {(!eventId || data) && (
        <>
          <form onSubmit={(event) => void save(event, "evento")}>
            <fieldset className={styles.formFields} disabled={busy}>
              <label className={styles.field}>
                Nombre
                <input
                  required
                  name="nombre"
                  maxLength={150}
                  defaultValue={item?.NOMBRE}
                />
              </label>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  Fecha de inicio
                  <input
                    required
                    type="date"
                    name="fechaInicio"
                    defaultValue={item?.FECHA_INICIO}
                  />
                </label>
                <label className={styles.field}>
                  Fecha final
                  <input
                    required
                    type="date"
                    name="fechaFinal"
                    defaultValue={item?.FECHA_FINAL}
                  />
                </label>
                <label className={styles.field}>
                  Cupo
                  <input
                    required
                    type="number"
                    min={1}
                    max={999999}
                    name="participantes"
                    defaultValue={item?.PARTICIPANTES || 1}
                  />
                </label>
                <label className={styles.field}>
                  Modalidad
                  <select name="tipo" defaultValue={item?.TIPO || "V"}>
                    <option value="V">Virtual</option>
                    <option value="P">Presencial</option>
                    <option value="F">
                      Virtual sin actividad de participantes
                    </option>
                    <option value="S">Seguimiento con aprobación previa</option>
                  </select>
                </label>
              </div>
              <label className={styles.field}>
                Estado
                <select name="estatus" defaultValue={item?.ESTATUS || "I"}>
                  <option value="I">Inactiva</option>
                  <option value="A">Activa</option>
                </select>
              </label>
              <label className={styles.field}>
                Lugar
                <input
                  name="lugar"
                  maxLength={200}
                  defaultValue={item?.LUGAR || ""}
                />
              </label>
              <label className={styles.field}>
                Descripción
                <textarea
                  name="descripcion"
                  maxLength={4000}
                  rows={4}
                  defaultValue={item?.DESCRIPCION || ""}
                />
              </label>
              <label className={styles.field}>
                URL HTTPS de la imagen
                <input
                  name="imagen"
                  type="url"
                  maxLength={1000}
                  defaultValue={item?.IMAGEN || ""}
                />
              </label>
              <button className={styles.primary} type="submit" disabled={busy}>
                {busy ? "Guardando…" : "Guardar capacitación"}
              </button>
            </fieldset>
          </form>
          <p className={styles.help}>
            Los requisitos, reglas, actividades, patrocinadores y banco de
            preguntas conservan sus catálogos Oracle actuales. Una capacitación
            nueva necesita esos datos antes de publicarse.
          </p>
        </>
      )}
      {data && eventId && (
        <>
          <div className={styles.sectionHeading}>
            <h2>Materiales del curso</h2>
            <button
              className={styles.textLink}
              onClick={() => setMaterial(null)}
            >
              Nuevo material
            </button>
          </div>
          <div className={styles.materials}>
            {data.contenidos.map((row) => (
              <div key={row.CONTENIDO_ID}>
                <div>
                  <small>Módulo {row.MODULO}</small>
                  <strong>{row.NOMBRE}</strong>
                </div>
                <button
                  className={styles.secondary}
                  onClick={() => setMaterial(row)}
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
          <form
            key={material?.CONTENIDO_ID || "nuevo"}
            onSubmit={(event) => void save(event, "material")}
          >
            <fieldset className={styles.formFields} disabled={busy}>
              <h3>{material ? "Editar material" : "Agregar material"}</h3>
              <label className={styles.field}>
                Nombre
                <input
                  required
                  maxLength={200}
                  name="nombre"
                  defaultValue={material?.NOMBRE || ""}
                />
              </label>
              <label className={styles.field}>
                Módulo
                <input
                  required
                  type="number"
                  min={1}
                  name="modulo"
                  defaultValue={material?.MODULO || 1}
                />
              </label>
              <label className={styles.field}>
                URL HTTPS del documento o video
                <input
                  required
                  type="url"
                  maxLength={1000}
                  name="url"
                  defaultValue={material?.URL || ""}
                />
              </label>
              <button className={styles.primary} disabled={busy} type="submit">
                Guardar material
              </button>
            </fieldset>
          </form>
        </>
      )}
    </section>
  );
}
