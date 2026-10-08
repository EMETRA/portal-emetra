"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionTitle } from '@/components/server/molecules';
import { DenunciaDetalleCard } from '@/components/organisms/DenunciaDetalleCard';
import { DenunciaDetalleAcciones } from '@/components/organisms/DenunciaDetalleAcciones';
import { DenunciaDetalleConfirmacion } from '@/components/organisms/DenunciaDetalleConfirmacion';
import { DenunciaConfirmacionCarga } from '@/components/organisms/DenunciaConfirmacionCarga';
import { DenunciaConfirmacionResultado } from '@/components/organisms/DenunciaConfirmacionResultado/DenunciaConfirmacionResultado';
import ViviDefenseSent from '@/components/client/organisms/ViviDefenseSent/ViviDefenseSent';
import { leerEnlaceReporte, comprobarCasoReporte, type EnlaceReporte } from '@/lib/vivi/enlace-reporte';
import { aceptarDenuncia, consultarAceptacion, consultarPlantilla, crearRequestId, leerEvidencia, urlPagoSeguro, type Aceptacion, type ConsultaAceptacion, type ConsultaPlantilla } from '@/lib/vivi/acciones';
import type { Case, DefenseFile } from '@/lib/vivi/types';
import styles from '@/app/tramite-reporte/[id]/Page.module.scss';

type Vista = 'resumen' | 'confirmacion' | 'procesando' | 'resultado' | 'error';
const mensaje = (error: unknown) => error instanceof Error ? error.message : 'No se pudo consultar el reporte. Intenta de nuevo.';

export default function TramiteReporte({ codigoCaso, defensa = false }: { codigoCaso: string; defensa?: boolean }) {
  const [enlace, setEnlace] = useState<EnlaceReporte | null>(null);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const leer = () => { setEnlace(leerEnlaceReporte(window.location.hash)); setListo(true); };
    leer(); window.addEventListener('hashchange', leer);
    return () => window.removeEventListener('hashchange', leer);
  }, []);
  if (!listo) return <main className={styles.main}><p role="status">Abriendo el reporte…</p></main>;
  if (!enlace) return <main className={styles.main}><SectionTitle>Denuncia de tránsito</SectionTitle><p className={styles.notice}>Para consultar el reporte {codigoCaso}, abre el enlace privado del correo recibido.</p></main>;
  return <FlujoReporte key={codigoCaso + enlace.aceptar + enlace.refutar} codigoCaso={codigoCaso} enlace={enlace} defensa={defensa} />;
}

