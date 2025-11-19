"use client";

import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { MapView } from "@/components/templates/MapView";
import { useRoutes } from "@/data/remote/route/useRoutes";

const Page: React.FC = () => {
  const { routes, loading, error } = useRoutes();
  if (loading) return <LoadingSpinner variant="page-wide" />;

  return (
    <>
      <MapView routes={error ? [] : routes} />
    </>
  );
};

export default Page;
