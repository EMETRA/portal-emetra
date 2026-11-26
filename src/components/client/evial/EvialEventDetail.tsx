"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, MapPin, Users } from "lucide-react";
import {
  EvialConfiguration,
  EvialDetail,
  eventDate,
  eventMode,
  evialRequest,
} from "@/lib/evial/types";
import {
  EvialHeading,
  EvialLoading,
  EvialProblem,
  useEvialData,
} from "./EvialCommon";
import styles from "./Evial.module.scss";
type GeoRow = {
  PAIS?: number;
  DEPARTAMENTO?: number;
  MUNICIPIO?: number;
  NOMBRE?: string;
  DESCRIPCION?: string;
};
const geoLabel = (row: GeoRow) =>
  String(
    row.NOMBRE ||
      row.DESCRIPCION ||
      row.MUNICIPIO ||
      row.DEPARTAMENTO ||
      row.PAIS,
  );
export default function EvialEventDetail({ id }: { id: string }) {
  const { data, error, loading, reload } = useEvialData<EvialDetail>(
    "eventos/" + id,
  );
  const config = useEvialData<EvialConfiguration>("configuracion");
  const [tab, setTab] = useState<"inscripcion" | "acceso">("inscripcion"),
    [busy, setBusy] = useState(false),
    [problem, setProblem] = useState<Error | null>(null),
    [pais, setPais] = useState("1"),
    [departamento, setDepartamento] = useState(""),
    [municipio, setMunicipio] = useState(""),
    [code, setCode] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const pending = useRef(false);
  const router = useRouter();
  const countries = useEvialData<GeoRow[]>("catalogos/paises"),
    departments = useEvialData<GeoRow[]>(
      "catalogos/departamentos?pais=" + encodeURIComponent(pais),
    );
  const [towns, setTowns] = useState<GeoRow[]>([]),
    [geoError, setGeoError] = useState<Error | null>(null),
    [geoLoading, setGeoLoading] = useState(false);
  useEffect(() => {
    if (data?.evento.TIPO === "S")
      setValues((old) => ({ ...old, tipoPlaca: "M" }));
  }, [data?.evento.TIPO]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("continuar")) setTab("acceso");
    if (params.get("codigo")) setCode(params.get("codigo") || "");
  }, []);
  useEffect(() => {
    let active = true;
    setTowns([]);
    setMunicipio("");
    setGeoError(null);
    if (!departamento) return;
    setGeoLoading(true);
    evialRequest<GeoRow[]>(
      "catalogos/municipios?pais=" +
        encodeURIComponent(pais) +
        "&departamento=" +
        encodeURIComponent(departamento),
    )
      .then((rows) => {
        if (active) setTowns(rows);
      })
      .catch((reason) => {
        if (active) setGeoError(reason);
      })
      .finally(() => {
        if (active) setGeoLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pais, departamento]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setProblem(null);
    try {
      const payload =
        tab === "acceso"
          ? { codigo: Number(code), dpi: values.dpi, telefono: values.telefono }
          : data?.evento.TIPO === "S"
            ? {
                dpi: values.dpi,
                telefono: values.telefono,
                tipoPlaca: values.tipoPlaca,
                placa: values.placa,
              }
            : {
                ...Object.fromEntries(
                  Object.entries(values).filter(([, v]) => v.trim() !== ""),
                ),
                pais: Number(pais),
                departamento: pais === "1" ? Number(departamento) : 0,
                municipio: pais === "1" ? Number(municipio) : 0,
                zona: Number(values.zona || 0),
              };
      await evialRequest(
        "eventos/" + id + "/" + (tab === "acceso" ? "acceso" : "inscripciones"),
        { method: "POST", body: JSON.stringify(payload) },
      );
      router.push("/evial/mi-curso");
    } catch (reason) {
      setProblem(
        reason instanceof Error
          ? reason
          : new Error("No se pudo completar el registro"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  const field = (
    name: string,
    label: string,
    options: {
      type?: string;
      required?: boolean;
      pattern?: string;
      maxLength?: number;
    } = {},
  ) => (
    <label className={styles.field} key={name}>
      {label}
      {options.required !== false && <span aria-hidden="true"> *</span>}
      <input
        name={name}
        aria-label={label}
        type={options.type || "text"}
        required={options.required !== false}
        value={values[name] || ""}
        onChange={(e) =>
          setValues((old) => ({ ...old, [name]: e.target.value }))
        }
        maxLength={options.maxLength || 100}
        pattern={options.pattern}
        autoComplete={
          name === "correo" ? "email" : name === "telefono" ? "tel" : undefined
        }
      />
    </label>
  );
  if (loading)
    return (
      <main className={styles.page}>
        <EvialLoading />
      </main>
    );
  if (error || !data)
    return (
      <main className={styles.page}>
        <EvialHeading title="Capacitación" />
        <EvialProblem
          error={error || new Error("No se encontró la capacitación")}
          retry={reload}
        />
      </main>
    );
  const course = data.evento,
    geoProblem = countries.error || departments.error || geoError;
  return (
    <main className={styles.page}>
      <EvialHeading
        title={course.NOMBRE}
        description="Revisa los detalles y elige cómo continuar tu formación."
      />
      <div className={styles.detailLayout}>
        <div>
          <section className={styles.detailHero}>
            {course.IMAGEN ? (
              <Image
                unoptimized
                width={600}
                height={400}
                src={course.IMAGEN}
                alt={course.NOMBRE}
              />
            ) : (
              <Image
                unoptimized
                width={600}
                height={400}
                src="/evial/evial-logo.png"
                alt="EVIAL"
              />
            )}
            <span className={styles.pill}>{eventMode(course.TIPO)}</span>
          </section>
          <div className={styles.facts}>
            <div>
              <CalendarDays size={22} />
              <span>
                Inicio<strong>{eventDate(course.FECHA_INICIO)}</strong>
              </span>
            </div>
            <div>
              <MapPin size={22} />
              <span>
                Lugar
                <strong>{course.LUGAR || "Consulta la programación"}</strong>
              </span>
            </div>
            <div>
              <Users size={22} />
              <span>
                Inscripciones
                <strong>
                  {course.INSCRIPCION_ABIERTA ? "Disponibles" : "Cerradas"}
                </strong>
              </span>
            </div>
          </div>
          {course.DESCRIPCION && (
            <section className={styles.card}>
              <h2>Acerca de esta capacitación</h2>
              <p className={styles.prose}>{course.DESCRIPCION}</p>
            </section>
          )}
          {Boolean(data.beneficios.length) && (
            <section className={styles.card}>
              <h2>Qué te ofrece</h2>
              <ul className={styles.checklist}>
                {data.beneficios.map((item) => (
                  <li key={item.BENEFICIO}>
                    <Check size={18} />
                    <div>
                      <strong>{item.NOMBRE}</strong>
                      <p>{item.DESCRIPCION}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {Boolean(data.requisitos.length) && (
            <section className={styles.card}>
              <h2>Antes de inscribirte</h2>
              <ul className={styles.checklist}>
                {data.requisitos.map((item) => (
                  <li key={item.REQUISITO}>
                    <Check size={18} />
                    <span>{item.DESCRIPCION}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {Boolean(data.actividades.length) && (
            <section className={styles.card}>
              <h2>Programación</h2>
              <ol className={styles.timeline}>
                {data.actividades.map((item) => (
                  <li key={item.ACTIVIDAD}>
                    <span />
                    <div>
                      <strong>{item.DESCRIPCION}</strong>
                      <p>
                        {eventDate(item.FECHA)} · {item.FECHA.slice(11, 16)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {Boolean(data.reglas.length) && (
            <section className={styles.card}>
              <h2>Condiciones de participación</h2>
              <ul>
                {data.reglas.map((item) => (
                  <li key={item.REGLA}>{item.DESCRIPCION}</li>
                ))}
              </ul>
            </section>
          )}
          {Boolean(data.patrocinadores.length) && (
            <section className={styles.card}>
              <h2>Nos acompañan</h2>
              <div className={styles.sponsors}>
                {data.patrocinadores.map((item) => (
                  <div key={item.MARCA}>
                    {item.RUTA_IMAGEN && (
                      <Image
                        unoptimized
                        width={600}
                        height={400}
                        src={item.RUTA_IMAGEN}
                        alt={item.NOMBRE}
                      />
                    )}
                    <span>{item.NOMBRE}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className={styles.registration}>
          <div className={styles.card}>
            <p className={styles.eyebrow}>TU PRÓXIMO PASO</p>
            <h2>
              {tab === "acceso"
                ? "Continúa tu capacitación"
                : "Inscríbete en línea"}
            </h2>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Forma de acceso"
            >
              <button
                role="tab"
                aria-selected={tab === "inscripcion"}
                onClick={() => {
                  setTab("inscripcion");
                  setProblem(null);
                }}
              >
                Inscribirme
              </button>
              <button
                role="tab"
                aria-selected={tab === "acceso"}
                onClick={() => {
                  setTab("acceso");
                  setProblem(null);
                }}
              >
                Ya tengo código
              </button>
            </div>
            {config.loading ? (
              <EvialLoading />
            ) : config.error ? (
              <EvialProblem error={config.error} retry={config.reload} />
            ) : !config.data?.registroDisponible ? (
              <p className={styles.notice}>
                El registro y acceso en línea están temporalmente pendientes de
                habilitación. Consulta al personal de EVIAL antes de completar
                tus datos.
              </p>
            ) : !course.INSCRIPCION_ABIERTA && tab === "inscripcion" ? (
              <div className={styles.notice}>
                <p>Las inscripciones de esta capacitación están cerradas.</p>
                <button
                  className={styles.secondary}
                  onClick={() => setTab("acceso")}
                >
                  Ingresar con mi código
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <fieldset disabled={busy} className={styles.formFields}>
                  {tab === "acceso" ? (
                    <>
                      <p>
                        Usa tu código y los datos que registraste al
                        inscribirte.
                      </p>
                      <label className={styles.field}>
                        Código de inscripción *
                        <input
                          required
                          aria-label="Código de inscripción"
                          inputMode="numeric"
                          pattern="[0-9]+"
                          maxLength={10}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </label>
                      {field("dpi", "DPI", {
                        pattern: "[0-9]{13}",
                        maxLength: 13,
                      })}
                      {field("telefono", "Teléfono", {
                        pattern: "[0-9]{8,15}",
                        maxLength: 15,
                      })}
                    </>
                  ) : (
                    <>
                      <p>
                        Tu información se utilizará para registrar y dar
                        seguimiento a esta capacitación.
                      </p>
                      {course.TIPO === "S" ? (
                        <>
                          <p>
                            Utiliza el DPI, teléfono y placa de tu inscripción
                            anterior aprobada. Los datos personales se
                            conservan.
                          </p>
                          {field("dpi", "DPI", {
                            pattern: "[0-9]{13}",
                            maxLength: 13,
                          })}
                          {field("telefono", "Teléfono", {
                            pattern: "[0-9]{8,15}",
                            maxLength: 15,
                          })}
                        </>
                      ) : (
                        <>
                          <div className={styles.formGrid}>
                            {field("nombres", "Nombres")}
                            {field("apellidos", "Apellidos")}
                          </div>
                          {field("dpi", "DPI", {
                            pattern: "[0-9]{13}",
                            maxLength: 13,
                          })}
                          {field("correo", "Correo electrónico (opcional)", {
                            required: false,
                            type: "email",
                            maxLength: 254,
                          })}
                          {field("telefono", "Teléfono", {
                            pattern: "[0-9]{8,15}",
                            maxLength: 15,
                          })}
                          <div className={styles.formGrid}>
                            <label className={styles.field}>
                              País *
                              <select
                                required
                                aria-label="País"
                                value={pais}
                                onChange={(e) => {
                                  setPais(e.target.value);
                                  setDepartamento("");
                                }}
                              >
                                {(countries.data || []).map((row) => (
                                  <option key={row.PAIS} value={row.PAIS}>
                                    {geoLabel(row)}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className={styles.field}>
                              Departamento *
                              <select
                                required
                                aria-label="Departamento"
                                disabled={pais !== "1"}
                                value={departamento}
                                onChange={(e) =>
                                  setDepartamento(e.target.value)
                                }
                              >
                                <option value="">Selecciona</option>
                                {(departments.data || []).map((row) => (
                                  <option
                                    key={row.DEPARTAMENTO}
                                    value={row.DEPARTAMENTO}
                                  >
                                    {geoLabel(row)}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className={styles.formGrid}>
                            <label className={styles.field}>
                              Municipio *
                              <select
                                required
                                aria-label="Municipio"
                                value={municipio}
                                disabled={
                                  pais !== "1" || geoLoading || !departamento
                                }
                                onChange={(e) => setMunicipio(e.target.value)}
                              >
                                <option value="">
                                  {geoLoading ? "Cargando…" : "Selecciona"}
                                </option>
                                {towns.map((row) => (
                                  <option
                                    key={row.MUNICIPIO}
                                    value={row.MUNICIPIO}
                                  >
                                    {geoLabel(row)}
                                  </option>
                                ))}
                              </select>
                            </label>
                            {field("zona", "Zona", {
                              type: "number",
                              maxLength: 2,
                            })}
                          </div>
                          {field("domicilio", "Dirección", {
                            required: true,
                            maxLength: 250,
                          })}
                          {field("fechaNacimiento", "Fecha de nacimiento", {
                            type: "date",
                            required: true,
                          })}
                        </>
                      )}
                      <section className={styles.optionalFields}>
                        <h3>Datos del vehículo</h3>
                        <div className={styles.formGrid}>
                          <label className={styles.field}>
                            Tipo de placa *
                            <select
                              aria-label="Tipo de placa"
                              required
                              disabled={course.TIPO === "S"}
                              value={values.tipoPlaca || ""}
                              onChange={(e) =>
                                setValues((old) => ({
                                  ...old,
                                  tipoPlaca: e.target.value,
                                }))
                              }
                            >
                              <option value="">Selecciona</option>
                              {[
                                "P",
                                "C",
                                "A",
                                "M",
                                "O",
                                "U",
                                "CD",
                                "MI",
                                "DIS",
                                "CC",
                                "E",
                                "EXT",
                                "TC",
                                "TRC",
                              ]
                                .filter(
                                  (value) =>
                                    course.TIPO !== "F" || value !== "M",
                                )
                                .map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                            </select>
                          </label>
                          {field("placa", "Placa", {
                            required: true,
                            maxLength: 15,
                          })}
                          {course.TIPO !== "S" && (
                            <>
                              <label className={styles.field}>
                                Tipo de licencia (opcional)
                                <select
                                  aria-label="Tipo de licencia"
                                  value={values.tipoLicencia || ""}
                                  onChange={(e) =>
                                    setValues((old) => ({
                                      ...old,
                                      tipoLicencia: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Sin indicar</option>
                                  {["A", "B", "C", "E", "M"].map((value) => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              {field("licencia", "Número de licencia", {
                                required: Boolean(values.tipoLicencia),
                                maxLength: 30,
                              })}
                            </>
                          )}
                        </div>
                      </section>
                    </>
                  )}
                  {problem && <EvialProblem error={problem} />}{" "}
                  {tab === "inscripcion" &&
                    course.TIPO !== "S" &&
                    geoProblem && (
                      <EvialProblem
                        error={geoProblem}
                        retry={() => {
                          countries.reload();
                          departments.reload();
                          setDepartamento("");
                        }}
                      />
                    )}
                  <button
                    type="submit"
                    className={styles.primary}
                    disabled={
                      busy ||
                      (tab === "inscripcion" &&
                        course.TIPO !== "S" &&
                        Boolean(
                          geoProblem ||
                            countries.loading ||
                            departments.loading ||
                            geoLoading,
                        ))
                    }
                  >
                    {busy
                      ? "Procesando…"
                      : tab === "acceso"
                        ? "Continuar mi capacitación"
                        : "Confirmar inscripción"}{" "}
                    <ArrowRight size={17} />
                  </button>
                  <small>
                    Conserva tu código. Podrás descargar el comprobante después
                    de confirmar.
                  </small>
                </fieldset>
              </form>
            )}
            <Link href="/evial" className={styles.textLink}>
              Ver otras capacitaciones
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
