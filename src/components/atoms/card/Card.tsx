import React from "react";
import styles from "./Card.module.scss";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className }: Props) {
  return <section className={`${styles.Card} ${className ?? ""}`}>{children}</section>;
}
