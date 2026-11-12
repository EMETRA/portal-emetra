"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Evial.module.scss";
export default function EvialScanner({
  onRead,
  onClose,
}: {
  onRead: (value: string) => void;
  onClose: () => void;
}) {
  const callback = useRef(onRead),
    [error, setError] = useState("");
  callback.current = onRead;
  useEffect(() => {
    let disposed = false;
    let scanner: import("html5-qrcode").Html5Qrcode | undefined;
    let detected = false;
    const start = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (disposed) return;
        scanner = new Html5Qrcode("evial-qr-camera", { verbose: false });
        await scanner.start(
          { facingMode: "environment" },
          { fps: 6, qrbox: { width: 220, height: 220 } },
          (value) => {
            if (!detected && !disposed) {
              detected = true;
              callback.current(value);
            }
          },
          () => {},
        );
        if (disposed && scanner.isScanning) await scanner.stop();
      } catch {
        if (!disposed)
          setError(
            "No se pudo abrir la cámara. Revisa sus permisos o utiliza el código del comprobante.",
          );
      }
    };
    void start();
    return () => {
      disposed = true;
      if (scanner?.isScanning) void scanner.stop().catch(() => {});
    };
  }, []);
  return (
    <div className={styles.scanner}>
      <div id="evial-qr-camera" />
      {error && <p role="alert">{error}</p>}
      <button className={styles.secondary} onClick={onClose}>
        Cerrar cámara
      </button>
    </div>
  );
}
