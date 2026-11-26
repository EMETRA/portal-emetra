"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EvialError, evialRequest } from "@/lib/evial/types";
import styles from "./Evial.module.scss";
export function useEvialData<T>(path: string) {
  const [data, setData] = useState<T | null>(null),
    [error, setError] = useState<Error | null>(null),
    [loading, setLoading] = useState(true),
    [version, reload] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    evialRequest<T>(path)
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
  }, [path, version]);
  const refresh = useCallback(() => reload((value) => value + 1), []);
  return { data, error, loading, reload: refresh };
}
export function EvialHeading({
  title,
  description,
  back = "/evial",
}: {
  title: string;
  description?: string;
  back?: string;
}) {
  return (
    <header className={styles.heading}>
      <nav aria-label="Ubicación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href={back}>Educación vial</Link>
      </nav>
      <p className={styles.eyebrow}>EVIAL · EMETRA</p>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
export function EvialProblem({
  error,
  retry,
}: {
  error: Error;
  retry?: () => void;
}) {
  return (
    <div className={styles.problem} role="alert">
      <strong>No pudimos completar la consulta</strong>
      <p>{error.message}</p>
      {error instanceof EvialError && error.referencia && (
        <small>Referencia: {error.referencia}</small>
      )}
      {retry && (
        <button className={styles.secondary} onClick={retry}>
          Reintentar consulta
        </button>
      )}
    </div>
  );
}
export function EvialLoading() {
  return (
    <div className={styles.loading} role="status">
      Cargando información de educación vial…
    </div>
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.notice} role="status">
      {children}
    </p>
  );
}
