"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Copy, ShieldCheck, Smartphone } from "lucide-react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import {
  confirmTotpEnrollment,
  fetchAuthenticationFactors,
  startTotpEnrollment,
  requestFactorRevocationStepUp,
  revokeAuthenticationFactor,
  setPreferredAuthenticationFactor,
  type AuthenticationFactor,
  type TotpEnrollment,
} from "@/lib/casillero/authenticationFactors";
import styles from "./CasilleroAuthenticationMethods.module.scss";

type Step = "overview" | "setup" | "recovery";

function manualKeyFromUri(uri: string): string {
  try {
    return new URL(uri).searchParams.get("secret") ?? "";
  } catch {
    return "";
  }
}

export default function CasilleroAuthenticationMethods() {
  const [factors, setFactors] = useState<AuthenticationFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<Step>("overview");
  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null);
  const [qrImage, setQrImage] = useState("");
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [revocationChallenge, setRevocationChallenge] = useState<string | null>(null);
  const [revocationCode, setRevocationCode] = useState("");
  const [revocationPassword, setRevocationPassword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setFactors(await fetchAuthenticationFactors());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron cargar los métodos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activeTotp = factors.find((factor) => factor.type === "TOTP" && factor.status === "ACTIVO");
  const activeEmail = factors.find((factor) => factor.type === "CORREO" && factor.status === "ACTIVO");

  const beginEnrollment = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const result = await startTotpEnrollment();
      setEnrollment(result);
      setQrImage(await QRCode.toDataURL(result.provisioningUri, {
        width: 220,
        margin: 1,
        errorCorrectionLevel: "M",
      }));
      setCode("");
      setStep("setup");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar la configuración.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmEnrollment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setMessage("Ingresa el código de seis dígitos que muestra la aplicación.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const result = await confirmTotpEnrollment(code);
      setRecoveryCodes(result.recoveryCodes);
      setStep("recovery");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo confirmar el código.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectPreferred = async (factor: AuthenticationFactor) => {
    if (factor.preferred || submitting) return;
    setSubmitting(true); setMessage("");
    try { await setPreferredAuthenticationFactor(factor.id); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo actualizar el método principal."); }
    finally { setSubmitting(false); }
  };

  const requestRemoval = async () => {
    if (!activeTotp || submitting) return;
    setSubmitting(true); setMessage("");
    try {
      const stepUp = await requestFactorRevocationStepUp(activeTotp.id);
      setRevocationChallenge(stepUp.challengeId);
      setRevocationCode(""); setRevocationPassword("");
      setMessage(`Enviamos un código a ${stepUp.destinationMasked}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo solicitar el código."); }
    finally { setSubmitting(false); }
  };

  const removeTotp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailFactor = activeEmail;
    if (!activeTotp || !emailFactor || !revocationChallenge) return;
    if (!/^\d{6}$/.test(revocationCode) || !revocationPassword) { setMessage("Ingresa tu contraseña y el código de seis dígitos recibido por correo."); return; }
    setSubmitting(true); setMessage("");
    try {
      await revokeAuthenticationFactor(activeTotp.id, { verificationFactorId: emailFactor.id, password: revocationPassword, code: revocationCode, challengeId: revocationChallenge });
      setRevocationChallenge(null); setRevocationCode(""); setRevocationPassword("");
      await load(); setMessage("La aplicación autenticadora fue eliminada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo eliminar la aplicación."); }
    finally { setSubmitting(false); }
  };

  const copy = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(successMessage);
    } catch {
      setMessage("No fue posible copiar. Selecciona el texto y cópialo manualmente.");
    }
  };

  if (loading) {
    return <div className={styles.wrapper}><SectionTitle>Métodos de autenticación</SectionTitle><div className={styles.loading}><LoadingSpinner variant="inline" /></div></div>;
  }

  return (
    <div className={styles.wrapper}>
      <SectionTitle>Métodos de autenticación</SectionTitle>
      <CardGeneral className={styles.card} padding="lg">
        {step === "overview" && (
          <>
            <div className={styles.heading}>
              <ShieldCheck size={30} aria-hidden="true" />
              <div>
                <h2>Protege tu cuenta</h2>
                <p>Agrega una aplicación autenticadora como segundo factor de inicio de sesión.</p>
              </div>
            </div>

            <div className={styles.factorList}>
              <div className={styles.factor}>
                <div><strong>Correo electrónico</strong><span>Disponible para verificar el acceso.</span></div>
                <div className={styles.factorActions}><span className={styles.active}>Activo</span>{activeEmail?.preferred ? <span className={styles.principal}>Principal</span> : activeEmail && <Button type="button" variant="text" onClick={() => void selectPreferred(activeEmail)} disabled={submitting}>Usar como principal</Button>}</div>
              </div>
              <div className={styles.factor}>
                <div><strong>Aplicación autenticadora</strong><span>{activeTotp ? "Configurada para tu cuenta." : "Google Authenticator o Microsoft Authenticator."}</span></div>
                {activeTotp ? <div className={styles.factorActions}><span className={styles.active}>Activo</span>{activeTotp.preferred ? <span className={styles.principal}>Principal</span> : <Button type="button" variant="text" onClick={() => void selectPreferred(activeTotp)} disabled={submitting}>Usar como principal</Button>}</div> : <span className={styles.inactive}>Sin configurar</span>}
              </div>
            </div>

            {!activeTotp && <Button type="button" variant="success" onClick={() => void beginEnrollment()} disabled={submitting}>
              {submitting ? "Preparando..." : "Configurar aplicación autenticadora"}
            </Button>}
            {activeTotp && <>
              <p className={styles.note}>Tu aplicación autenticadora ya está activa. El método principal se selecciona automáticamente al iniciar sesión.</p>
              {!revocationChallenge ? <Button type="button" variant="danger" onClick={() => void requestRemoval()} disabled={submitting}>{submitting ? "Enviando código..." : "Quitar aplicación autenticadora"}</Button> : <form className={styles.revocationForm} onSubmit={removeTotp}>
                <strong>Confirma que deseas quitarla</strong><p>Para proteger tu cuenta, ingresa tu contraseña y el código enviado a tu correo.</p>
                <Input type="password" value={revocationPassword} onChange={(event) => setRevocationPassword(event.target.value)} placeholder="Tu contraseña" autoComplete="current-password" required />
                <Input value={revocationCode} onChange={(event) => setRevocationCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="Código de 6 dígitos" autoComplete="one-time-code" required />
                <div className={styles.actions}><Button type="button" variant="default" onClick={() => setRevocationChallenge(null)}>Cancelar</Button><Button type="submit" variant="danger" disabled={submitting}>{submitting ? "Quitando..." : "Confirmar y quitar"}</Button></div>
              </form>}
            </>}
          </>
        )}

        {step === "setup" && enrollment && (
          <div className={styles.setup}>
            <h2>Configura tu aplicación</h2>
            <p>Abre Google Authenticator o Microsoft Authenticator, agrega una cuenta y escanea este código QR.</p>
            {qrImage && <img className={styles.qr} src={qrImage} alt="Código QR para configurar la aplicación autenticadora" />}
            <p className={styles.manualLabel}>¿No puedes escanearlo? Ingresa esta clave manualmente:</p>
            <div className={styles.manualKey}>
              <code>{manualKeyFromUri(enrollment.provisioningUri)}</code>
              <button type="button" aria-label="Copiar clave manual" onClick={() => void copy(manualKeyFromUri(enrollment.provisioningUri), "Clave copiada.")}><Copy size={18} /></button>
            </div>
            <form className={styles.confirmForm} onSubmit={confirmEnrollment}>
              <label htmlFor="totp-code">Código de 6 dígitos</label>
              <Input id="totp-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" required />
              <div className={styles.actions}>
                <Button type="button" variant="default" onClick={() => { setStep("overview"); setMessage(""); }}>Cancelar</Button>
                <Button type="submit" variant="success" disabled={submitting}>{submitting ? "Verificando..." : "Verificar y activar"}</Button>
              </div>
            </form>
          </div>
        )}

        {step === "recovery" && (
          <div className={styles.recovery}>
            <CheckCircle2 size={42} aria-hidden="true" />
            <h2>Aplicación autenticadora activada</h2>
            <p>Guarda estos códigos de recuperación en un lugar seguro. Se muestran una sola vez y sirven si pierdes acceso a tu aplicación.</p>
            <div className={styles.recoveryCodes}>{recoveryCodes.map((item) => <code key={item}>{item}</code>)}</div>
            <Button type="button" variant="default" onClick={() => void copy(recoveryCodes.join("\n"), "Códigos de recuperación copiados.")}>Copiar códigos</Button>
            <Button type="button" variant="success" onClick={() => { setStep("overview"); setMessage(""); }}>Entendido</Button>
          </div>
        )}

        {message && <p className={styles.message} role="status">{message}</p>}
      </CardGeneral>
    </div>
  );
}
