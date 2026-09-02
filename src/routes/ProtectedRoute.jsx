import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const hasHydrated = useAuthStore(
    (state) => state.hasHydrated
  );

  const location = useLocation();

  // Wait until Zustand has restored persisted state
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-sm text-slate-500">
          Restoring session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;