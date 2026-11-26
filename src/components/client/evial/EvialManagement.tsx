"use client";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LogOut, QrCode, Search, ShieldCheck } from "lucide-react";
import {
  EvialConfiguration,
  EvialError,
  EvialEvent,
  EvialParticipant,
  EvialStaff,
  evialRequest,
} from "@/lib/evial/types";
import {
  EvialHeading,
  EvialLoading,
  EvialProblem,
  Notice,
  useEvialData,
} from "./EvialCommon";
import EvialCaptcha from "./EvialCaptcha";
import EvialEditor from "./EvialEditor";
import styles from "./Evial.module.scss";
const Scanner = dynamic(() => import("./EvialScanner"), { ssr: false });
type Page = {
  items: EvialParticipant[];
  total: number;
  page: number;
  limit: number;
};
function Login({ reload }: { reload: () => void }) {
  const config = useEvialData<EvialConfiguration>("configuracion"),
    [captcha, setCaptcha] = useState(""),
    [version, setVersion] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null);
  const pending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const fields = new FormData(event.currentTarget);
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      await evialRequest("staff/acceso", {
        method: "POST",
        body: JSON.stringify({
          correo: String(fields.get("correo") || "").trim(),
          clave: String(fields.get("clave") || ""),
          captchaToken: captcha,
        }),
      });
      reload();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudo validar el acceso"),
      );
      setCaptcha("");
      setVersion((value) => value + 1);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <section className={styles.accessCard}>
      <ShieldCheck size={32} />
      <h2>Acceso del personal de EVIAL</h2>
      <p>
        Utiliza tu cuenta institucional. Las opciones disponibles dependen de
        tus permisos asignados.
      </p>
      {config.loading ? (
        <EvialLoading />
      ) : config.error ? (
        <EvialProblem error={config.error} retry={config.reload} />
      ) : !config.data?.staffSiteKey ? (
        <Notice>
          El acceso institucional está pendiente de configuración. Consulta al
          administrador para habilitar la verificación de seguridad.
        </Notice>
      ) : (
        <form onSubmit={submit}>
          <fieldset className={styles.formFields} disabled={busy}>
            <label className={styles.field}>
              Correo institucional
              <input
                required
                name="correo"
                type="email"
                maxLength={254}
                autoComplete="username"
              />
            </label>
            <label className={styles.field}>
              Contraseña
              <input
                required
                name="clave"
                type="password"
                maxLength={256}
                autoComplete="current-password"
              />
            </label>
            <EvialCaptcha
              siteKey={config.data.staffSiteKey}
              onToken={setCaptcha}
              version={version}
            />
            {error && <EvialProblem error={error} />}
            <button
              className={styles.primary}
              type="submit"
              disabled={busy || !captcha}
            >
              {busy ? "Validando acceso…" : "Entrar a gestión EVIAL"}
            </button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
export default function EvialManagement() {
  const session = useEvialData<EvialStaff>("administracion/contexto"),
    [events, setEvents] = useState<EvialEvent[]>([]),
    [eventId, setEventId] = useState(""),
    [search, setSearch] = useState(""),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [version, setVersion] = useState(0),
    [results, setResults] = useState<Page | null>(null),
    [selected, setSelected] = useState<EvialParticipant | null>(null),
    [loading, setLoading] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null),
    [notice, setNotice] = useState(""),
    [scanner, setScanner] = useState(false),
    [step, setStep] = useState("ASISTENCIA"),
    [confirmed, setConfirmed] = useState(false),
    [dpi, setDpi] = useState(""),
    [conflicts, setConflicts] = useState<EvialEvent[] | null>(null);
  const [editor, setEditor] = useState<string | null | undefined>(undefined);
  const pending = useRef(false),
    capabilities = session.data?.capabilities;
  useEffect(() => {
    let active = true;
    if (!capabilities?.consultar) return;
    evialRequest<EvialEvent[]>("administracion/eventos")
      .then((items) => {
        if (active) {
          setEvents(items);
          setEventId((old) => old || String(items[0]?.EVENTO || ""));
        }
      })
      .catch((reason) => {
        if (active) setError(reason);
      });
    return () => {
      active = false;
    };
  }, [capabilities]);
  useEffect(() => {
    let active = true;
    if (!eventId || !capabilities?.consultar) return;
    setLoading(true);
    setError(null);
    evialRequest<Page>("administracion/buscar", {
      method: "POST",
      body: JSON.stringify({ evento: Number(eventId), page, busqueda: query }),
    })
      .then((data) => {
        if (active) {
          setResults(data);
          setSelected((old) =>
            old
              ? data.items.find((item) => item.PERSONA === old.PERSONA) || null
              : null,
          );
        }
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
  }, [eventId, page, query, version, capabilities]);
  const read = useCallback(
    (raw: string) => {
      try {
        const value = JSON.parse(raw);
        if (
          !Number.isSafeInteger(value.evento) ||
          !Number.isSafeInteger(value.persona) ||
          value.evento < 1 ||
          value.persona < 1
        )
          throw new Error();
        if (!events.some((item) => Number(item.EVENTO) === value.evento))
          throw new Error();
        setEventId(String(value.evento));
        setSearch(String(value.persona));
        setQuery(String(value.persona));
        setPage(1);
        setVersion((old) => old + 1);
        setSelected(null);
        setScanner(false);
        setNotice(
          "QR leído. Selecciona a la persona y confirma el paso que corresponde.",
        );
      } catch {
        setError(
          new Error(
            "El QR no corresponde a un comprobante de EVIAL disponible.",
          ),
        );
      }
    },
    [events],
  );
  function choose(item: EvialParticipant) {
    setSelected(item);
    setDpi(item.DPI);
    setConfirmed(false);
    setConflicts(null);
    setError(null);
    setNotice("");
    setStep(
      !["S", "A"].includes(item.ASISTENCIA || "")
        ? "ASISTENCIA"
        : !["S", "A"].includes(item.TEORICO || "")
          ? "TEORICO"
          : "PRACTICO",
    );
  }
  async function action(path: string, method: string, body?: unknown) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    setNotice("");
    try {
      await evialRequest(path, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      setNotice("Operación confirmada. La información se está actualizando.");
      setConfirmed(false);
      setVersion((old) => old + 1);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudo completar la operación"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function showConflicts() {
    if (!selected || pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      setConflicts(
        await evialRequest<EvialEvent[]>(
          `administracion/conflictos/${eventId}/${selected.PERSONA}`,
        ),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudo consultar el historial"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function logout() {
    await evialRequest("staff/sesion", { method: "DELETE" });
    setEvents([]);
    setResults(null);
    setSelected(null);
    session.reload();
  }
  if (session.loading)
    return (
      <main className={styles.page}>
        <EvialHeading title="Gestión de educación vial" />
        <EvialLoading />
      </main>
    );
  if (session.error instanceof EvialError && session.error.status === 401)
    return (
      <main className={styles.page}>
        <EvialHeading title="Gestión de educación vial" />
        <Login reload={session.reload} />
      </main>
    );
  if (session.error || !capabilities)
    return (
      <main className={styles.page}>
        <EvialHeading title="Gestión de educación vial" />
        <EvialProblem
          error={session.error || new Error("No se confirmó el acceso")}
          retry={session.reload}
        />
      </main>
    );
  return (
    <main className={styles.page}>
      <div className={styles.sectionHeading}>
        <EvialHeading
          title="Gestión de educación vial"
          description="Inscripciones, asistencia y seguimiento de participantes."
        />
        <button className={styles.textLink} onClick={() => void logout()}>
          <LogOut size={17} /> Cerrar acceso
        </button>
      </div>
      {!capabilities.consultar ? (
        <Notice>
          Tu cuenta no tiene permiso para consultar las inscripciones. Solicita
          EVIAL_CONSULTAR antes de continuar.
        </Notice>
      ) : (
        <>
          <section className={styles.card}>
            {capabilities.administrar && (
              <div className={styles.actions}>
                <button
                  className={styles.secondary}
                  onClick={() => setEditor(null)}
                >
                  Crear capacitación
                </button>
                <button
                  className={styles.secondary}
                  disabled={!eventId}
                  onClick={() => setEditor(eventId)}
                >
                  Editar capacitación y materiales
                </button>
              </div>
            )}
            <form
              className={styles.managementBar}
              onSubmit={(event) => {
                event.preventDefault();
                setQuery(search.trim());
                setPage(1);
                setVersion((old) => old + 1);
                setSelected(null);
              }}
            >
              <label className={styles.field}>
                Capacitación
                <select
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value);
                    setPage(1);
                    setSelected(null);
                    setConfirmed(false);
                    setQuery("");
                    setSearch("");
                  }}
                >
                  {events.map((item) => (
                    <option key={item.EVENTO} value={item.EVENTO}>
                      {item.EVENTO} · {item.NOMBRE}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                Nombre, DPI o código
                <input
                  maxLength={100}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar participante"
                />
              </label>
              <button
                type="submit"
                className={styles.primary}
                disabled={loading || !eventId}
              >
                <Search size={17} /> Buscar
              </button>
              <button
                type="button"
                className={styles.secondary}
                disabled={!eventId}
                onClick={() => setScanner((old) => !old)}
              >
                <QrCode size={17} /> Leer QR
              </button>
            </form>
            {scanner && (
              <Scanner onRead={read} onClose={() => setScanner(false)} />
            )}
            {loading ? (
              <EvialLoading />
            ) : results?.items.length ? (
              <>
                <div className={styles.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Participante</th>
                        <th>Código / grupo</th>
                        <th>Asistencia</th>
                        <th>Teórico</th>
                        <th>Práctico</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.items.map((item) => (
                        <tr key={item.PERSONA}>
                          <td>
                            <strong>
                              {item.NOMBRES} {item.APELLIDOS}
                            </strong>
                            <span>DPI {item.DPI}</span>
                          </td>
                          <td>
                            {item.PERSONA} / {item.GRUPO}
                          </td>
                          <td>{item.ASISTENCIA || "Pendiente"}</td>
                          <td>{item.TEORICO || "Pendiente"}</td>
                          <td>{item.PRACTICO || "Pendiente"}</td>
                          <td>
                            <button
                              className={styles.secondary}
                              onClick={() => choose(item)}
                            >
                              Ver participante
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.actions}>
                  <small>
                    {results.total} inscripciones · Página {page}
                  </small>
                  <div className={styles.heroActions}>
                    <button
                      className={styles.secondary}
                      disabled={page === 1 || loading}
                      onClick={() => setPage((old) => old - 1)}
                    >
                      Anterior
                    </button>
                    <button
                      className={styles.secondary}
                      disabled={page * 50 >= results.total || loading}
                      onClick={() => setPage((old) => old + 1)}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Notice>
                {events.length
                  ? "No se encontraron inscripciones con estos filtros."
                  : "No hay capacitaciones disponibles para consultar."}
              </Notice>
            )}
            {selected && (
              <section className={styles.selectedParticipant}>
                <div className={styles.sectionHeading}>
                  <div>
                    <p className={styles.eyebrow}>
                      PARTICIPANTE {selected.PERSONA}
                    </p>
                    <h2>
                      {selected.NOMBRES} {selected.APELLIDOS}
                    </h2>
                    <p className={styles.help}>
                      {selected.CORREO_ELECTRONICO} · {selected.TELEFONO}
                    </p>
                  </div>
                  <button
                    className={styles.textLink}
                    onClick={() => setSelected(null)}
                  >
                    Cerrar ficha
                  </button>
                </div>
                {selected.EVIDENCIA_DISPONIBLE && (
                  <a
                    className={styles.secondary}
                    href={`/api/evial/administracion/evidencia/${eventId}/${selected.PERSONA}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir evidencia privada de la actividad
                  </a>
                )}
                {capabilities.asistencia ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (confirmed)
                        void action("administracion/asistencia", "PATCH", {
                          evento: Number(eventId),
                          persona: selected.PERSONA,
                          paso: step,
                        });
                    }}
                  >
                    <fieldset className={styles.formFields} disabled={busy}>
                      <label className={styles.field}>
                        Paso a confirmar
                        <select
                          value={step}
                          onChange={(e) => {
                            setStep(e.target.value);
                            setConfirmed(false);
                          }}
                        >
                          <option value="ASISTENCIA">
                            Asistencia presencial
                          </option>
                          <option value="TEORICO">Paso teórico</option>
                          <option value="PRACTICO">Paso práctico</option>
                        </select>
                      </label>
                      <label className={styles.reviewLabel}>
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                        />{" "}
                        Confirmo la identidad y el paso realizado por este
                        participante.
                      </label>
                      <button
                        className={styles.primary}
                        disabled={!confirmed || busy}
                        type="submit"
                      >
                        Confirmar paso seleccionado
                      </button>
                    </fieldset>
                  </form>
                ) : (
                  <Notice>
                    Consulta habilitada. Tu cuenta no tiene permiso para
                    modificar asistencia.
                  </Notice>
                )}
                <p className={styles.help}>
                  Leer el QR no modifica datos. S = confirmado por el personal ·
                  A = aprobado en el flujo del curso.
                </p>
                {capabilities.administrar && (
                  <details className={styles.optionalFields}>
                    <summary>Correcciones y seguimiento administrativo</summary>
                    <form
                      className={styles.managementBar}
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (
                          window.confirm(
                            "¿Confirmas la corrección del DPI de este participante?",
                          )
                        )
                          void action(
                            `administracion/personas/${selected.PERSONA}/documento`,
                            "PATCH",
                            { dpi },
                          );
                      }}
                    >
                      <label className={styles.field}>
                        DPI correcto
                        <input
                          required
                          pattern="[0-9]{13}"
                          maxLength={13}
                          value={dpi}
                          onChange={(e) => setDpi(e.target.value)}
                        />
                      </label>
                      <button
                        className={styles.secondary}
                        disabled={busy || dpi === selected.DPI}
                        type="submit"
                      >
                        Corregir DPI
                      </button>
                    </form>
                    <div className={styles.actions}>
                      <button
                        className={styles.secondary}
                        disabled={busy}
                        onClick={() => void showConflicts()}
                      >
                        Consultar actividad en otros eventos
                      </button>
                      <button
                        className={styles.secondary}
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Retirar esta inscripción? Solo se permite si todavía no registra actividad.",
                            )
                          )
                            void action(
                              `administracion/inscripciones/${eventId}/${selected.PERSONA}`,
                              "DELETE",
                            );
                        }}
                      >
                        Retirar inscripción sin actividad
                      </button>
                    </div>
                    {conflicts && (
                      <Notice>
                        {conflicts.length
                          ? conflicts
                              .map((item) => `${item.EVENTO} · ${item.NOMBRE}`)
                              .join("; ")
                          : "No se encontró actividad confirmada en otros eventos."}
                      </Notice>
                    )}
                  </details>
                )}
              </section>
            )}
            {error && <EvialProblem error={error} />}{" "}
            {notice && <Notice>{notice}</Notice>}
          </section>
          {editor !== undefined && capabilities.administrar && (
            <EvialEditor
              key={editor || "nueva"}
              eventId={editor}
              onClose={() => setEditor(undefined)}
              onSaved={session.reload}
            />
          )}
        </>
      )}
    </main>
  );
}
