// src/components/atoms/DividerVertical/DividerVertical.tsx
import React from "react";
import classNames from "classnames";
import styles from "./DividerVertical.module.scss";
import { DividerVerticalProps } from "./types";

/**
 * Átomo DividerVertical: línea vertical separadora.
 */
export const DividerVertical: React.FC<DividerVerticalProps> = ({
    className,
    ...rest
}) => <span className={classNames(styles.divider, className)} {...rest} />;
