"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/server/atoms";
import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import type { NeoPayCheckout } from "@/lib/casillero/paymentOrders";
import styles from "./EstadoOrdenPagoPage.module.scss";

export default function NeoPayThreeDsFrame({ action, continuing, onComplete }: {
  action: NonNullable<NeoPayCheckout["nextAction"]>;
  continuing: boolean;
  onComplete: () => void;
}) {
  const rawId = useId();
  const frameName = `neopay-3ds-${rawId.replace(/[^a-z0-9]/gi, "")}`;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action.url;
    form.target = frameName;
    form.style.display = "none";
    const token = document.createElement("input");
    token.type = "hidden";
    token.name = "JWT";
    token.value = action.accessToken;
    form.appendChild(token);
    document.body.appendChild(form);
    form.submit();
    form.remove();

    if (action.kind === "DEVICE_DATA") {
      const timer = window.setTimeout(() => onCompleteRef.current(), 4000);
      return () => window.clearTimeout(timer);
    }
  }, [action, frameName]);

  if (action.kind === "DEVICE_DATA") {
    return <div className={styles.threeDsLoading}>
      <iframe title="Validación del dispositivo" name={frameName} className={styles.hiddenThreeDsFrame} />
      <LoadingSpinner variant="inline" />
      <p>Validando tu dispositivo de forma segura...</p>
    </div>;
  }

  return <div className={styles.threeDsChallenge}>
    <p>Completa la verificación de tu banco en el recuadro.</p>
    <iframe title="Verificación 3DS del banco" name={frameName} className={styles.threeDsFrame} />
    <Button variant="success" onClick={onComplete} disabled={continuing}>
      {continuing ? "Confirmando..." : "Ya completé la verificación"}
    </Button>
  </div>;
}
