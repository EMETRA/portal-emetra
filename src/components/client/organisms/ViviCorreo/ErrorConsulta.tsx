import Link from 'next/link';
import styles from './EstadoEnlace.module.scss';

export default function ErrorConsulta({ mensaje, referencia, onReintentar }: {
  mensaje: string;
  referencia?: string;
  onReintentar: () => void;
}) {
  return <div className={styles.container}>
    <article className={styles.card} role="alert">
      <div className={styles.icon} aria-hidden="true">!</div>
      <h2 className={styles.title}>No pudimos consultar la denuncia</h2>
      <p className={styles.description}>{mensaje}</p>
      {referencia && <p className={styles.reference}>Referencia de atención: <span>{referencia}</span></p>}
      <div className={styles.actions}>
        <button className={styles.primary} onClick={onReintentar}>Reintentar consulta</button>
        <Link className={styles.secondary} href="/">Ir al inicio</Link>
      </div>
    </article>
  </div>;
}
