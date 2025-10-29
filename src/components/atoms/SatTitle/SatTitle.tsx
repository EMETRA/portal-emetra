import React from "react";
import styles from "./SatTitle.module.scss";
import classNames from "classnames";

type Heading = "h1"|"h2"|"h3"|"h4"|"h5"|"h6";

type Props = {
  as?: Heading;
  children: React.ReactNode;
  className?: string;
  uppercase?: boolean;
  lineColor?: string;      // ej. "var(--brand-green)" o "#62b44b"
  lineThickness?: string;  // ej. "2px"
  gap?: string;            // ej. "1rem"
};

export default function SatTitle({
  as = "h2",
  children,
  className,
  uppercase = true,
  lineColor,
  lineThickness,
  gap,
}: Props) {
  const Tag = as as any;

  const styleVars: React.CSSProperties = {
    ...(lineColor ? { ["--twl-line-color" as any]: lineColor } : {}),
    ...(lineThickness ? { ["--twl-line-thickness" as any]: lineThickness } : {}),
    ...(gap ? { ["--twl-gap" as any]: gap } : {}),
  };

  return (
    <div
      className={classNames(styles.Wrapper, className, { [styles.uppercase]: uppercase })}
      style={styleVars}
    >
      <span className={styles.line} aria-hidden="true" />
      <Tag className={styles.title}>{children}</Tag>
      <span className={styles.line} aria-hidden="true" />
    </div>
  );
}
