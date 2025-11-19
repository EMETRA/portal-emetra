import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

export function useRoute(id?: string | number) {
  const [route, setRoute] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const response = await api.get(`/routes/${id}`);
        setRoute(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return { route, loading, error };
}
