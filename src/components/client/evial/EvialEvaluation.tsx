"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { evialRequest } from "@/lib/evial/types";
import { EvialHeading, EvialLoading, EvialProblem } from "./EvialCommon";
import styles from "./Evial.module.scss";
type Context = {
  participante: string;
  facilitador: string;
  respondido: boolean;
  preguntas: { PREGUNTA: number; DESCRIPCION: string }[];
};
export default function EvialEvaluation() {
  const [token, setToken] = useState(""),
    [context, setContext] = useState<Context | null>(null),
    [error, setError] = useState<Error | null>(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [complete, setComplete] = useState(false);
  const pending = useRef(false),
    fragment = useRef<string | null>(null);
  useEffect(() => {
    const value =
      fragment.current ??
      new URLSearchParams(window.location.hash.slice(1)).get("token") ??
      "";
    fragment.current = value;
    setToken(value);
    window.history.replaceState(null, "", window.location.pathname);
    if (!value) {
      setError(
        new Error(
          "Abre el enlace que te compartió la persona que impartió la capacitación.",
        ),
      );
      setLoading(false);
      return;
    }
    let active = true;
    evialRequest<Context>("evaluacion", {
      headers: { authorization: "Bearer " + value },
    })
      .then((data) => {
        if (active) {
          setContext(data);
          setComplete(data.respondido);
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
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current || !context) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      await evialRequest("evaluacion", {
        method: "POST",
        headers: { authorization: "Bearer " + token },
        body: JSON.stringify({
          respuestas: context.preguntas.map((q) => ({
            pregunta: Number(q.PREGUNTA),
            respuesta: answers[q.PREGUNTA] || "",
          })),
        }),
      });
      setComplete(true);
      setToken("");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason
          : new Error("No se pudo registrar la evaluación"),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <main className={styles.page}>
      <EvialHeading
        title="Tu experiencia nos ayuda a mejorar"
        description="Comparte cómo fue la formación vial que recibiste."
      />
      <section className={styles.evaluationCard}>
        {loading ? (
          <EvialLoading />
        ) : complete ? (
          <div className={styles.success}>
            <CheckCircle2 size={52} />
            <h2>Gracias por compartir tu experiencia</h2>
            <p>Tu evaluación quedó registrada.</p>
            <Link href="/evial" className={styles.secondary}>
              Conocer más sobre EVIAL
            </Link>
          </div>
        ) : context ? (
          <>
            <p className={styles.eyebrow}>EVALUACIÓN DE LA ACTIVIDAD</p>
            <h2>Hola, {context.participante}</h2>
            <p>
              Cuéntanos sobre la formación impartida por{" "}
              <strong>{context.facilitador}</strong>.
            </p>
            {context.preguntas.length ? (
              <form onSubmit={submit}>
                <fieldset className={styles.formFields} disabled={busy}>
                  {context.preguntas.map((q, index) => (
                    <label key={q.PREGUNTA} className={styles.field}>
                      {index + 1}. {q.DESCRIPCION}
                      <textarea
                        required
                        maxLength={1000}
                        rows={4}
                        value={answers[q.PREGUNTA] || ""}
                        onChange={(e) =>
                          setAnswers((old) => ({
                            ...old,
                            [q.PREGUNTA]: e.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
                  {error && <EvialProblem error={error} />}
                  <button
                    className={styles.primary}
                    type="submit"
                    disabled={busy}
                  >
                    {busy ? "Registrando evaluación…" : "Enviar evaluación"}
                  </button>
                </fieldset>
              </form>
            ) : (
              <p>
                Las preguntas de esta evaluación todavía no están disponibles.
                Consulta a quien te compartió el enlace.
              </p>
            )}
          </>
        ) : error ? (
          <EvialProblem error={error} />
        ) : null}
      </section>
    </main>
  );
}
