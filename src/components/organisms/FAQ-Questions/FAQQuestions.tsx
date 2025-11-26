import React from "react";
import classNames from "classnames";
import styles from "./FAQQuestions.module.scss";
import { Dropdown } from "@molecules/index";
import { Button, Separator } from "../../server/atoms/index";
import { FAQQuestionsProps } from "./types";
import Link from "next/link";

/**
 * Componente de preguntas frecuentes.
 *
 * @param {string} variant - La variante del componente.
 * @param {FAQ[]} questions - Las preguntas frecuentes.
 * @returns {JSX.Element} El componente de preguntas frecuentes.
 */
const FAQQuestions: React.FC<FAQQuestionsProps> = ({
  variant = "No-Landing",
  questions = [],
  className,
}) => {
  return (
    <div className={classNames(styles.Container, className)}>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <React.Fragment key={`FAQ-QuestionF-${question.pregunta}-${index}`}>
            <Dropdown
              question={question.pregunta}
              key={`FAQ-QuestionD-${question.pregunta}-${index}`}
            >
              <p className={styles.answer}>
                {question.respuesta}
              </p>
            </Dropdown>
            {index < questions.length - 1 && (
              <Separator
                className={styles.Separator}
                key={`FAQ-QuestionS-${question.respuesta}-${index}`}
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <p>No hay preguntas frecuentes disponibles</p>
      )}
      {variant === "Landing" && (
        <Link href="/faq">
          <Button type="button" variant="success">
            Ver más
          </Button>
        </Link>
      )}
    </div>
  );
};

export default FAQQuestions;
