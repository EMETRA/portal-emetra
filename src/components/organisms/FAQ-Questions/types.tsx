import { FAQ } from "@schema";

type FAQQuestionsVariant = "Landing" | "No-Landing";

/**
 * Propiedades de las preguntas frecuentes.
 */
interface FAQQuestionsProps {
  questions?: FAQ[];
  variant?: FAQQuestionsVariant;
  className?: string;
}

export type { FAQQuestionsProps };
