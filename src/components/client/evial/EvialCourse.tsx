"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  LogOut,
  Send,
  Users,
} from "lucide-react";
import {
  EvialConfiguration,
  EvialCourse,
  EvialError,
  EvialEvent,
  EvialExam,
  EvialPupil,
  evialRequest,
} from "@/lib/evial/types";
import {
  EvialHeading,
  EvialLoading,
  EvialProblem,
  Notice,
  useEvialData,
} from "./EvialCommon";
import styles from "./Evial.module.scss";

function ChooseCourse() {
  const courses = useEvialData<EvialEvent[]>("eventos?finalizados=1");
  const [id, setId] = useState("");
  return (
    <section className={styles.accessCard}>
      <BookOpen size={36} />
      <h2>Continúa donde te quedaste</h2>
      <p>
        Selecciona tu capacitación e ingresa con el código, DPI y teléfono de tu
        inscripción.
      </p>
      {courses.loading ? (
        <EvialLoading />
      ) : courses.error ? (
        <EvialProblem error={courses.error} retry={courses.reload} />
      ) : (
        <>
          <label className={styles.field}>
            Capacitación
            <select value={id} onChange={(e) => setId(e.target.value)}>
              <option value="">Selecciona tu capacitación</option>
              {(courses.data || []).map((course) => (
                <option key={course.EVENTO} value={course.EVENTO}>
                  {course.NOMBRE}
                </option>
              ))}
            </select>
          </label>
          {id && (
            <Link
              className={styles.primary}
              href={"/evial/" + id + "?continuar=1"}
            >
              Ingresar con mi código
            </Link>
          )}
          {!courses.data?.length && (
            <Notice>
              No hay capacitaciones activas para continuar en este momento.
            </Notice>
          )}
        </>
      )}
      <Link href="/evial" className={styles.textLink}>
        Explorar capacitaciones
      </Link>
    </section>
  );
}

function Exam({
  exam,
  onComplete,
  onBack,
}: {
  exam: EvialExam;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Record<string, number | null>>({}),
    [ends, setEnds] = useState(() => Date.now() + 120000),
    [now, setNow] = useState(Date.now()),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null);
  const pending = useRef(false),
    current = exam.preguntas[index],
    key = `${current.MODULO}:${current.PREGUNTA}`;
  const answerRef = useRef(answers);
  useEffect(() => {
    answerRef.current = answers;
  }, [answers]);
  const remaining = Math.max(0, Math.ceil((ends - now) / 1000));
  const send = useCallback(
    async (values: Record<string, number | null>) => {
      if (pending.current) return;
      pending.current = true;
      setBusy(true);
      setError(null);
      try {
        await evialRequest("mi-curso/examen/responder", {
          method: "POST",
          body: JSON.stringify({
            intentoToken: exam.intentoToken,
            respuestas: exam.preguntas.map((q) => ({
              modulo: Number(q.MODULO),
              pregunta: Number(q.PREGUNTA),
              opcion: values[`${q.MODULO}:${q.PREGUNTA}`] ?? null,
            })),
          }),
        });
        onComplete();
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason
            : new Error("No se pudo enviar el intento"),
        );
      } finally {
        pending.current = false;
        setBusy(false);
      }
    },
    [exam, onComplete],
  );
  const next = useCallback(
    (timedOut = false) => {
      if (busy || pending.current) return;
      const values = { ...answerRef.current };
      if (timedOut && values[key] === undefined) values[key] = null;
      setAnswers(values);
      if (index < exam.preguntas.length - 1) {
        setIndex((old) => old + 1);
        setEnds(Date.now() + 120000);
        setNow(Date.now());
      } else {
        void send(values);
      }
    },
    [busy, index, key, exam.preguntas.length, send],
  );
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (remaining === 0 && !busy && !error) next(true);
  }, [remaining, busy, error, next]);
  return (
    <section className={styles.card}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>INTENTO {exam.intento} DE 2</p>
          <h2>Evaluación de conocimientos</h2>
        </div>
        <span className={styles.timer}>
          <Clock3 size={17} />
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </span>
      </div>
      <progress
        className={styles.progressBar}
        value={index + 1}
        max={exam.preguntas.length}
      />
      <p className={styles.muted}>
        Pregunta {index + 1} de {exam.preguntas.length}
      </p>
      <h3 className={styles.question}>{current.DESCRIPCION}</h3>
      {current.IMAGEN && (
        <Image
          unoptimized
          width={600}
          height={400}
          className={styles.questionImage}
          src={current.IMAGEN}
          alt="Ilustración de la pregunta"
        />
      )}
      <fieldset className={styles.answers} disabled={busy}>
        <legend className={styles.srOnly}>Elige una respuesta</legend>
        {current.opciones.map((option) => (
          <label
            key={option.OPCION}
            className={
              answers[key] === Number(option.OPCION)
                ? styles.selectedAnswer
                : ""
            }
          >
            <input
              type="radio"
              name="respuesta"
              value={option.OPCION}
              checked={answers[key] === Number(option.OPCION)}
              onChange={() =>
                setAnswers((old) => ({ ...old, [key]: Number(option.OPCION) }))
              }
            />
            <span>{option.DESCRIPCION}</span>
          </label>
        ))}
      </fieldset>
      {error && <EvialProblem error={error} />}
      <div className={styles.actions}>
        <button className={styles.secondary} disabled={busy} onClick={onBack}>
          Volver al curso
        </button>
        <button
          className={styles.primary}
          disabled={busy || answers[key] === undefined}
          onClick={() =>
            index === exam.preguntas.length - 1 ? void send(answers) : next()
          }
        >
          {busy
            ? "Enviando evaluación…"
            : index === exam.preguntas.length - 1
              ? "Enviar evaluación"
              : "Siguiente pregunta"}
        </button>
      </div>
      <p className={styles.help}>
        Cada pregunta tiene dos minutos. Al terminar el tiempo, una pregunta sin
        respuesta obtiene cero puntos. El intento se registra al enviar.
      </p>
    </section>
  );
}

