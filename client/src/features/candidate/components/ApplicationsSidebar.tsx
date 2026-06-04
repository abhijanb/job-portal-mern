import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function getStatusBadgeColors(status: string) {
  const s = status.toLowerCase();
  if (s === "shortlisted" || s === "accepted") return "bg-secondary-container/20 text-on-secondary-container";
  if (s === "pending" || s === "reviewing") return "bg-surface-variant text-on-surface-variant";
  if (s === "closed" || s === "rejected" || s === "declined") return "bg-error-container text-on-error-container";
  return "bg-surface-variant text-on-surface-variant";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  return "1 year+ ago";
}

interface Application {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  job?: { title?: string; company?: { name?: string } };
}

interface Props {
  applications: Application[] | undefined;
  isLoading: boolean;
  error: unknown;
}

export default function ApplicationsSidebar({ applications, isLoading, error }: Props) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-secondary">
      <h2 className="text-xl font-semibold text-on-surface mb-4">My Applications</h2>
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <p className="text-error text-sm">Failed to load applications.</p>
        ) : applications && applications.length > 0 ? (
          applications.map((app) => (
            <Link key={app.id} to={`/jobs/${app.jobId}`} className="p-3 bg-surface rounded-lg border border-outline-variant/30 hover:border-secondary/50 transition-colors group block">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-on-surface group-hover:text-secondary transition-colors">
                  {app.job?.title ?? "Unknown Job"}
                </h4>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getStatusBadgeColors(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{app.job?.company?.name ?? "Unknown Company"}</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">Applied {formatDate(app.createdAt)}</p>
            </Link>
          ))
        ) : (
          <p className="text-on-surface-variant text-sm italic">No applications yet.</p>
        )}
      </div>
      <Link to="/applications" className="w-full mt-4 text-secondary text-sm font-medium hover:underline flex items-center justify-center gap-2">
        View All Applications <ArrowRight size={14} />
      </Link>
    </section>
  );
}
