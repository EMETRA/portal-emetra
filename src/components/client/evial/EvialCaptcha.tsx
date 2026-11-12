"use client";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
type Widget = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
export default function EvialCaptcha({
  siteKey,
  onToken,
  version,
}: {
  siteKey: string;
  onToken: (value: string) => void;
  version: number;
}) {
  const container = useRef<HTMLDivElement>(null),
    [ready, setReady] = useState(false),
    callback = useRef(onToken);
  callback.current = onToken;
  const loaded = useCallback(() => setReady(true), []);
  useEffect(() => {
    const widget = (window as Window & { turnstile?: Widget }).turnstile;
    if (!ready || !widget || !container.current) return;
    const id = widget.render(container.current, {
      sitekey: siteKey,
      callback: (token: string) => callback.current(token),
      "expired-callback": () => callback.current(""),
      "error-callback": () => callback.current(""),
      theme: "light",
    });
    return () => {
      widget.remove(id);
    };
  }, [ready, siteKey, version]);
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={loaded}
      />
      <div ref={container} aria-label="Verificación de seguridad" />
    </>
  );
}
