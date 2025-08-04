import React from "react";
import styles from "./LoadingSpinner.module.scss";
import classNames from "classnames";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LoadingSpinnerProps } from "./types";

const theme = createTheme();

/**
 * Componente de spinner de carga.
 *
 * @component
 * @returns {React.ReactElement} - El componente de spinner de carga.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  variant = "page-wide",
  className,
}) => {
  return (
    <ThemeProvider theme={theme}>
      {variant === "page-wide" ? (
        <div
          className={classNames(
            styles.Container,
            { [styles.hidden]: !visible },
            className
          )}
        >
          <CircularProgress className={classNames(styles.Spinner)} />
        </div>
      ) : (
        <CircularProgress
          className={classNames(
            styles.Spinner,
            styles.Inline,
            { [styles.hidden]: !visible },
            className
          )}
        />
      )}
    </ThemeProvider>
  );
};

export default LoadingSpinner;
