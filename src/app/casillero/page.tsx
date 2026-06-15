"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@/components/server/atoms";
import styles from "./page.module.scss";

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

export default function CasilleroPage() {
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
          <div className={styles.tabs} role="tablist" aria-label="Acceso a Casillero">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin || isRecovery}
              className={isLogin || isRecovery ? styles.activeTab : styles.tab}
              onClick={() => changeView("login")}
            >
              Inicio de Sesión
            </button>
            <div className={styles.tabDivider} />
            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              className={isRegister ? styles.activeTab : styles.tab}
              onClick={() => changeView("register")}
            >
              Crear Cuenta
            </button>
          </div>

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
              <div className={styles.personType} role="radiogroup" aria-label="Tipo de persona">
                <button
                  type="button"
                  role="radio"
                  aria-checked={personType === "individual"}
                  className={personType === "individual" ? styles.activePersonType : styles.personTypeButton}
                  onClick={() => changePersonType("individual")}
                >
                  Persona individual
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={personType === "legal"}
                  className={personType === "legal" ? styles.activePersonType : styles.personTypeButton}
                  onClick={() => changePersonType("legal")}
                >
                  Persona jurídica
                </button>
              </div>
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
                <label className={styles.field} htmlFor="rtu">
                  <span>RTU</span>
                  <span className={styles.fileInput}>
                    <span>{fileNames.rtu || "Seleccionar archivo"}</span>
                    <strong>Adjuntar</strong>
                    <input
                      id="rtu"
                      name="rtu"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      required
                      onChange={(event) => setFileNames((current) => ({
                        ...current,
                        rtu: event.target.files?.[0]?.name ?? "",
                      }))}
                    />
                  </span>
                </label>
                <label className={styles.field} htmlFor="legal-mandate">
                  <span>Mandato Representante Legal</span>
                  <span className={styles.fileInput}>
                    <span>{fileNames.mandate || "Seleccionar archivo"}</span>
                    <strong>Adjuntar</strong>
                    <input
                      id="legal-mandate"
                      name="legal-mandate"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      required
                      onChange={(event) => setFileNames((current) => ({
                        ...current,
                        mandate: event.target.files?.[0]?.name ?? "",
                      }))}
                    />
                  </span>
                </label>
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
                <label className={styles.humanCheck}>
                  <input type="checkbox" required />
                  <span>Verifica que eres una persona</span>
                  <strong>CASILLERO</strong>
                </label>
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
