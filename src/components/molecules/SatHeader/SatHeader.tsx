import React from "react";
import styles from "./SatHeader.module.scss";

export type SatHeaderAction = {
  label: string;
  href?: string;
  icon?: string;      // ruta a svg/png
  ariaLabel?: string;
};

type Props = {
  logoSrc: string;
  logoAlt?: string;
  logoHref?: string;
  actions?: SatHeaderAction[]; // pásame 1–3, tú usarás 2
  className?: string;
};

export default function SatHeader({
  logoSrc,
  logoAlt = "Logo",
  logoHref,
  actions = [],
  className
}: Props) {
  return (
    <header className={`${styles.header} ${className ?? ""}`} aria-label="Encabezado">
      <div className={styles.inner}>
        {/* Logo a la izquierda */}
        <div className={styles.left}>
          {logoHref ? (
            <a className={styles.logoLink} href={logoHref} aria-label="Inicio">
              <img className={styles.logoImg} src={logoSrc} alt={logoAlt} />
            </a>
          ) : (
            <img className={styles.logoImg} src={logoSrc} alt={logoAlt} />
          )}
        </div>

        {/* Acciones a la derecha */}
        <nav className={styles.right} aria-label="Accesos rápidos">
          {actions.map((a) => {
            const Cmp = a.href ? "a" : "span";
            return (
              <Cmp
                key={a.label}
                className={styles.action}
                {...(a.href ? { href: a.href } : {})}
                aria-label={a.ariaLabel ?? a.label}
              >
                {a.icon && <img className={styles.actionIcon} src={a.icon} alt="" aria-hidden />}
                <span className={styles.actionLabel}>{a.label}</span>
              </Cmp>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