function Pupils({
  items,
  reload,
  enabled,
}: {
  items: EvialPupil[];
  reload: () => void;
  enabled: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null),
    [notice, setNotice] = useState("");
  const pending = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const fields = new FormData(event.currentTarget),
      file = fields.get("archivo");
    if (!(file instanceof File) || !file.size || file.size > 10485760) {
      setError(new Error("Adjunta una imagen o video de hasta 10 MiB"));
      return;
    }
    const alumnos = Array.from({ length: 5 }, (_, i) =>
      Object.fromEntries(
        ["nombres", "apellidos", "dpi", "telefono", "correo"].map((key) => [
          key,
          String(fields.get(`${i}-${key}`) || "").trim(),
        ]),
      ),
    );
    const body = new FormData();
    body.set("alumnos", JSON.stringify(alumnos));
    body.set("archivo", file);
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      await evialRequest("mi-curso/alumnos", { method: "PUT", body });
      reload();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudieron guardar los participantes"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function copy(pupil: EvialPupil) {
    const url =
      window.location.origin +
      "/evial/evaluar#token=" +
      encodeURIComponent(pupil.accesoEvaluacion || "");
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Enlace copiado. Compártelo únicamente con este participante.");
    } catch {
      setNotice(url);
    }
  }
  if (items.length)
    return (
      <section className={styles.card}>
        <h2>Participantes de tu actividad</h2>
        <p>
          Comparte con cada persona su enlace para que evalúe la formación
          recibida.
        </p>
        <div className={styles.pupilList}>
          {items.map((pupil) => (
            <div key={pupil.ALUMNO}>
              <div>
                <strong>
                  {pupil.NOMBRES} {pupil.APELLIDOS}
                </strong>
                <span>
                  {pupil.evaluado
                    ? "Evaluación registrada"
                    : "Evaluación pendiente"}
                </span>
              </div>
              {!pupil.evaluado && (
                <button
                  className={styles.secondary}
                  onClick={() => void copy(pupil)}
                >
                  Copiar enlace
                </button>
              )}
            </div>
          ))}
        </div>
        {notice && <Notice>{notice}</Notice>}
      </section>
    );
  if (!enabled)
    return (
      <section className={styles.card}>
        <h2>Actividad con participantes</h2>
        <Notice>
          Esta etapa necesita que se habilite la recepción privada de evidencia.
          Consulta al personal antes de completar los datos.
        </Notice>
      </section>
    );
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>APLICA LO APRENDIDO</p>
      <h2>Comparte tu aprendizaje con cinco personas</h2>
      <p>
        Registra a los participantes y adjunta una foto o video de la actividad.
        Cada persona recibirá un enlace para evaluar la formación que
        impartiste.
      </p>
      <form onSubmit={submit}>
        <fieldset disabled={busy} className={styles.formFields}>
          <div className={styles.pupilGrid}>
            {Array.from({ length: 5 }, (_, i) => (
              <section key={i} className={styles.pupilForm}>
                <h3>Participante {i + 1}</h3>
                {[
                  ["nombres", "Nombres"],
                  ["apellidos", "Apellidos"],
                  ["dpi", "DPI"],
                  ["telefono", "Teléfono"],
                  ["correo", "Correo electrónico"],
                ].map(([key, label]) => (
                  <label className={styles.field} key={key}>
                    {label}
                    <input
                      required
                      name={`${i}-${key}`}
                      type={key === "correo" ? "email" : "text"}
                      pattern={
                        key === "dpi"
                          ? "[0-9]{13}"
                          : key === "telefono"
                            ? "[0-9]{8,15}"
                            : undefined
                      }
                      maxLength={
                        key === "dpi"
                          ? 13
                          : key === "telefono"
                            ? 15
                            : key === "correo"
                              ? 254
                              : 100
                      }
                    />
                  </label>
                ))}
              </section>
            ))}
          </div>
          <label className={styles.field}>
            Evidencia de la actividad
            <input
              type="file"
              required
              name="archivo"
              accept="image/png,image/jpeg,video/mp4"
            />
            <small>
              PNG, JPEG o MP4. Máximo 10 MiB. La evidencia es privada.
            </small>
          </label>
          {error && <EvialProblem error={error} />}
          <button className={styles.primary} type="submit" disabled={busy}>
            {busy
              ? "Guardando participantes…"
              : "Guardar actividad y participantes"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}

