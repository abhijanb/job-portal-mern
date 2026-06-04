import { Link, useNavigate } from "react-router-dom";
import type { Application } from "../../../shared/types";

interface Props {
  recentApps: Application[];
}

export default function TalentPipelineSection({ recentApps }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
      <h3 className="text-xl font-bold text-primary mb-6">Talent Pipeline</h3>
      <div className="space-y-4">
        {recentApps.length > 0 ? (
          recentApps.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/my-jobs/${app.jobId}/applications`)}
              className="flex items-center justify-between p-4 border border-outline-variant/30 rounded-lg hover:border-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {app.user?.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="font-semibold text-primary">{app.user?.name ?? "Unknown"}</p>
                  <p className="text-xs text-on-surface-variant">for {app.job?.title ?? "Unknown"}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  app.status === "SHORTLISTED" || app.status === "ACCEPTED"
                    ? "text-secondary bg-secondary-container/20"
                    : app.status === "REJECTED"
                    ? "text-error bg-error-container"
                    : "text-on-surface-variant bg-surface-variant"
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-on-surface-variant">No candidates yet.</p>
        )}
      </div>
      <Link to="/my-jobs" className="block w-full mt-4 py-2 text-secondary text-sm font-medium hover:underline text-center">
        View all candidates
      </Link>
    </div>
  );
}
