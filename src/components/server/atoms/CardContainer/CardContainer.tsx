import React from "react";
import classNames from "classnames";
import styles from "./CardContainer.module.scss";
import type { CardContainerProps } from "./types";

const CardContainer: React.FC<CardContainerProps> = ({ children, className }) => {
  return (
    <div className={classNames(styles.cardContainer, className)}>
      {children}
    </div>
  );
};

export default CardContainer;