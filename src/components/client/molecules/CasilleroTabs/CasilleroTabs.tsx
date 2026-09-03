import styles from "./CasilleroTabs.module.scss";

type CasilleroTabsProps = {
  loginActive: boolean;
  registerActive: boolean;
  onLogin: () => void;
  onRegister: () => void;
};

export default function CasilleroTabs({
  loginActive,
  registerActive,
  onLogin,
  onRegister,
}: CasilleroTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Acceso a Casillero">
      <button type="button" role="tab" aria-selected={loginActive} className={loginActive ? styles.active : styles.tab} onClick={onLogin}>
        Inicio de Sesión
      </button>
      <div className={styles.divider} />
      <button type="button" role="tab" aria-selected={registerActive} className={registerActive ? styles.active : styles.tab} onClick={onRegister}>
        Crear Cuenta
      </button>
    </div>
  );
}
