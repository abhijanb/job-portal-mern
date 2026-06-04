import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

type Role = "CANDIDATE" | "COMPANY_ADMIN";

export function RoleGate({ allowedRoles, children }: { allowedRoles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!allowedRoles.includes(user.role as Role)) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;
  if (!allowedRoles.includes(user.role as Role)) return null;

  return <>{children}</>;
}
