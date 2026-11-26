"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { EvialHome as HomeData, eventDate, eventMode } from "@/lib/evial/types";
import { EvialLoading, EvialProblem, useEvialData } from "./EvialCommon";
import styles from "./Evial.module.scss";
export default function EvialHome() {
  const { data, error, loading, reload } = useEvialData<HomeData>("inicio");
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>EDUCACIÓN VIAL · CIUDAD DE GUATEMALA</p>
          <Image
            unoptimized
            width={600}
            height={400}
            className={styles.evialLogo}
            src="/evial/evial-logo.png"
            alt="EVIAL"
          />
          <h1>
            Aprender hoy.
            <br />
            <span>Movernos mejor mañana.</span>
          </h1>
          <p>
            Conoce las capacitaciones de EMETRA, inscríbete y continúa tu
            formación en seguridad vial desde un solo lugar.
          </p>
          <div className={styles.heroActions}>
            <a href="#capacitaciones" className={styles.primary}>
              Explorar capacitaciones <ArrowRight size={18} />
            </a>
            <Link className={styles.lightButton} href="/evial/mi-curso">
              Continuar mi curso
            </Link>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.routeArt} aria-hidden="true">
            <div />
            <GraduationCap size={60} />
            <ShieldCheck size={42} />
          </div>
          <p>Un camino que construimos juntos</p>
          <ul>
            <li>
              <CheckCircle2 size={18} /> Formación para una movilidad
              responsable
            </li>
            <li>
              <CheckCircle2 size={18} /> Tu inscripción y comprobante en línea
            </li>
            <li>
              <CheckCircle2 size={18} /> Materiales y evaluación en tu espacio
            </li>
          </ul>
        </div>
      </section>
      <section className={styles.steps} aria-label="Cómo participar">
        {[
          {
            icon: BookOpen,
            title: "Elige tu capacitación",
            text: "Revisa fechas, modalidad y requisitos.",
          },
          {
            icon: GraduationCap,
            title: "Confirma tu inscripción",
            text: "Completa tus datos y conserva tu código.",
          },
          {
            icon: ShieldCheck,
            title: "Continúa aprendiendo",
            text: "Accede a materiales y consulta tu avance.",
          },
        ].map((step, index) => (
          <div key={step.title}>
            <span className={styles.stepIcon}>
              <step.icon size={24} />
            </span>
            <div>
              <small>PASO {index + 1}</small>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </section>
      <section id="capacitaciones" className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>ENCUENTRA TU PRÓXIMO PASO</p>
            <h2>Capacitaciones disponibles</h2>
            <p>Información y requisitos de cada actividad.</p>
          </div>
          {data && (
            <span className={styles.count}>
              {data.eventos.length} disponibles
            </span>
          )}
        </div>
        {loading ? (
          <EvialLoading />
        ) : error ? (
          <EvialProblem error={error} retry={reload} />
        ) : data?.eventos.length ? (
          <div className={styles.eventGrid}>
            {data.eventos.map((event) => (
              <article className={styles.eventCard} key={event.EVENTO}>
                <Link
                  href={"/evial/" + event.EVENTO}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <div className={styles.eventCover}>
                    {event.IMAGEN ? (
                      <Image
                        unoptimized
                        width={600}
                        height={400}
                        src={event.IMAGEN}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        unoptimized
                        width={600}
                        height={400}
                        src="/evial/evial-logo.png"
                        alt=""
                      />
                    )}
                    <span className={styles.pill}>{eventMode(event.TIPO)}</span>
                  </div>
                </Link>
                <div className={styles.eventBody}>
                  <p className={styles.date}>{eventDate(event.FECHA_INICIO)}</p>
                  <h3>{event.NOMBRE}</h3>
                  <p>
                    {event.LUGAR || "Consulta los detalles de la capacitación"}
                  </p>
                  <Link
                    href={"/evial/" + event.EVENTO}
                    className={styles.cardLink}
                  >
                    Ver capacitación <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <BookOpen size={38} />
            <h3>Próximamente, nuevas oportunidades para aprender</h3>
            <p>
              En este momento no hay inscripciones abiertas. Puedes volver a
              consultar esta sección.
            </p>
          </div>
        )}
      </section>
      {Boolean(data?.videos.length) && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>APRENDE A TU RITMO</p>
              <h2>Recursos de educación vial</h2>
            </div>
          </div>
          <div className={styles.eventGrid}>
            {data!.videos.map((video) => (
              <article key={video.ID} className={styles.card}>
                <BookOpen size={26} />
                <h3>{video.TITULO}</h3>
                <p>{video.DESCRIPCION}</p>
                {video.URL && (
                  <a
                    className={styles.textLink}
                    href={video.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver recurso <ArrowRight size={17} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {Boolean(data?.preguntas.length) && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>TE ACOMPAÑAMOS</p>
              <h2>Preguntas frecuentes</h2>
            </div>
          </div>
          <div className={styles.faq}>
            {data!.preguntas.map((item, index) => (
              <details key={index}>
                <summary>{item.DESCRIPCION}</summary>
                <p>{item.RESPUESTA}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <section className={styles.bottomCallout}>
        <div>
          <h2>¿Ya estás inscrito?</h2>
          <p>
            Tu código te permite continuar tu capacitación y recuperar tu
            comprobante.
          </p>
        </div>
        <Link href="/evial/mi-curso" className={styles.secondary}>
          Ir a mi capacitación <ArrowRight size={18} />
        </Link>
      </section>
      <p className={styles.staffLink}>
        <Link href="/evial/gestion">
          Acceso para personal autorizado de EMETRA
        </Link>
      </p>
    </main>
  );
}
