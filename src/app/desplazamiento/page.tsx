"use client";

import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { MapView } from "@/components/templates/MapView";
import { useRoutes } from "@/data/remote/route/useRoutes";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";

const Page: React.FC = () => {
  const { routes, loading, error } = useRoutes();

  if (loading) {
    return <LoadingSpinner variant="page-wide" />;
  }

  if (error) {
    return (
      <ServiceErrorAlert
        title="No se pudieron cargar las rutas"
        message={error}
      />
    );
  }

  return <MapView routes={routes} />;
};

export default Page;
