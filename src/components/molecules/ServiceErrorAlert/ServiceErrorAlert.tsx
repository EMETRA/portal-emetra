import classNames from "classnames";
import styles from "./ServiceErrorAlert.module.scss";

type ServiceErrorAlertProps = {
  message: string;
  title?: string;
  className?: string;
};

export default function ServiceErrorAlert({
  message,
  title = "No se pudo cargar la informacion",
  className,
}: ServiceErrorAlertProps) {
  return (
    <div
      className={classNames(styles.Alert, className)}
      role="alert"
      aria-live="polite"
    >
      <strong className={styles.Title}>{title}</strong>
      <p className={styles.Message}>{message}</p>
    </div>
  );
}
