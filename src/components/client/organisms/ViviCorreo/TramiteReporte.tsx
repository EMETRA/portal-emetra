"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/server/atoms';
import { leerEnlaceReporte, type EnlaceReporte, type AccionReporte } from '@/lib/vivi/enlace-reporte';
import ViviCorreo from './ViviCorreo';
import styles from './ViviCorreo.module.scss';

export default function TramiteReporte({ codigoCaso }: { codigoCaso: string }) {
  const [enlace, setEnlace] = useState<EnlaceReporte | null>(null);
  const [listo, setListo] = useState(false);
  const [accion, setAccion] = useState<AccionReporte>('aceptar');
  useEffect(() => {
    const leer = () => { const datos = leerEnlaceReporte(window.location.hash); setEnlace(datos); if (datos) setAccion(datos.accion); setListo(true); };
    leer(); window.addEventListener('hashchange', leer);
    return () => window.removeEventListener('hashchange', leer);
  }, []);
  if (!listo) return <main className={styles.main}><p role="status">Abriendo el reporte…</p></main>;
  if (!enlace) return <main className={styles.main}><section className={styles.card}><h1>Trámite de reporte</h1><p>Para consultar el reporte {codigoCaso}, aceptar o descargar la plantilla de defensa, abre el enlace del correo recibido.</p><p>El número de caso necesita el enlace privado correspondiente.</p></section></main>;
  const token = accion === 'aceptar' ? enlace.aceptar : enlace.refutar;
  return <>
    <nav aria-label="Opciones del reporte" className={styles.actions}>
      {enlace.aceptar && <Button variant={accion === 'aceptar' ? 'default' : 'outline'} onClick={() => setAccion('aceptar')}>Aceptar reporte</Button>}
      {enlace.refutar && <Button variant={accion === 'refutar' ? 'default' : 'outline'} onClick={() => setAccion('refutar')}>Refutar / descargar plantilla</Button>}
    </nav>
    {token && <ViviCorreo key={accion + token} token={token} accion={accion} codigoCasoEsperado={codigoCaso} />}
  </>;
}
