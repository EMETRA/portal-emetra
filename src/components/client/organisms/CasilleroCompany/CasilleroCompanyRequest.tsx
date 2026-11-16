"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import CardGeneral from "@/components/client/atoms/CardGeneral/CardGeneral";
import { Button, Input } from "@/components/server/atoms";
import { createIdempotencyKey } from "@/lib/casillero/api";
import { createCompanyRegistrationRequest, getCompanyRegistrationRequest, type CompanyRegistrationRequest } from "@/lib/casillero/company";
import { nitSchema } from "@/schema/casillero";
import { companyLabel, formatCompanyDate } from "./CompanyState";
import styles from "./CasilleroCompany.module.scss";

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const LAST_REQUEST_KEY = "casillero:last-company-registration-request";

export default function CasilleroCompanyRequestPage() {
  const [request, setRequest] = useState<CompanyRegistrationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const idempotency = useRef(createIdempotencyKey());

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") === "1") {
      window.localStorage.removeItem(LAST_REQUEST_KEY);
      setLoading(false);
      return;
    }
    const id = window.localStorage.getItem(LAST_REQUEST_KEY);
    if (!id) { setLoading(false); return; }
    getCompanyRegistrationRequest(id).then(setRequest).catch(() => {
      window.localStorage.removeItem(LAST_REQUEST_KEY);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const nit = String(form.get("nit") ?? "").trim();
    const razonSocial = String(form.get("razonSocial") ?? "").trim();
    const legalFile = form.get("representationLegalFile");
    const otherFiles = form.getAll("otherFiles").filter((file): file is File => file instanceof File && file.size > 0);

    try { await nitSchema.validate(nit); } catch (reason) {
      setError(reason instanceof Error ? reason.message : "El NIT no es válido."); return;
    }
    if (razonSocial.length < 2) { setError("Ingresa la razón social."); return; }
    if (!(legalFile instanceof File) || legalFile.size === 0) { setError("Adjunta el documento de representación legal."); return; }
    if ([legalFile, ...otherFiles].some((file) => file.size > MAX_DOCUMENT_BYTES)) { setError("Cada archivo debe pesar como máximo 10 MB."); return; }
    if (otherFiles.length > 9) { setError("Puedes adjuntar como máximo 9 documentos adicionales."); return; }

    setSubmitting(true);
    try {
      const created = await createCompanyRegistrationRequest({ nit, razonSocial, representationLegalFile: legalFile, otherFiles, idempotencyKey: idempotency.current });
      window.localStorage.setItem(LAST_REQUEST_KEY, created.id);
      setRequest(await getCompanyRegistrationRequest(created.id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo enviar la solicitud.");
    } finally { setSubmitting(false); }
  };

  const startAnother = () => {
    window.localStorage.removeItem(LAST_REQUEST_KEY);
    idempotency.current = createIdempotencyKey();
    setRequest(null);
    setError("");
  };

  return (
    <div className={styles.wrapper}>
      <SectionTitle>{request ? "Mi solicitud empresarial" : "Solicitar empresa"}</SectionTitle>
      <CardGeneral className={styles.card} padding="lg">
        {loading ? <p className={styles.status}>Cargando solicitud...</p>
        : request ? (
          <>
            <dl className={styles.details}>
              <div className={styles.detail}><dt>Estado</dt><dd>{companyLabel(request.status)}</dd></div>
              <div className={styles.detail}><dt>Razón social</dt><dd>{request.razonSocial}</dd></div>
              <div className={styles.detail}><dt>NIT</dt><dd>{request.nit}</dd></div>
              <div className={styles.detail}><dt>Enviada</dt><dd>{formatCompanyDate(request.submittedAt)}</dd></div>
              {request.observation ? <div className={styles.detail}><dt>Observación</dt><dd>{request.observation}</dd></div> : null}
              <div className={styles.detail}><dt>Documentos</dt><dd>{request.documents.length}</dd></div>
            </dl>
            <Button type="button" variant="outline" onClick={startAnother}>Registrar otra empresa</Button>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <p className={styles.hint}><strong>Nota:</strong> la solicitud quedará pendiente de revisión antes de crear la empresa.</p>
            <label className={styles.field}><span className={styles.label}>NIT</span><Input name="nit" type="text" required className={styles.input} /></label>
            <label className={styles.field}><span className={styles.label}>Razón social</span><Input name="razonSocial" type="text" required className={styles.input} /></label>
            <label className={styles.field}><span className={styles.label}>Representación legal</span><input name="representationLegalFile" type="file" accept=".pdf,image/jpeg,image/png" required className={styles.fileInput} /></label>
            <label className={styles.field}><span className={styles.label}>Documentos adicionales (opcional)</span><input name="otherFiles" type="file" accept=".pdf,image/jpeg,image/png" multiple className={styles.fileInput} /></label>
            {error ? <p className={`${styles.message} ${styles.error}`} role="alert">{error}</p> : null}
            <Button type="submit" variant="success" className={styles.submit} disabled={submitting}>{submitting ? "Enviando..." : "Enviar solicitud"}</Button>
          </form>
        )}
      </CardGeneral>
    </div>
  );
}
