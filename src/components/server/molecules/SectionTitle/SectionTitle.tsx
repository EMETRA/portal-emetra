import React from "react";
import classNames from "classnames";
import styles from "./SectionTitle.module.scss";
import { Heading, Separator, Icon } from "../../atoms/index";
import { SectionTitleProps } from "./types";

/**
 * Título de sección con líneas verdes a los lados.
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
    children,
    className,
    iconName,
    ...rest
}) => (
    <div className={classNames(styles.wrapper, className)} {...rest}>
        <Separator variant="green" className={styles.separator}/>
        { iconName ? (<Icon name={iconName} className={styles.icon}/>) : null } 
        <Heading variant="Medium" className={styles.title}>
            {children}
        </Heading>
        <Separator variant="green" className={styles.separator}/>
    </div>
);

