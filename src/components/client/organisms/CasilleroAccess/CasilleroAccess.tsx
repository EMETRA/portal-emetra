"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@/components/server/atoms";
import CasilleroTabs from "@/components/client/molecules/CasilleroTabs/CasilleroTabs";
import CasilleroPersonTypeSelector from "@/components/client/molecules/CasilleroPersonTypeSelector/CasilleroPersonTypeSelector";
import CasilleroFileField from "@/components/client/molecules/CasilleroFileField/CasilleroFileField";
import styles from "./CasilleroAccess.module.scss";

type View = "login" | "register" | "recover-email" | "recover-code" | "recover-password";
type PersonType = "individual" | "legal";

const fields = {
  login: [
    { id: "login-email", label: "Correo electrónico", type: "email", placeholder: "example@muniguate.com" },
    { id: "login-password", label: "Contraseña", type: "password", placeholder: "Ingresa tu contraseña" },
  ],
  register: [
    { id: "email", label: "Correo electrónico", type: "email", placeholder: "example@muniguate.com" },
    { id: "confirm-email", label: "Confirmar correo electrónico", type: "email", placeholder: "example@muniguate.com" },
    { id: "phone", label: "Teléfono", type: "tel", placeholder: "12345678" },
    { id: "password", label: "Contraseña", type: "password", placeholder: "Ingresa tu contraseña" },
    { id: "confirm-password", label: "Confirmar contraseña", type: "password", placeholder: "Confirma tu contraseña" },
  ],
} as const;

