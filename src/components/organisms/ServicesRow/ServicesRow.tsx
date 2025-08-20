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
      label="Denuncia PMT"
      className={styles.serviceItem}
    />
    <ServiceItem
      iconA="Document"
      iconB="User"
      label="Juzgado de Tránsito"
      href="/juzgado"
      className={styles.serviceItem}
    />
    <ServiceItem
      iconA="Document"
      iconB="Bus"
      label="Remisiones de Buses (STP)"
      className={styles.serviceItem}
    />
    <ServiceItem
      iconA="Document"
      iconB="Vehiculo"
      label="Remisiones Emetra"
      className={styles.serviceItem}
    />
  </div>
);
