import { Link } from "react-router-dom";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import type { Application } from "../../../shared/types";
import { timeAgo } from "../../../shared/utils/format";

const statusStyles: Record<string, string> = {
  SHORTLISTED: "bg-green-100 text-green-800",
  REVIEWING: "bg-orange-100 text-orange-800",
  APPLIED: "bg-surface-container-high text-on-surface-variant",
  REJECTED: "bg-red-100 text-red-800",
  ACCEPTED: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  SHORTLISTED: "Shortlisted",
  REVIEWING: "Reviewing",
  APPLIED: "Applied",
  PENDING: "Pending",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

interface ApplicationsListProps {
  applications: Application[];
}

export default function ApplicationsList({ applications }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant">
        <p className="text-on-surface-variant mb-4">No applications yet.</p>
        <Link
          to="/jobs"
          className="inline-block bg-secondary text-on-secondary px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <>
      {applications.map((app) => {
        const statusKey = app.status.toUpperCase();
        const statusClass = statusStyles[statusKey] ?? "bg-surface-container-high text-on-surface-variant";
        return (
          <Link
            key={app.id}
            to={`/jobs/${app.jobId}`}
            className="block bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <Briefcase className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {app.job?.title ?? "Unknown Position"}
                  </h4>
                  <p className="text-base text-on-surface-variant">{app.job?.company?.name ?? "Unknown Company"}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                {statusLabels[statusKey] ?? app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant flex flex-wrap gap-6 items-center text-on-surface-variant">
              {app.job?.location && (
                <span className="flex items-center gap-1 text-xs font-medium">
                  <MapPin size={14} /> {app.job.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-medium">
                <Calendar size={14} /> Applied {timeAgo(app.createdAt)}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  );
}
