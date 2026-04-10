'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';

export default function EnviarResolucionPage() {
  const params = useParams<{ juzgado: string }>();
  const juzgado = decodeURIComponent(params?.juzgado ?? '');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');

  return (
    <main className={styles.wrap}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Enviar resolución</h1>
        <p className={styles.subtitle}>
          Juzgado: <strong>{juzgado || '—'}</strong>
        </p>
      </section>

      <section className={styles.card}>
        {/* Solo diseño, sin envío */}
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label} htmlFor="file">
            Selecciona el expediente
          </label>

          <div className={styles.fileRow}>
            <input
              ref={inputRef}
              id="file"
              name="file"
              type="file"
              accept=".pdf,.zip"
              className={styles.fileInput}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f ? `${f.name} · ${(f.size / 1024).toFixed(1)} KB` : '');
              }}
            />
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => {
                if (inputRef.current) inputRef.current.value = '';
                setFileName('');
              }}
            >
              Limpiar
            </button>
          </div>

          {fileName && <p className={styles.fileMeta}>{fileName}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.primaryBtn}>
              Enviar (deshabilitado)
            </button>
          </div>

          <p className={styles.smallNote}>
            Formatos permitidos: <strong>PDF</strong> o <strong>ZIP</strong>.
          </p>
        </form>
      </section>
    </main>
  );
}
