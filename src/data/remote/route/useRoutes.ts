import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import type { Route } from "@/components/templates/MapView/MapView";

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get("/routes");
        setRoutes(response.data.items);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { routes, loading, error };
}
