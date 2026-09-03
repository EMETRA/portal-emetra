"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CasilleroTabs from "@/components/client/molecules/CasilleroTabs/CasilleroTabs";
import LoginView from "./views/LoginView";
import TwoFactorView from "./views/TwoFactorView";
import RegisterView from "./views/RegisterView";
import RecoverView from "./views/RecoverView";
import VerifyEmailView from "./views/VerifyEmailView";
import type { AccessView } from "./types";
import styles from "./CasilleroAccess.module.scss";

const pageTitle: Record<AccessView, string> = {
  login: "Log In",
  "login-2fa": "Log In",
  register: "Registro",
  recover: "Recuperar Contraseña",
  "verify-email": "Verificar Email",
};

export default function CasilleroAccess() {
  const router = useRouter();
  const [view, setView] = useState<AccessView>("login");
  const [notice, setNotice] = useState("");
  const [verificationId, setVerificationId] = useState("");

  const handleRegisterSuccess = (verificationId: string) => {
    setVerificationId(verificationId);
    changeView("verify-email");
  };

  const changeView = (nextView: AccessView) => {
    setView(nextView);
    setNotice("");
  };

  const goToLogin = (message?: string) => {
    setNotice(message ?? "");
    setView("login");
  };

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <div className={styles.titleRow}>
          <span />
          <h1>{pageTitle[view]}</h1>
          <span />
        </div>

        <div className={styles.card}>
          {view !== "login-2fa" && view !== "verify-email" && (
            <CasilleroTabs
              loginActive={view === "login" || view === "recover"}
              registerActive={view === "register"}
              onLogin={() => changeView("login")}
              onRegister={() => changeView("register")}
            />
          )}

          <h2>
            {view === "login-2fa" ? (
              <>Autenticación en dos pasos</>
            ) : view === "recover" ? (
              <>Recuperar Contraseña</>
            ) : view === "login" ? (
              <>Inicio de Sesión</>
            ) : view === "verify-email" ? (
              <>Verificar Email</>
            ) : (
              <>
                <span className={styles.desktopTitle}>Creación de Cuenta</span>
                <span className={styles.mobileTitle}>Crear Cuenta</span>
              </>
            )}
          </h2>

          {view === "login" && (
            <LoginView
              notice={notice}
              onSuccess={() => changeView("login-2fa")}
              onRegister={() => changeView("register")}
              onRecover={() => changeView("recover")}
            />
          )}
          {view === "login-2fa" && (
            <TwoFactorView onSuccess={() => router.push("/casillero/dashboard")} />
          )}
          {view === "register" && (
            <RegisterView onLogin={() => changeView("login")} onSuccess={handleRegisterSuccess} />
          )}
          {view === "recover" && (
            <RecoverView onLogin={goToLogin} />
          )}
          {view === "verify-email" && (
            <VerifyEmailView verificationId={verificationId} onSuccess={() => changeView("login")} />
          )}
        </div>
      </section>
    </main>
  );
}
