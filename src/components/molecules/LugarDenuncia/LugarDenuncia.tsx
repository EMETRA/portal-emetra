import { urlUbicacion } from '@/lib/vivi/presentacion';
import styles from './LugarDenuncia.module.scss';

export default function LugarDenuncia({ lugar, latitud, longitud }: {
  lugar: string;
  latitud?: number | null;
  longitud?: number | null;
}) {
  const url = urlUbicacion(latitud, longitud);
  return <span className={styles.location}>
    <span>{lugar}</span>
    {url && <a className={styles.link} href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
      Ver ubicación en OpenStreetMap
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
      </svg>
    </a>}
  </span>;
}
