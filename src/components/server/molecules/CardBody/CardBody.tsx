import React from "react";
import classNames from "classnames";
import styles from "./CardBody.module.scss";
import type { CardBodyProps } from "./types";


const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={classNames(styles.cardBody, className)}>
    {children}
  </div>
);

export default CardBody;
