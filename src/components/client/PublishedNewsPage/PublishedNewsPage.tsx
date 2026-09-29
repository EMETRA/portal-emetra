"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import classNames from "classnames";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/server/atoms/Button";
import { NewsSkeleton } from "@/components/server/molecules/NewsSkeleton";
import { NewsStateCard } from "@/components/server/molecules/NewsStateCard";
import { NewsArticle } from "@/components/server/organisms/NewsArticle";
import { isNewsAvailable } from "@/helpers/isNewsAvailable";
import { fetchPublishedNewsBySlugDummy } from "@/lib/content/publishedNews.dummy";
import type { PublishedNews } from "@/lib/content/publishedNews.types";
import styles from "./PublishedNewsPage.module.scss";

const LISTADO_HREF = "/#noticias";

function decodificarSlug(valor?: string): string {
  if (!valor) return "";
  try {
    return decodeURIComponent(valor);
  } catch {
    return valor;
  }
}

type Estado =
  | { tipo: "cargando" }
  | { tipo: "lista"; noticia: PublishedNews }
  | { tipo: "error" }
  | { tipo: "no-disponible" };

/**
 * Detalle de una noticia publicada (COM-04), por slug.
 * TODO [COM04-BACKEND]: usa datos dummy mientras backend confirma las queries
 * (hoy solo existe /news/:id; se propone /news/slug/:slug).
 */
export default function PublishedNewsPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodificarSlug(params?.slug);
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [reintento, setReintento] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: "cargando" });

    fetchPublishedNewsBySlugDummy(slug)
      .then((noticia) => {
        if (cancelado) return;
        // Privada, archivada, en borrador o programada: no se muestra.
        setEstado(
          isNewsAvailable(noticia)
            ? { tipo: "lista", noticia }
            : { tipo: "no-disponible" }
        );
      })
      .catch((error: unknown) => {
        if (cancelado) return;
        const noEncontrada =
          error instanceof Error && error.name === "NotFoundError";
        setEstado({ tipo: noEncontrada ? "no-disponible" : "error" });
      });

    return () => {
      cancelado = true;
    };
  }, [slug, reintento]);

  const irAlListado = () => router.push(LISTADO_HREF);

  const volver = (centrado = false) => (
    <Link
      href={LISTADO_HREF}
      className={classNames(styles.back, centrado && styles.backCentered)}
    >
      <ChevronLeft className={styles.backIcon} aria-hidden="true" />
      Volver a noticias
    </Link>
  );

  if (estado.tipo === "no-disponible") {
    return (
      <main className={classNames(styles.page, styles.pageState)}>
        <NewsStateCard
          variant="error"
          title="Esta noticia ya no está disponible"
          message="Puede que haya sido archivada o que el enlace haya caducado."
        >
          <Button onClick={irAlListado}>Ver todas las noticias</Button>
        </NewsStateCard>
      </main>
    );
  }

  if (estado.tipo === "error") {
    return (
      <main className={classNames(styles.page, styles.pageState)}>
        {volver(true)}
        <NewsStateCard
          variant="error"
          title="No pudimos cargar esta noticia"
          message="Ocurrió un problema de conexión. Puede que la noticia sí exista; intenta de nuevo."
        >
          <Button onClick={() => setReintento((valor) => valor + 1)}>
            Reintentar
          </Button>
          <Button className={styles.outlineButton} onClick={irAlListado}>
            Ver todas las noticias
          </Button>
        </NewsStateCard>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {volver()}
      {estado.tipo === "cargando" ? (
        <div className={styles.loading}>
          <p className={styles.loadingText} role="status">
            Cargando noticia…
          </p>
          <NewsSkeleton variant="detail" />
        </div>
      ) : (
        <NewsArticle noticia={estado.noticia} className={styles.article} />
      )}
    </main>
  );
}
