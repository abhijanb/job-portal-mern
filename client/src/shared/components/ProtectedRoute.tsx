import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppSelector((s) => s.auth);
  if (loading) return <p className="text-center py-8 text-on-surface-variant">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
