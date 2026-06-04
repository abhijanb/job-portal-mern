import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Plus,
  LogOut,
  Menu,
  X,
  FileText,
  Building2,
  User,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../features/auth/hooks/useAuth";

const sidebarLinks = {
  common: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ],
  candidate: [
    { to: "/applications", label: "My Applications", icon: FileText },
    { to: "/profile", label: "Profile", icon: User },
  ],
  company: [
    { to: "/my-jobs", label: "My Jobs", icon: Briefcase },
    { to: "/company", label: "Company", icon: Building2 },
    { to: "/jobs/create", label: "Create Job", icon: Plus },
  ],
  bottom: [],
};

export default function Layout() {
  const { user, isCandidate, isCompanyAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/?title=${encodeURIComponent(q)}`);
  };

  const isActive = (path: string) => {
    if (path === "#") return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navItems = [
    ...sidebarLinks.common,
    ...(isCandidate ? sidebarLinks.candidate : []),
    ...(isCompanyAdmin ? sidebarLinks.company : []),
  ];

  const linkClass = (to: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(to)
        ? "bg-secondary text-on-secondary"
        : "text-on-surface-variant hover:bg-surface-container-high"
    }`;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="text-xl font-bold text-primary">Hire</Link>
          </div>
          {isCandidate && (
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:border-secondary transition-colors"
              />
            </div>
          </form>
          )}
          <div className="flex items-center gap-4">
            {isCompanyAdmin && (
              <Link
                to="/jobs/create"
                className="hidden sm:block bg-secondary text-on-secondary text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-all"
              >
                Post a Job
              </Link>
            )}
            {isCandidate && (
              <Link to="/jobs" className="hidden sm:block text-sm text-on-surface-variant hover:text-secondary transition-colors">
                Browse Jobs
              </Link>
            )}
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          </div>
        </div>
      </header>

      <div className="flex grow max-w-6xl mx-auto w-full">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-64px)] w-64 bg-surface border-r border-outline-variant py-6 px-3 transition-transform duration-200 flex flex-col`}
        >
          <div className="mb-6 px-3">
            <p className="text-sm font-bold text-primary">Menu</p>
          </div>

          <nav className="space-y-1 grow">
            {navItems.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={linkClass(link.to)}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-1 pt-4 border-t border-outline-variant">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors w-full"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
