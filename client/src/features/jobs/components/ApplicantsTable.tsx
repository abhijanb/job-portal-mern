import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import type { Application } from "../../../shared/types";
import { format } from "date-fns";
import StatusSelect from "./StatusSelect";

interface Props {
  paginated: Application[];
  jobId: string | undefined;
  handleStatusChange: (appId: string, status: string) => void;
  safePage: number;
  totalPages: number;
  setPage: (p: number) => void;
  filtered: Application[];
  limit: number;
}

export default function ApplicantsTable({
  paginated, jobId, handleStatusChange,
  safePage, totalPages, setPage,
  filtered, limit,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Applicant</th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date Applied</th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-on-surface-variant">No applications found.</td>
              </tr>
            ) : (
              paginated.map((app) => (
                <tr key={app.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-sm font-bold text-secondary shrink-0 overflow-hidden">
                        {app.user?.name ? (
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.user.name)}&background=085ac0&color=fff&size=80`}
                            alt={app.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "?"
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{app.user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-on-surface-variant">{app.user?.email ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-primary">{format(new Date(app.createdAt), "MMM d, yyyy")}</p>
                    <p className="text-xs text-outline">{format(new Date(app.createdAt), "h:mm a")}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusSelect
                      value={app.status}
                      onChange={(status) => handleStatusChange(app.id, status)}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {app.user?.email && (
                        <a
                          href={`mailto:${app.user.email}`}
                          className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-lg transition-all"
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => navigate(`/my-jobs/${jobId}/applications/${app.userId}/profile`)}
                        className="px-3 py-1.5 text-xs font-medium border border-outline-variant text-primary rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        View Profile
                      </button>
                      {app.status !== "REJECTED" && app.status !== "ACCEPTED" && (
                        <button
                          onClick={() => handleStatusChange(app.id, "SHORTLISTED")}
                          className="px-3 py-1.5 text-xs font-medium bg-secondary text-on-secondary rounded-lg hover:brightness-110 transition-all"
                        >
                          Advance
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated.length > 0 && filtered.length > limit && (
        <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant flex justify-center">
          <button
            onClick={() => setPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="text-sm font-medium text-secondary hover:underline disabled:text-on-surface-variant disabled:no-underline"
          >
            Load More Applicants ({filtered.length - safePage * limit} left)
          </button>
        </div>
      )}
    </div>
  );
}
