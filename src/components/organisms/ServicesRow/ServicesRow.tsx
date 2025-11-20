"use client";

import React from "react";
import classNames from "classnames";
import styles from "./ServicesRow.module.scss";
import { ServiceItem } from "@/components/server/molecules/index";
import { ServicesRowProps } from "./types";

/**
 * Organismo ServicesRow: fila estática de 4 ServiceItem.
 */
export const ServicesRow: React.FC<ServicesRowProps> = ({
  className,
  ...rest
}) => (
  <div className={classNames(styles.servicesRow, className)} {...rest}>
    <ServiceItem
      iconA="Document"
      iconB="DPI"
      label="SUMATE"
      href="/sumate"
      className={styles.serviceItem}
    />
    <ServiceItem
      iconA="Document"
      iconB="User"
      label="Tránsito Hoy"
      href="/desplazamiento"
      className={styles.serviceItem}
    />
    <ServiceItem
      iconA="Document"
      iconB="Bus"
      label="Impresión Solvencia"
      href="/solvencia"
      className={styles.serviceItem}
    />
    <ServiceItem
      iconA="Document"
      iconB="Vehiculo"
      label="Remisiones Emetra"
      href="https://especiales.muniguate.com/remisiones.htm"
      className={styles.serviceItem}
    />
  </div>
);
