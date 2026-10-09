"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionTitle } from '@/components/server/molecules';
import { DenunciaDetalleCard } from '@/components/organisms/DenunciaDetalleCard';
import { DenunciaDetalleAcciones } from '@/components/organisms/DenunciaDetalleAcciones';
import { DenunciaDetalleConfirmacion } from '@/components/organisms/DenunciaDetalleConfirmacion';
import { DenunciaConfirmacionCarga } from '@/components/organisms/DenunciaConfirmacionCarga';
import { DenunciaConfirmacionResultado } from '@/components/organisms/DenunciaConfirmacionResultado/DenunciaConfirmacionResultado';
import ViviDefenseSent from '@/components/client/organisms/ViviDefenseSent/ViviDefenseSent';
import EstadoEnlace from './EstadoEnlace';
import ErrorConsulta from './ErrorConsulta';
import { leerEnlaceReporte, comprobarCasoReporte, type EnlaceReporte } from '@/lib/vivi/enlace-reporte';
import { aceptarDenuncia, consultarAceptacion, consultarPlantilla, crearRequestId, leerEvidencia, urlPagoSeguro, ViviApiError, type Aceptacion, type ConsultaAceptacion, type ConsultaPlantilla } from '@/lib/vivi/acciones';
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
  const [referenciaConsulta, setReferenciaConsulta] = useState<string | undefined>();
  const [avisoDefensa, setAvisoDefensa] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);
  const [cerrado, setCerrado] = useState<'vencido' | 'revocado' | 'defensa' | 'juzgado' | null>(null);
  const [comprobando, setComprobando] = useState(false);
  const requestId = useRef<string | null>(null);
  const enCurso = useRef(false);
  const aceptada = useRef(false);

  const reconsultar = useCallback(() => { setCargando(true); setRecarga(n => n + 1); }, []);
  useEffect(() => {
    const restaurar = (event: PageTransitionEvent) => {
      if (event.persisted && !enCurso.current) reconsultar();
    };
    const visible = () => {
      if (document.visibilityState === 'visible' && !enCurso.current && (vista === 'resumen' || vista === 'resultado')) reconsultar();
    };
    window.addEventListener('pageshow', restaurar);
    document.addEventListener('visibilitychange', visible);
    return () => { window.removeEventListener('pageshow', restaurar); document.removeEventListener('visibilitychange', visible); };
  }, [vista, reconsultar]);

  useEffect(() => {
    const abort = new AbortController();
    const urls: string[] = [];
    setCargando(true); setError(null); setReferenciaConsulta(undefined); setCerrado(null); setAvisoDefensa(null); setConsulta(null); setPlantilla(null); setCaso(null);
    void (async () => {
      let aceptacion: ConsultaAceptacion | null = null;
      let pdf: ConsultaPlantilla | null = null;
      let falloConsulta: unknown;
      if (enlace.aceptar) {
        try { aceptacion = await consultarAceptacion(enlace.aceptar, abort.signal); }
        catch (e) { falloConsulta = e; }
        if (aceptacion) comprobarCasoReporte(aceptacion.estadoEnlace === 'VIGENTE' ? aceptacion.denuncia.codigoCaso : aceptacion.codigoCaso, codigoCaso);
      }
      if (abort.signal.aborted) return;
      const estadoCerrado = cierreEnlace(aceptacion);
      if (estadoCerrado) { setConsulta(aceptacion); setCerrado(estadoCerrado); return; }
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
    })().catch(e => { if (!abort.signal.aborted) {
      if (e instanceof ViviApiError && e.status === 410) setCerrado(e.codigo === 'ENLACE_VENCIDO' ? 'vencido' : 'revocado');
      else {
        setError(mensajeConsulta(e));
        setReferenciaConsulta(e instanceof ViviApiError ? e.referencia : undefined);
      }
      setCaso(null);
    } }).finally(() => { if (!abort.signal.aborted) setCargando(false); });
    return () => { abort.abort(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [codigoCaso, enlace, recarga]);

  const puedeAceptar = !cargando && !comprobando && !aceptada.current && !resultado &&
    consulta?.estadoEnlace === 'VIGENTE' && consulta.puedeAceptar &&
    consulta.estadoCaso === 'NOTIFICADA' && consulta.denuncia.estado === 'NOTIFICADA' &&
    !consulta.denuncia.remision && !!enlace.aceptar;

  async function comprobarAntesDeAceptar(): Promise<boolean> {
    if (!enlace.aceptar) return false;
    const actual = await consultarAceptacion(enlace.aceptar);
    comprobarCasoReporte(actual.estadoEnlace === 'VIGENTE' ? actual.denuncia.codigoCaso : actual.codigoCaso, codigoCaso);
    setConsulta(actual);
    const cierre = cierreEnlace(actual);
    if (cierre) { setCerrado(cierre); setPlantilla(null); return false; }
    if (actual.estadoEnlace === 'USADO') {
      aceptada.current = true;
      setPlantilla(null);
      if (!actual.remision) throw new Error('La denuncia ya fue aceptada; su remisión no está disponible para consulta.');
      setResultado({ idDenuncia: actual.denuncia?.idDenuncia || '', remision: actual.remision, reutilizada: true, pago: actual.pago || { estado: 'PREPARANDO' } });
      setVista('resultado');
      return false;
    }
    if (actual.estadoEnlace !== 'VIGENTE' || !actual.puedeAceptar || actual.estadoCaso !== 'NOTIFICADA' || actual.denuncia.estado !== 'NOTIFICADA' || actual.denuncia.remision) {
      throw new Error('Este caso ya no admite aceptación desde este enlace. Vuelve a consultar su estado.');
    }
    return true;
  }

  async function abrirConfirmacion() {
    if (enCurso.current || !puedeAceptar) return;
    enCurso.current = true; setComprobando(true); setError(null);
    try {
      if (await comprobarAntesDeAceptar()) { requestId.current ||= crearRequestId(); setVista('confirmacion'); }
    } catch (e) { setError(mensaje(e)); }
    finally { enCurso.current = false; setComprobando(false); }
  }
  async function confirmar() {
    if (enCurso.current || !puedeAceptar || !enlace.aceptar) return;
    enCurso.current = true; setError(null); setVista('procesando');
    requestId.current ||= crearRequestId();
    try {
      if (!await comprobarAntesDeAceptar()) return;
      const respuesta = await aceptarDenuncia(enlace.aceptar, requestId.current);
      aceptada.current = true;
      setPlantilla(null);
      setResultado(respuesta); setVista('resultado');
    }
    catch (e) { setError(mensaje(e)); setVista('error'); }
    finally { enCurso.current = false; }
  }
  const volver = () => router.push(`/tramite-reporte/${encodeURIComponent(codigoCaso)}${window.location.hash}`);
  if (cerrado && !cargando) return <main className={styles.main}><EstadoEnlace tipo={cerrado} /></main>;
  if (!cargando && error && !caso) return <main className={styles.main}><ErrorConsulta mensaje={error} referencia={referenciaConsulta} onReintentar={reconsultar} /></main>;
  if (!cargando && !error && caso && resultado?.reutilizada && vista === 'resultado') return <main className={styles.main}><EstadoEnlace tipo="aceptado" numeroRemision={`${resultado.remision.ciudad}-${resultado.remision.serie}-${resultado.remision.numero}`} placa={caso.placa} pagoUrl={urlPagoSeguro(resultado.pago)} onConsultar={reconsultar} /></main>;
  if (defensa && plantilla && !cargando && !error) return <main className={styles.main}><ViviDefenseSent caseNumber={codigoCaso} token={enlace.refutar || undefined} onVolver={volver} /></main>;
  const titulo = vista === 'confirmacion' ? 'Confirma tu aceptación' : 'Denuncia de tránsito';
  return <main className={styles.main}>
    {(vista === 'resumen' || vista === 'confirmacion') && <SectionTitle className={styles.sectionTitle}>{titulo}</SectionTitle>}
    {cargando ? <div className={styles.layout}><DenunciaDetalleCard loading /><DenunciaDetalleAcciones loading onAceptarPago={() => {}} onPresentarDefensa={() => {}} /></div> : caso && <>
      {vista === 'resumen' && <>
        <p className={styles.notice}><strong>Abrir este enlace no genera una multa.</strong> Revisa la información de la denuncia y decide cómo continuar.</p>
        {!puedeAceptar && <p className={styles.notice}>{consulta?.estadoEnlace === 'VENCIDO' || consulta?.estadoEnlace === 'REVOCADO' ? 'El enlace de aceptación venció o fue revocado.' : `Este caso (${consulta?.estadoCaso || plantilla?.caso.estado}) ya no admite aceptación desde este enlace.`}</p>}
        <div className={styles.layout}><DenunciaDetalleCard denuncia={caso} /><DenunciaDetalleAcciones loading={comprobando} puedeAceptar={puedeAceptar} puedeDefender={!!plantilla && !aceptada.current} onAceptarPago={abrirConfirmacion} onPresentarDefensa={() => router.push(`/tramite-reporte/${encodeURIComponent(codigoCaso)}/defensa${window.location.hash}`)} /></div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {avisoDefensa && <p className={styles.error}>No se pudo habilitar la plantilla de defensa: {avisoDefensa}</p>}
        {caso.evidenceError && <button onClick={() => setRecarga(n => n + 1)}>Reintentar consulta de evidencias</button>}
      </>}
      {vista === 'confirmacion' && <div className={styles.confirmContainer}><DenunciaDetalleConfirmacion denuncia={caso} onConfirmar={confirmar} onVolver={() => setVista('resumen')} /></div>}
      {vista === 'procesando' && <div className={styles.confirmContainer}><DenunciaConfirmacionCarga /></div>}
      {(vista === 'resultado' || vista === 'error') && <div className={styles.confirmContainer}><DenunciaConfirmacionResultado status={vista === 'error' ? 'error' : 'success'} denuncia={caso} numeroRemision={resultado ? `${resultado.remision.ciudad}-${resultado.remision.serie}-${resultado.remision.numero}` : ''} pagoDisponible={!!urlPagoSeguro(resultado?.pago || null)} yaAceptada={!!resultado?.reutilizada} errorMessage={error || undefined} onContinuar={() => { const url = urlPagoSeguro(resultado?.pago || null); if (url) window.location.assign(url); }} onReintentar={vista === 'error' ? confirmar : reconsultar} onVolver={reconsultar} /></div>}
    </>}
  </main>;
}

function mensajeConsulta(error: unknown): string {
  if (error instanceof ViviApiError && error.status === 429) return 'Estamos recibiendo muchas consultas. Espera unos momentos e intenta de nuevo.';
  if (error instanceof TypeError || (error instanceof ViviApiError && error.status >= 500)) return 'El servicio no respondió correctamente. Intenta consultar de nuevo en unos momentos.';
  return mensaje(error);
}

function cierreEnlace(consulta: ConsultaAceptacion | null): 'vencido' | 'revocado' | 'defensa' | 'juzgado' | null {
  if (!consulta || consulta.estadoEnlace === 'USADO') return null;
  if (consulta.estadoCaso === 'DEFENSA_WEB') return 'defensa';
  if (consulta.estadoCaso === 'EN_JUZGADO') return 'juzgado';
  if (consulta.estadoEnlace === 'VENCIDO') return 'vencido';
  if (consulta.estadoEnlace === 'REVOCADO') return 'revocado';
  return null;
}
