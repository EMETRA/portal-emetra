import React from "react";
import classNames from "classnames";
import styles from "./ServiceItem.module.scss";
import { Text } from "@atoms/index";
import { Icon, DividerVertical } from "../../atoms/index";
import { ServiceItemProps } from "./types";
import Link from "next/link";

/**
 * Molécula ServiceItem: dos iconos, un divider vertical y un label.
 */
export const ServiceItem: React.FC<ServiceItemProps> = ({
  iconA,
  iconB,
  label,
  className,
  href = "#",
  ...rest
}) => (
  <Link className={classNames(styles.wrapper, className)} href={href} {...rest}>
    <Icon name={iconA} color={"#013BA6"} className={styles.icon} />
    <Icon name={iconB} color={"#013BA6"} className={styles.icon} />
    <DividerVertical />
    <Text variant="Small" className={styles.label}>
      {label}
    </Text>
  </Link>
);
