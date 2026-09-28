"use client";

import React, {
  forwardRef,
} from "react";
import styles from "./TextArea.module.scss";
import classNames from "classnames";

import type { TextAreaProps } from "./types.tsx";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={classNames(styles.TextArea, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

export default TextArea;