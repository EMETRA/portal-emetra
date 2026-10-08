"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/server/atoms";
import { aceptarDenuncia, consultarAceptacion, consultarPlantilla, crearRequestId, descargarPlantilla, urlPagoSeguro, type Aceptacion, type ConsultaAceptacion, type ConsultaPlantilla } from "@/lib/vivi/acciones";
import styles from "./ViviCorreo.module.scss";
import { comprobarCasoReporte } from '@/lib/vivi/enlace-reporte';

type Props = { token: string; accion: 'aceptar' | 'refutar'; codigoCasoEsperado?: string };
const mensajeError = (error: unknown) => error instanceof Error ? error.message : 'No se pudo completar la solicitud. Intenta de nuevo.';

export default function ViviCorreo({ token, accion, codigoCasoEsperado }: Props) {
  const [consulta, setConsulta] = useState<ConsultaAceptacion | null>(null);
  const [plantilla, setPlantilla] = useState<ConsultaPlantilla | null>(null);
  const [resultado, setResultado] = useState<Aceptacion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [consentimiento, setConsentimiento] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descargada, setDescargada] = useState(false);
  const [recarga, setRecarga] = useState(0);
  const requestId = useRef<string | null>(null);
  const enCurso = useRef(false);

  useEffect(() => {
    const abort = new AbortController();
    setCargando(true); setError(null);
    const leer = accion === 'aceptar'
      ? consultarAceptacion(token, abort.signal).then(datos => { if (datos.estadoEnlace === 'VIGENTE') comprobarCasoReporte(datos.denuncia.codigoCaso, codigoCasoEsperado); if (!abort.signal.aborted) setConsulta(datos); })
      : consultarPlantilla(token, abort.signal).then(datos => { comprobarCasoReporte(datos.caso.codigo, codigoCasoEsperado); if (!abort.signal.aborted) setPlantilla(datos); });
    leer.catch(e => { if (!abort.signal.aborted) setError(mensajeError(e)); })
      .finally(() => { if (!abort.signal.aborted) setCargando(false); });
    return () => abort.abort();
  }, [token, accion, recarga, codigoCasoEsperado]);

  async function confirmar() {
    if (enCurso.current || !consentimiento || consulta?.estadoEnlace !== 'VIGENTE' || !consulta.puedeAceptar) return;
    enCurso.current = true; setProcesando(true); setError(null);
    try {
      requestId.current ??= crearRequestId();
      setResultado(await aceptarDenuncia(token, requestId.current));
    } catch (e) { setError(mensajeError(e)); }
    finally { enCurso.current = false; setProcesando(false); }
  }
  async function obtenerPdf() {
    if (enCurso.current || !plantilla) return;
    enCurso.current = true; setProcesando(true); setError(null);
    try {
      const pdf = await descargarPlantilla(token);
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a'); link.href = url;
      link.download = `Plantilla-${plantilla.caso.codigo.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setDescargada(true);
    } catch (e) { setError(mensajeError(e)); }
    finally { enCurso.current = false; setProcesando(false); }
  }

  const usado = consulta?.estadoEnlace === 'USADO' ? consulta : null;
  const remision = resultado?.remision ?? usado?.remision;
  const pago = resultado?.pago ?? usado?.pago ?? null;
  const urlPago = urlPagoSeguro(pago);
  return (
    <main className={styles.main}>
      <section className={styles.card} aria-busy={cargando || procesando}>
        <h1>{accion === 'aceptar' ? 'Aceptación de denuncia' : 'Plantilla de defensa'}</h1>
        {cargando && <p role="status">Consultando el caso…</p>}
        {error && <div role="alert" className={styles.error}><p>{error}</p>{!consulta && !plantilla && <Button onClick={() => setRecarga(n => n + 1)}>Reintentar consulta</Button>}</div>}
        {!cargando && accion === 'aceptar' && (
          resultado || usado ? <>
            <h2>Aceptación registrada</h2>
            {remision ? <p>Remisión <strong>{remision.serie}-{remision.numero}</strong> · Ciudad {remision.ciudad}</p> : <p>La aceptación ya fue registrada. Consulta de nuevo para recuperar el número de remisión.</p>}
            {urlPago ? <a className={styles.payment} href={urlPago} rel="noreferrer">Continuar al pago</a> : <p>El enlace de pago se está preparando. Puedes volver a consultar este mismo enlace.</p>}
            <Button variant="outline" disabled={procesando} onClick={() => { setResultado(null); setRecarga(n => n + 1); }}>Consultar estado del pago</Button>
          </> : consulta?.estadoEnlace === 'VIGENTE' ? <>
            <h2>No. de caso {consulta.denuncia.codigoCaso}</h2>
            {consulta.denuncia.placa && <p>Placa: {consulta.denuncia.usoPlaca}-{consulta.denuncia.placa}</p>}
            {consulta.denuncia.regla != null && <p>Infracción: {consulta.denuncia.regla}</p>}
            {consulta.puedeAceptar ? <>
              <p>Abrir este enlace no genera una multa. Al confirmar tu aceptación se emitirá la remisión correspondiente.</p>
              <label className={styles.consent}><input type="checkbox" checked={consentimiento} disabled={procesando} onChange={e => setConsentimiento(e.target.checked)} />He revisado el caso y confirmo que deseo aceptar la denuncia.</label>
              <Button disabled={!consentimiento || procesando} onClick={confirmar}>{procesando ? 'Registrando aceptación…' : 'Confirmar aceptación'}</Button>
              <p>Si deseas presentar una defensa, abre la opción «Refutar» del correo recibido.</p>
            </> : <p>Este caso ya no admite aceptación. Estado: {consulta.estadoCaso}.</p>}
          </> : consulta && <p>Este enlace está {consulta.estadoEnlace === 'VENCIDO' ? 'vencido' : 'revocado'}. Estado del caso: {consulta.estadoCaso}.</p>
        )}
        {!cargando && accion === 'refutar' && plantilla && <>
          <h2>No. de caso {plantilla.caso.codigo}</h2>
          {plantilla.caso.placa && <p>Placa: {plantilla.caso.usoPlaca}-{plantilla.caso.placa}</p>}
          {plantilla.caso.descripcionHecho && <p>{plantilla.caso.descripcionHecho}</p>}
          <p>Descarga la plantilla, imprímela, complétala a mano y preséntala en el juzgado indicado en el aviso.</p>
          <p>Descargar el PDF no registra una defensa ni genera una multa.</p>
          <Button disabled={procesando} onClick={obtenerPdf}>{procesando ? 'Descargando…' : 'Descargar plantilla PDF'}</Button>
          {descargada && <p role="status">Plantilla descargada. Comprueba que el PDF corresponde al caso {plantilla.caso.codigo}.</p>}
        </>}
      </section>
    </main>
  );
}
