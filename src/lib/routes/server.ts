import "server-only";

import { BackendError, backendFetch } from "@/lib/backend/client";
import type { Route } from "@/components/templates/MapView/MapView";

type RoutesListResponse = {
  items: Route[];
};

export async function fetchRoutesServer(): Promise<Route[]> {
  try {
    const data = await backendFetch<RoutesListResponse>("/routes", {
      next: { revalidate: 180 },
    });
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function fetchRouteByIdServer(id: string): Promise<Route | null> {
  try {
    return await backendFetch<Route>(`/routes/${id}`, {
      next: { revalidate: 180 },
    });
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
