
import React from "react";
import classNames from "classnames";
import styles from "./Tabs.module.scss";
import type { TabsProps } from "./types";
import TabLabel from "../../atoms/TabLabel/TabLabel";

const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className,
}) => {
  return (
    <div
      role="tablist"
      className={classNames(styles.tabsContainer, className)}
    >
      {items.map(({ id, label }) => (
        <TabLabel
          key={id}
          id={id}
          label={label}
          isActive={id === activeId}
          onClick={onChange}
        />
      ))}
    </div>
  );
};

export default Tabs;
