import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBootstrapStatus } from "../lib/api";

export default function BootstrapGate() {
  const location = useLocation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: getBootstrapStatus,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading setup status...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-sm text-red-600">
        Failed to load setup status: {error.message}
      </div>
    );
  }

  const pathname = location.pathname;
  const isLandingRoute = pathname === "/landing";
  const isOnboardingRoute = pathname === "/onboarding";

  if (!data?.isOnboarded && !isOnboardingRoute && !isLandingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  if (data?.isOnboarded && isOnboardingRoute) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
