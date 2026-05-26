import { useEffect, useState } from "react";
import type { Route } from "@/components/templates/MapView/MapView";
import { fetchBffJson } from "@/lib/bff/client";

type RoutesListResponse = {
  items: Route[];
};

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchBffJson<RoutesListResponse>("/api/routes");
        setRoutes(response.items ?? []);
      } catch (err) {
        const loadError = err as Error;
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { routes, loading, error };
}