export default function EvialCourseView() {
  const course = useEvialData<EvialCourse>("mi-curso"),
    config = useEvialData<EvialConfiguration>("configuracion");
  const [pupils, setPupils] = useState<EvialPupil[]>([]),
    [pupilError, setPupilError] = useState<Error | null>(null),
    [exam, setExam] = useState<EvialExam | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error | null>(null),
    [notice, setNotice] = useState(""),
    [reviewed, setReviewed] = useState<number[]>([]);
  const pending = useRef(false),
    data = course.data;
  useEffect(() => {
    let active = true;
    if (!data?.estado.aprobado || data.evento.TIPO === "F") return;
    setPupilError(null);
    evialRequest<EvialPupil[]>("mi-curso/alumnos")
      .then((rows) => {
        if (active) setPupils(rows);
      })
      .catch((reason) => {
        if (active) setPupilError(reason);
      });
    return () => {
      active = false;
    };
  }, [data]);
  const reloadCourse = course.reload;
  const finish = useCallback(() => {
    setExam(null);
    reloadCourse();
  }, [reloadCourse]);
  async function start() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      setExam(
        await evialRequest<EvialExam>("mi-curso/examen/iniciar", {
          method: "POST",
          body: "{}",
        }),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudo abrir la evaluación"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function mail() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await evialRequest<{ mensaje: string }>(
        "mi-curso/comprobante/correo",
        { method: "POST", body: "{}" },
      );
      setNotice(result.mensaje);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudo solicitar el envío"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function logout() {
    await evialRequest("sesion", { method: "DELETE" });
    window.location.assign("/evial");
  }
  if (course.loading)
    return (
      <main className={styles.page}>
        <EvialHeading title="Mi capacitación" />
        <EvialLoading />
      </main>
    );
  if (course.error instanceof EvialError && course.error.status === 401)
    return (
      <main className={styles.page}>
        <EvialHeading title="Mi capacitación" />
        <ChooseCourse />
      </main>
    );
  if (course.error || !data)
    return (
      <main className={styles.page}>
        <EvialHeading title="Mi capacitación" />
        <EvialProblem
          error={course.error || new Error("No se encontró el curso")}
          retry={course.reload}
        />
      </main>
    );
  const status = data.estado;
  return (
    <main className={styles.page}>
      <EvialHeading
        title={data.evento.NOMBRE}
        description={`${data.participante.NOMBRES} ${data.participante.APELLIDOS} · Código ${data.inscripcion.PERSONA} · Grupo ${data.inscripcion.GRUPO}`}
      />
      <div className={styles.courseLayout}>
        <div className={styles.courseContent}>
          {exam ? (
            <Exam
              exam={exam}
              onComplete={finish}
              onBack={() => setExam(null)}
            />
          ) : (
            <>
              <section className={styles.card}>
                <div className={styles.sectionHeading}>
                  <div>
                    <p className={styles.eyebrow}>TU ESPACIO DE APRENDIZAJE</p>
                    <h2>Materiales de la capacitación</h2>
                  </div>
                  <BookOpen size={28} />
                </div>
                <p>
                  Revisa cada documento o video antes de comenzar la evaluación.
                  Puedes marcar los materiales que ya consultaste.
                </p>
                {data.contenidos.length ? (
                  <div className={styles.materials}>
                    {data.contenidos.map((item) => (
                      <div key={item.CONTENIDO_ID}>
                        <span className={styles.materialIcon}>
                          <FileText size={22} />
                        </span>
                        <div>
                          <small>Módulo {item.MODULO}</small>
                          {item.URL ? (
                            <a
                              href={item.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.NOMBRE}
                            </a>
                          ) : (
                            <span>{item.NOMBRE} · archivo pendiente</span>
                          )}
                        </div>
                        <label className={styles.reviewLabel}>
                          <input
                            type="checkbox"
                            checked={reviewed.includes(
                              Number(item.CONTENIDO_ID),
                            )}
                            onChange={(e) =>
                              setReviewed((old) =>
                                e.target.checked
                                  ? [...old, Number(item.CONTENIDO_ID)]
                                  : old.filter(
                                      (id) => id !== Number(item.CONTENIDO_ID),
                                    ),
                              )
                            }
                          />{" "}
                          Revisado
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Notice>
                    El material de esta capacitación todavía no está disponible.
                    Consulta al personal de EVIAL.
                  </Notice>
                )}
              </section>
              <section className={styles.card}>
                <div className={styles.sectionHeading}>
                  <div>
                    <p className={styles.eyebrow}>
                      PON A PRUEBA TUS CONOCIMIENTOS
                    </p>
                    <h2>Evaluación</h2>
                  </div>
                  <span className={styles.pill}>
                    {status.aprobado
                      ? "Aprobada"
                      : status.agotado
                        ? "Intentos agotados"
                        : `${status.intentosRestantes} intentos disponibles`}
                  </span>
                </div>
                {status.punteo !== null && (
                  <p className={styles.score}>
                    {status.punteo}
                    <span>/100 puntos</span>
                  </p>
                )}
                <p>
                  La nota mínima es de 70 puntos. Tienes dos intentos para
                  aprobar.
                </p>
                {!status.aprobado && !status.agotado && (
                  <button
                    className={styles.primary}
                    disabled={
                      busy ||
                      !data.contenidos.length ||
                      reviewed.length < data.contenidos.length
                    }
                    onClick={() => void start()}
                  >
                    {busy ? "Preparando evaluación…" : "Comenzar evaluación"}
                  </button>
                )}
                {!status.aprobado &&
                  !status.agotado &&
                  reviewed.length < data.contenidos.length && (
                    <small>
                      Marca los materiales revisados para continuar.
                    </small>
                  )}
                {status.aprobado && (
                  <Notice>
                    Evaluación de conocimientos aprobada. Revisa los siguientes
                    pasos de tu capacitación.
                  </Notice>
                )}
                {status.agotado && (
                  <Notice>
                    Consulta al personal de EVIAL para conocer cómo continuar.
                    No se registrarán más intentos.
                  </Notice>
                )}
              </section>
              {status.aprobado &&
                data.evento.TIPO !== "F" &&
                (pupilError ? (
                  <EvialProblem error={pupilError} retry={course.reload} />
                ) : (
                  <Pupils
                    items={pupils}
                    reload={course.reload}
                    enabled={Boolean(config.data?.evidenciaDisponible)}
                  />
                ))}
            </>
          )}
          {error && <EvialProblem error={error} />}{" "}
          {notice && <Notice>{notice}</Notice>}
        </div>
        <aside className={styles.courseAside}>
          <section className={styles.card}>
            <p className={styles.eyebrow}>TU AVANCE</p>
            <h2>Un paso a la vez</h2>
            <ol className={styles.courseSteps}>
              <li className={styles.done}>
                <CheckCircle2 size={20} />
                <span>Inscripción confirmada</span>
              </li>
              <li className={status.aprobado ? styles.done : ""}>
                <CheckCircle2 size={20} />
                <span>Evaluación de conocimientos</span>
              </li>
              {data.evento.TIPO !== "F" && (
                <>
                  <li className={status.fase3 ? styles.done : ""}>
                    <Users size={20} />
                    <span>Actividad con cinco participantes</span>
                  </li>
                  <li className={status.fase4 ? styles.done : ""}>
                    <CheckCircle2 size={20} />
                    <span>Evaluaciones de participantes</span>
                  </li>
                </>
              )}
            </ol>
          </section>
          <section className={styles.card}>
            <h2>Tu comprobante</h2>
            <p>Descarga el QR que identifica tu inscripción.</p>
            <a
              className={styles.secondary}
              href="/api/evial/mi-curso/comprobante"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={17} /> Abrir comprobante PDF
            </a>
            <button
              className={styles.textLink}
              disabled={busy || !config.data?.correoDisponible}
              onClick={() => void mail()}
            >
              <Send size={16} /> Enviar al correo registrado
            </button>
            {!config.data?.correoDisponible && (
              <small>
                El envío por correo está pendiente de habilitación; puedes
                descargar el PDF.
              </small>
            )}
            <p className={styles.help}>
              El comprobante acredita inscripción. No confirma aprobación ni
              descuentos de multas.
            </p>
          </section>
          <button className={styles.textLink} onClick={() => void logout()}>
            <LogOut size={16} /> Cerrar este acceso
          </button>
        </aside>
      </div>
    </main>
  );
}
