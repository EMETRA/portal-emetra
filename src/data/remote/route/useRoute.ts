import { useEffect, useState } from "react";
import type { Route } from "@/components/templates/MapView/MapView";
import { fetchBffJson } from "@/lib/bff/client";

export function useRoute(id?: string | number) {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await fetchBffJson<Route>(`/api/routes/${id}`);
        setRoute(data);
      } catch (err) {
        const loadError = err as Error;
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return { route, loading, error };
}
