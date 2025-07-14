'use client'

import React from "react"
import classNames from "classnames"
import styles from "./ServicesRow.module.scss"
import { ServiceItem } from "@molecules/ServiceItem/ServiceItem"
import { ServicesRowProps } from "./types"

/**
 * Organismo ServicesRow: fila estática de 4 ServiceItem.
 */
export const ServicesRow: React.FC<ServicesRowProps> = ({
    className,
    ...rest
}) => (
    <div
        className={classNames(styles.servicesRow, className)}
        {...rest}
    >
        <ServiceItem
            iconA="/icon/Vehiculo.svg"
            iconB="/icon/Vehiculo.svg"
            label="Denuncia PMT"
            className={styles.serviceItem}
        />
        <ServiceItem
            iconA="/icon/Vehiculo.svg"
            iconB="/icon/Vehiculo.svg"
            label="Juzgado de Tránsito"
            className={styles.serviceItem}
        />
        <ServiceItem
            iconA="/icon/Vehiculo.svg"
            iconB="/icon/Vehiculo.svg"
            label="Remisiones de Buses (STP)"
            className={styles.serviceItem}
        />
        <ServiceItem
            iconA="/icon/Vehiculo.svg"
            iconB="/icon/Vehiculo.svg"
            label="Remisiones Emetra"
            className={styles.serviceItem}
        />
    </div>
)
