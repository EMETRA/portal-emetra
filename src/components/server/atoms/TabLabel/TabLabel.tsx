import React from "react";
import classNames from "classnames";
import styles from "./TabLabel.module.scss";
import type { TabLabelProps } from "./types";

const TabLabel: React.FC<TabLabelProps> = ({
  id,
  label,
  isActive,
  onClick,
  className,
}) => {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => onClick(id)}
      className={classNames(
        styles.tabLabel,
        { [styles.active]: isActive },
        className
      )}
    >
      {label}
    </button>
  );
};

export default TabLabel;
