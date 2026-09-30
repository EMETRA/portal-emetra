import React from "react";
import classNames from "classnames";
import styles from "./CardGeneral.module.scss";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: "none" | "sm" | "md" | "lg";
}

const CardGeneral: React.FC<CardProps> = ({ children, className, padding = "md", ...props }) => (
    <div className={classNames(styles.card, styles[`padding-${padding}`], className)} {...props}>
        {children}
    </div>
);

export default CardGeneral;