export default function CasilleroAccess() {
  const [view, setView] = useState<View>("login");
  const [personType, setPersonType] = useState<PersonType>("individual");
  const [fileNames, setFileNames] = useState({ rtu: "", mandate: "" });
  const [message, setMessage] = useState("");

  const changeView = (nextView: View) => {
    setView(nextView);
    setMessage("");
  };

  const changePersonType = (nextType: PersonType) => {
    setPersonType(nextType);
    setFileNames({ rtu: "", mandate: "" });
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (view === "recover-email") {
      setView("recover-code");
      setMessage("");
      return;
    }

    if (view === "recover-code") {
      setView("recover-password");
      setMessage("");
      return;
    }

    if (view === "recover-password") {
      const formData = new FormData(event.currentTarget);
      const password = String(formData.get("recovery-password") ?? "");
      const confirmPassword = String(formData.get("recovery-confirm-password") ?? "");

      if (password !== confirmPassword) {
        setMessage("Las contraseñas no coinciden.");
        return;
      }

      setView("login");
      setMessage("La contraseña fue restablecida correctamente.");
      return;
    }

    if (view === "register") {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "");
      const confirmEmail = String(formData.get("confirm-email") ?? "");
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirm-password") ?? "");

      if (email !== confirmEmail) {
        setMessage("Los correos electrónicos no coinciden.");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Las contraseñas no coinciden.");
        return;
      }
    }

    setMessage(
      view === "login"
        ? "El inicio de sesión se conectará al servicio de Casillero."
        : "El registro se conectará al servicio de Casillero."
    );
  };

  const isLogin = view === "login";
  const isRegister = view === "register";
  const isRecovery = view.startsWith("recover-");

  const renderRecoveryFields = () => {
    if (view === "recover-email") {
      return (
        <label className={styles.field} htmlFor="recovery-email">
          <span>Correo electrónico</span>
          <Input
            id="recovery-email"
            name="recovery-email"
            type="email"
            placeholder="example@muniguate.com"
            autoComplete="email"
            required
            className={styles.input}
          />
        </label>
      );
    }

    if (view === "recover-code") {
      return (
        <label className={styles.field} htmlFor="recovery-code">
          <span>Ingresar código</span>
          <Input
            id="recovery-code"
            name="recovery-code"
            type="text"
            placeholder="8QGRH7T6"
            autoComplete="one-time-code"
            required
            className={styles.input}
          />
        </label>
      );
    }

    return (
      <>
        <label className={styles.field} htmlFor="recovery-password">
          <span>Nueva Contraseña</span>
          <Input
            id="recovery-password"
            name="recovery-password"
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            autoComplete="new-password"
            required
            className={styles.input}
          />
        </label>
        <label className={styles.field} htmlFor="recovery-confirm-password">
          <span>Confirmar Contraseña</span>
          <Input
            id="recovery-confirm-password"
            name="recovery-confirm-password"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            autoComplete="new-password"
            required
            className={styles.input}
          />
        </label>
      </>
    );
  };

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <div className={styles.titleRow}>
          <span />
          <h1>{isRecovery ? "Recuperar Contraseña" : isLogin ? "Log In" : "Registro"}</h1>
          <span />
        </div>

        <div className={styles.card}>
          <CasilleroTabs
            loginActive={isLogin || isRecovery}
            registerActive={isRegister}
            onLogin={() => changeView("login")}
            onRegister={() => changeView("register")}
          />

          <h2>
            {isRecovery ? (
              <>Recuperar Contraseña</>
            ) : isLogin ? (
              <>Inicio de Sesión</>
            ) : (
              <>
                <span className={styles.desktopTitle}>Creación de Cuenta</span>
                <span className={styles.mobileTitle}>Crear Cuenta</span>
              </>
            )}
          </h2>

          <form
            key={view}
            className={isRegister ? styles.registerForm : isRecovery ? styles.recoveryForm : styles.loginForm}
            onSubmit={handleSubmit}
          >
            {isRegister && (
              <CasilleroPersonTypeSelector
                value={personType}
                onChange={changePersonType}
              />
            )}

            {isRegister && personType === "individual" && (
              <>
                <label className={styles.field} htmlFor="dpi">
                  <span>DPI</span>
                  <Input id="dpi" name="dpi" type="text" placeholder="123456789123" required className={styles.input} />
                </label>
                <label className={styles.field} htmlFor="nit">
                  <span>NIT</span>
                  <Input id="nit" name="nit" type="text" placeholder="12345678" required className={styles.input} />
                </label>
              </>
            )}

            {isRegister && personType === "legal" && (
              <>
                <CasilleroFileField
                  id="rtu"
                  label="RTU"
                  fileName={fileNames.rtu}
                  onChange={(fileName) => setFileNames((current) => ({ ...current, rtu: fileName }))}
                />
                <CasilleroFileField
                  id="legal-mandate"
                  label="Mandato Representante Legal"
                  fileName={fileNames.mandate}
                  onChange={(fileName) => setFileNames((current) => ({ ...current, mandate: fileName }))}
                />
              </>
            )}

            {!isRecovery && fields[isRegister ? "register" : "login"].map((field) => (
              <label className={styles.field} key={field.id} htmlFor={field.id}>
                <span>{field.label}</span>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  autoComplete={
                    field.id.includes("password")
                      ? isLogin
                        ? "current-password"
                        : "new-password"
                      : field.type === "email"
                        ? "email"
                        : "off"
                  }
                  className={styles.input}
                />
              </label>
            ))}

            {isRecovery ? (
              <div className={styles.recoveryActions}>
                <Button type="submit" variant="success" className={styles.submitButton}>
                  {view === "recover-email"
                    ? "Enviar código"
                    : view === "recover-code"
                      ? "Validar"
                      : "Reestablecer"}
                </Button>
                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={() => changeView("login")}
                >
                  Iniciar Sesión
                </button>
              </div>
            ) : isLogin ? (
              <div className={styles.loginActions}>
                {/* Aquí va el captcha real. */}
                <Button type="submit" variant="success" className={styles.submitButton}>
                  Iniciar Sesión
                </Button>
                <button
                  type="button"
                  className={styles.mobileCreateAccount}
                  onClick={() => changeView("register")}
                >
                  Crear Cuenta
                </button>
                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={() => changeView("recover-email")}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            ) : (
              <>
                <label className={styles.terms}>
                  <input type="checkbox" required />
                  <span>
                    Declaro que la información proporcionada es verídica y acepto la
                    responsabilidad legal sobre los datos registrados.
                  </span>
                </label>
                <Button type="submit" variant="success" className={styles.submitButton}>
                  Crear Cuenta
                </Button>
                <button
                  type="button"
                  className={styles.mobileLoginLink}
                  onClick={() => changeView("login")}
                >
                  ¿Ya tiene cuenta? Inicie Sesión
                </button>
              </>
            )}

            {isRecovery && renderRecoveryFields()}
            {message && <p className={styles.formMessage}>{message}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
