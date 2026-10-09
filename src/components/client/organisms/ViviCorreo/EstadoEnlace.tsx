import Link from 'next/link';
import styles from './EstadoEnlace.module.scss';

export default function EstadoEnlace({ tipo, numeroRemision, placa, pagoUrl, onConsultar, cargando = false }: {
  tipo: 'aceptado' | 'vencido' | 'revocado' | 'defensa' | 'juzgado';
  numeroRemision?: string;
  placa?: string;
  pagoUrl?: string | null;
  onConsultar?: () => void;
  cargando?: boolean;
}) {
  const aceptado = tipo === 'aceptado';
  const titulo = aceptado ? 'Esta denuncia ya fue aceptada' : tipo === 'defensa'
    ? 'Esta denuncia tiene una defensa registrada' : tipo === 'juzgado'
      ? 'Esta denuncia se encuentra en el juzgado' : tipo === 'vencido'
      ? 'Este enlace ha vencido' : 'Este enlace ya no está disponible';
  const descripcion = aceptado
    ? pagoUrl ? 'Ya existe una remisión para esta denuncia. Puedes continuar al portal institucional para pagarla.'
      : 'Ya existe una remisión para esta denuncia. Guarda el número; el cobro está en preparación.'
    : tipo === 'defensa' || tipo === 'juzgado' ? 'Por ahora no se puede aceptar y pagar desde este enlace.'
      : 'Este enlace ya no permite aceptar la denuncia ni descargar la plantilla de defensa.';
  return <div className={styles.container}>
    <article className={styles.card}>
      <div className={styles.icon} aria-hidden="true">{aceptado || tipo === 'defensa' || tipo === 'juzgado' ? 'i' : '!'}</div>
      <h2 className={styles.title}>{titulo}</h2>
      <p className={styles.description}>{descripcion}</p>
      {aceptado && <div className={styles.details}>
        <div><span className={styles.label}>Número de remisión</span><strong className={styles.value}>{numeroRemision || 'No disponible'}</strong></div>
        <div><span className={styles.label}>Placa</span><strong className={styles.value}>{placa || 'No disponible'}</strong></div>
      </div>}
      <div className={styles.actions}>
        {aceptado && (pagoUrl ? <a className={styles.primary} href={pagoUrl} rel="noreferrer">Continuar al portal institucional</a>
          : <button className={styles.primary} onClick={onConsultar} disabled={cargando || !onConsultar}>{cargando ? 'Consultando…' : 'Consultar disponibilidad de pago'}</button>)}
        <a className={aceptado ? styles.secondary : styles.primary} href="https://especiales.muniguate.com/remisiones.htm" rel="noreferrer">Consultar remisiones</a>
        {!aceptado && <Link className={styles.secondary} href="/">Ir al inicio</Link>}
      </div>
    </article>
  </div>;
}