function FlujoReporte({ codigoCaso, enlace, defensa }: { codigoCaso: string; enlace: EnlaceReporte; defensa: boolean }) {
  const router = useRouter();
  const [consulta, setConsulta] = useState<ConsultaAceptacion | null>(null);
  const [plantilla, setPlantilla] = useState<ConsultaPlantilla | null>(null);
  const [caso, setCaso] = useState<Case | null>(null);
  const [resultado, setResultado] = useState<Aceptacion | null>(null);
  const [vista, setVista] = useState<Vista>('resumen');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avisoDefensa, setAvisoDefensa] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);
  const requestId = useRef<string | null>(null);
  const enCurso = useRef(false);

  useEffect(() => {
    const abort = new AbortController();
    const urls: string[] = [];
    setCargando(true); setError(null); setAvisoDefensa(null); setConsulta(null); setPlantilla(null); setCaso(null);
    void (async () => {
      let aceptacion: ConsultaAceptacion | null = null;
      let pdf: ConsultaPlantilla | null = null;
      let falloConsulta: unknown;
      if (enlace.aceptar) {
        try { aceptacion = await consultarAceptacion(enlace.aceptar, abort.signal); }
        catch (e) { falloConsulta = e; }
        if (aceptacion) comprobarCasoReporte(aceptacion.estadoEnlace === 'VIGENTE' ? aceptacion.denuncia.codigoCaso : aceptacion.codigoCaso, codigoCaso);
      }
      if (enlace.refutar && aceptacion?.estadoEnlace !== 'USADO') {
        try { pdf = await consultarPlantilla(enlace.refutar, abort.signal); }
        catch (e) { if (!abort.signal.aborted) setAvisoDefensa(mensaje(e)); }
        if (pdf) comprobarCasoReporte(pdf.caso.codigo, codigoCaso);
      }
      if (!aceptacion && !pdf) throw falloConsulta || new Error('El enlace venció o ya no permite consultar este reporte. Abre de nuevo el correo recibido.');
      const datos = aceptacion && (aceptacion.estadoEnlace === 'VIGENTE' || aceptacion.estadoEnlace === 'USADO') ? aceptacion.denuncia : undefined;
      const placa = [datos?.usoPlaca ?? pdf?.caso.usoPlaca, datos?.placa ?? pdf?.caso.placa].filter(Boolean).join('-') || 'No disponible';
      const fecha = datos?.capturadaEn ? new Date(datos.capturadaEn) : null;
      const evidencias: DefenseFile[] = [];
      let evidenceError = false;
      if (aceptacion?.estadoEnlace === 'VIGENTE' && enlace.aceptar) {
        for (const evidencia of aceptacion.evidencias || []) {
          try {
            const blob = await leerEvidencia(enlace.aceptar, codigoCaso, evidencia.idEvidencia, abort.signal);
            if (abort.signal.aborted) return;
            const sourceUrl = URL.createObjectURL(blob); urls.push(sourceUrl);
            evidencias.push({ id: evidencia.idEvidencia, name: `Evidencia ${evidencia.idEvidencia}`, sourceUrl, size: String(blob.size), mime: blob.type });
          } catch { evidenceError = true; }
        }
      }
      if (abort.signal.aborted) return;
      setConsulta(aceptacion); setPlantilla(pdf);
      setCaso({ caseNumber: codigoCaso, placa, caseDate: fecha && !Number.isNaN(fecha.getTime()) ? fecha.toLocaleString('es-GT', { timeZone: 'America/Guatemala' }) : 'No disponible', place: datos?.latitud != null && datos?.longitud != null ? `Coordenadas: ${datos.latitud}, ${datos.longitud}` : 'No disponible', title: 'Denuncia de tránsito', evidenceError, denuncia: { descripcion: datos?.descripcionHecho || pdf?.caso.descripcionHecho || `Regla ${datos?.regla ?? pdf?.caso.regla ?? 'no disponible'}`, evidencias } });
      if (aceptacion?.estadoEnlace === 'USADO') {
        if (!aceptacion.remision) throw new Error('El caso está aceptado, pero la remisión no está disponible para consulta.');
        setResultado({ idDenuncia: datos?.idDenuncia || '', remision: aceptacion.remision, reutilizada: true, pago: aceptacion.pago || { estado: 'PREPARANDO' } }); setVista('resultado');
      } else { setVista('resumen'); }
    })().catch(e => { if (!abort.signal.aborted) { setError(mensaje(e)); setCaso(null); } }).finally(() => { if (!abort.signal.aborted) setCargando(false); });
    return () => { abort.abort(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [codigoCaso, enlace, recarga]);

  const puedeAceptar = consulta?.estadoEnlace === 'VIGENTE' && consulta.puedeAceptar && !!enlace.aceptar;
  async function confirmar() {
    if (enCurso.current || !puedeAceptar || !enlace.aceptar) return;
    enCurso.current = true; setError(null); setVista('procesando');
    requestId.current ||= crearRequestId();
    try { const respuesta = await aceptarDenuncia(enlace.aceptar, requestId.current); setResultado(respuesta); setVista('resultado'); }
    catch (e) { setError(mensaje(e)); setVista('error'); }
    finally { enCurso.current = false; }
  }
  const volver = () => router.push(`/tramite-reporte/${encodeURIComponent(codigoCaso)}${window.location.hash}`);
  if (defensa && plantilla && !cargando && !error) return <main className={styles.main}><ViviDefenseSent caseNumber={codigoCaso} token={enlace.refutar || undefined} onVolver={volver} /></main>;
  const titulo = vista === 'confirmacion' ? 'Confirma tu aceptación' : 'Denuncia de tránsito';
  return <main className={styles.main}>
    <SectionTitle>{titulo}</SectionTitle>
    {cargando ? <div className={styles.layout}><DenunciaDetalleCard loading /><DenunciaDetalleAcciones loading onAceptarPago={() => {}} onPresentarDefensa={() => {}} /></div> : error && !caso ? <div className={styles.notice} role="alert"><p>{error}</p><button onClick={() => setRecarga(n => n + 1)}>Reintentar consulta</button></div> : caso && <>
      {vista === 'resumen' && <>
        <p className={styles.notice}><strong>Abrir este enlace no genera una multa.</strong> Revisa la información de la denuncia y decide cómo continuar.</p>
        {!puedeAceptar && <p className={styles.notice}>{consulta?.estadoEnlace === 'VENCIDO' || consulta?.estadoEnlace === 'REVOCADO' ? 'El enlace de aceptación venció o fue revocado.' : `Este caso (${consulta?.estadoCaso || plantilla?.caso.estado}) ya no admite aceptación desde este enlace.`}</p>}
        <div className={styles.layout}><DenunciaDetalleCard denuncia={caso} /><DenunciaDetalleAcciones puedeAceptar={puedeAceptar} puedeDefender={!!plantilla} onAceptarPago={() => { requestId.current ||= crearRequestId(); setVista('confirmacion'); }} onPresentarDefensa={() => router.push(`/tramite-reporte/${encodeURIComponent(codigoCaso)}/defensa${window.location.hash}`)} /></div>
        {avisoDefensa && <p className={styles.error}>No se pudo habilitar la plantilla de defensa: {avisoDefensa}</p>}
        {caso.evidenceError && <button onClick={() => setRecarga(n => n + 1)}>Reintentar consulta de evidencias</button>}
      </>}
      {vista === 'confirmacion' && <div className={styles.confirmContainer}><DenunciaDetalleConfirmacion denuncia={caso} onConfirmar={confirmar} onVolver={() => setVista('resumen')} /></div>}
      {vista === 'procesando' && <div className={styles.confirmContainer}><DenunciaConfirmacionCarga /></div>}
      {(vista === 'resultado' || vista === 'error') && <div className={styles.confirmContainer}><DenunciaConfirmacionResultado status={vista === 'error' ? 'error' : 'success'} denuncia={caso} numeroRemision={resultado ? `${resultado.remision.ciudad}-${resultado.remision.serie}-${resultado.remision.numero}` : ''} pagoDisponible={!!urlPagoSeguro(resultado?.pago || null)} yaAceptada={!!resultado?.reutilizada} errorMessage={error || undefined} onContinuar={() => { const url = urlPagoSeguro(resultado?.pago || null); if (url) window.location.assign(url); }} onReintentar={vista === 'error' ? confirmar : () => setRecarga(n => n + 1)} onVolver={() => setVista('resumen')} /></div>}
    </>}
  </main>;
}
