import { useGetMyApplicationsQuery } from "../api/applicationApi";
import { Clock } from "lucide-react";
import type { Application } from "../../../shared/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-blue-100 text-blue-800",
  SHORTLISTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ACCEPTED: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useGetMyApplicationsQuery();

  if (isLoading) return <p className="text-center py-8 text-on-surface-variant">Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      {!applications?.length ? (
        <p className="text-center py-8 text-on-surface-variant">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app: Application) => (
            <div key={app.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{app.job?.title}</h3>
                  <p className="text-sm text-on-surface-variant">{app.job?.company?.name}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status] || "bg-surface-container"}`}>
                  {statusLabels[app.status] || app.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><Clock size={12} /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                {app.job?.location && <span>{app.job.location}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
