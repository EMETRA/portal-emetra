import React from "react";
import styles from "./Separator.module.scss";

type SeparatorProps = {
  children?: React.ReactNode;
};

const Separator: React.FC<SeparatorProps> = ({ children }) => {
  if (!children) return <hr className={styles.Separator} />;
  return (
    <div className={styles.SeparatorWithText}>
      <span className={styles.Line} />
      <span className={styles.Text}>{children}</span>
      <span className={styles.Line} />
    </div>
  );
};

export default Separator;
