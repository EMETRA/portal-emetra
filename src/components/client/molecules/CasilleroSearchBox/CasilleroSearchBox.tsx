"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/server/atoms";
import styles from "./CasilleroSearchBox.module.scss";

interface SearchSuggestion {
  label: string;
  href: string;
}

const KEYWORD_MAP: { keywords: string[]; suggestion: SearchSuggestion }[] = [
  {
    keywords: ["carro", "carros", "placa", "placas", "asociar", "desasociar"],
    suggestion: { label: "Listado de placas", href: "/casillero/dashboard/placas" },
  },
  {
    keywords: ["multa", "multas", "remisión", "remision", "remisiones", "pagar"],
    suggestion: { label: "Listado de multas", href: "/casillero/dashboard/multas" },
  },
  {
    keywords: ["recibo", "recibos", "solvencia", "historial"],
    suggestion: { label: "Historial de remisiones", href: "/casillero/dashboard/historial" },
  },
  {
    keywords: ["buzón", "buzon", "mensajes", "notificaciones"],
    suggestion: { label: "Buzón", href: "/casillero/buzon" },
  },
];

function getSuggestions(query: string): SearchSuggestion[] {
  if (!query.trim()) return [];

  const words = query.toLowerCase().split(/\s+/);
  const matched: SearchSuggestion[] = [];

  KEYWORD_MAP.forEach(({ keywords, suggestion }) => {
    const hits = words.some((word) =>
      keywords.some((kw) => kw.includes(word) || word.includes(kw))
    );
    if (hits && !matched.find((s) => s.href === suggestion.href)) {
      matched.push(suggestion);
    }
  });

  return matched;
}

export default function CasilleroSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getSuggestions(query);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleSelect = (href: string) => {
    setQuery("");
    setOpen(false);
    router.push(href);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className={styles.search}>
      <input
        ref={inputRef}
        type="search"
        placeholder="Buscar"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        autoComplete="off"
      />
      <Icon name="Search" />

      {open && suggestions.length > 0 && (
        <ul className={styles.dropdown}>
          {suggestions.map((s) => (
            <li key={s.href}>
              <button
                type="button"
                className={styles.suggestion}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s.href)}
              >
                <Icon name="Search" />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}