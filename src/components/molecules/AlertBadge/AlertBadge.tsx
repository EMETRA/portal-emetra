import React from "react";
import { AlertBadgeProps } from "./types";
import styles from "./AlertBadge.module.scss";
import classNames from "classnames";

export const AlertBadge: React.FC <AlertBadgeProps> = ({
    children,
    color = "blue",
    align = "left",
    className
}) => {
    return (
        <div
            className={classNames(
                styles.alertBadge,
                styles[color],
                styles[align],
                className
            )}
            role="note"
        >
            {children}
        </div>
    );
};