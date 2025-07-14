// src/components/molecules/ServiceItem/ServiceItem.tsx
import React from "react";
import classNames from "classnames";
import styles from "./ServiceItem.module.scss";
import { Text, Icon, DividerVertical } from "@atoms/index";
import { ServiceItemProps } from "./types";

/**
 * Molécula ServiceItem: dos iconos (cada uno con su SVG), un divider vertical y un label.
 */
export const ServiceItem: React.FC<ServiceItemProps> = ({
    iconA,
    iconB,
    label,
    className,
    ...rest
}) => (
    <div className={classNames(styles.wrapper, className)} {...rest}>
        <Icon src={iconA} />
        <Icon src={iconB} />
        <DividerVertical />
        <Text variant="Small" className={styles.label}>
            {label}
        </Text>
    </div>
);
