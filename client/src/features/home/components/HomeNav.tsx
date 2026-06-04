import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { LayoutDashboard, Briefcase, LogOut, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

export default function HomeNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isCandidate, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="text-xl font-bold text-primary"
          >
            Hire
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary text-sm font-medium transition-colors"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {isCandidate && (
                  <Link
                    to="/jobs"
                    className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary text-sm font-medium transition-colors"
                  >
                    <Briefcase size={16} /> Jobs
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/jobs"
                className="text-secondary font-bold text-sm border-b-2 border-secondary py-1"
              >
                Browse Jobs
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-on-surface-variant">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-secondary transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-on-surface-variant hover:text-secondary text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-secondary text-on-secondary text-sm font-medium px-6 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Post a Job
              </Link>
            </>
          )}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isCandidate && (
                <Link
                  to="/jobs"
                  className="block text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block text-sm text-on-surface-variant"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/jobs"
                className="block text-secondary font-bold text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Jobs
              </Link>
              <Link
                to="/login"
                className="block text-on-surface-variant text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
