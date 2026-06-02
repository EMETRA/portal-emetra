"use client";

import { useEffect, useState } from "react";
import { FAQQuestions } from "@/components/organisms/FAQ-Questions";
import { Separator } from "@/components/atoms/Separator";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";
import { assertOkResponse } from "@/lib/bff/raw";
import {
  mapFaqListToSchema,
  type FaqListResponseDto,
} from "@/lib/content/mappers";
import type { FAQ } from "@/schema";
import classNames from "classnames";
import styles from "@/app/page.module.css";

const FAQ_API = "/api/faq?estado=activo&page=1&limit=50";

export default function HomeFaqSection() {
  const [faqQuestions, setFaqQuestions] = useState<FAQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const response = await fetch(FAQ_API, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        await assertOkResponse(response);
        const data = (await response.json()) as FaqListResponseDto;
        setFaqQuestions(mapFaqListToSchema(data));
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar las preguntas frecuentes.";
        setError(message);
        setFaqQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <>
      <Separator>
        <h1 className={classNames(styles.Title)}>Preguntas Frecuentes</h1>
      </Separator>
      <section id="ayuda">
        {error ? (
          <ServiceErrorAlert
            title="Preguntas frecuentes no disponibles"
            message={error}
          />
        ) : loading ? (
          <p className={styles.noNewsMessage}>Cargando preguntas frecuentes...</p>
        ) : (
          <FAQQuestions
            questions={faqQuestions}
            variant="No-Landing"
            className={styles.faqQuestions}
          />
        )}
      </section>
    </>
  );
}
