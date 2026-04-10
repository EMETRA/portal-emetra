import React from "react";
import styles from "./Separator.module.scss";

type SeparatorProps = {
  children?: React.ReactNode;
  color?: string;
};

const Separator: React.FC<SeparatorProps> = ({ children, color }) => {
  const style = color ? ({ ['--sep-color']: color } as React.CSSProperties) : undefined;
  if (!children) return <hr className={styles.Separator} style={style} />;
  return (
    <div className={styles.SeparatorWithText} style={style}>
      <span className={styles.Line} />
      <span className={styles.Text}>{children}</span>
      <span className={styles.Line} />
    </div>
  );
};

export default Separator;
