import { Link } from "react-router-dom";
import { useGetCompanyApplicationsQuery } from "../../candidate/api/applicationApi";
import { useUpdateApplicationStatusMutation } from "../../candidate/api/applicationApi";
import toast from "react-hot-toast";
import { useState } from "react";

export default function RecentApplicants() {
  const { data: applications, isLoading } = useGetCompanyApplicationsQuery();
  const [updateStatus] = useUpdateApplicationStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const recent = (applications ?? []).slice(0, 5);

  const getStatusLabel = (status?: string) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getApplicationStatus = (status?: string) => status ?? "PENDING";

  const getPrimaryAction = (status: string) => {
    if (status === "SHORTLISTED") {
      return {
        label: "Accept",
        status: "ACCEPTED" as const,
        toastMessage: "Applicant accepted",
      };
    }

    if (status === "ACCEPTED") {
      return null;
    }

    return {
      label: "Shortlist",
      status: "SHORTLISTED" as const,
      toastMessage: "Applicant shortlisted",
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Recent Applicants</h2>
        <Link
          to="/my-jobs"
          className="text-sm font-bold text-secondary hover:underline"
        >
          See All
        </Link>
      </div>
      {isLoading ? (
        <p className="text-on-surface-variant text-sm">Loading...</p>
      ) : recent.length === 0 ? (
        <p className="text-on-surface-variant text-sm">No applications yet.</p>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="divide-y divide-outline-variant">
            {recent.map((app) => (
              <div
                key={app.id}
                className="p-6 hover:bg-surface-container-low transition-colors group"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {app.user?.name?.charAt(0) ?? "?"}
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-sm font-bold text-primary truncate">
                        {app.user?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs font-medium text-on-surface-variant truncate">
                        for {app.job?.title ?? "Unknown Position"}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-container-high px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {getStatusLabel(getApplicationStatus(app.status))}
                  </span>
                </div>
                <div className="flex gap-3">
                  {(() => {
                    const applicationStatus = getApplicationStatus(app.status);
                    const primaryAction = getPrimaryAction(applicationStatus);

                    return primaryAction ? (
                      <button
                        onClick={async () => {
                          setUpdatingId(app.id);
                          try {
                            await updateStatus({
                              id: app.id,
                              status: primaryAction.status,
                            }).unwrap();
                            toast.success(primaryAction.toastMessage);
                          } catch {
                            toast.error(
                              `Failed to ${primaryAction.label.toLowerCase()} applicant`,
                            );
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                        className="flex-1 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                        disabled={updatingId === app.id}
                      >
                        {updatingId === app.id
                          ? "Updating..."
                          : primaryAction.label}
                      </button>
                    ) : (
                      <button
                        className="flex-1 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold cursor-not-allowed"
                        disabled
                      >
                        Accepted
                      </button>
                    );
                  })()}
                  <button
                    onClick={async () => {
                      setUpdatingId(app.id);
                      try {
                        await updateStatus({
                          id: app.id,
                          status: "REJECTED",
                        }).unwrap();
                        toast.success("Applicant rejected");
                      } catch {
                        toast.error("Failed to reject applicant");
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                    className="px-4 py-1.5 border border-outline text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container transition-colors"
                    disabled={updatingId === app.id}
                  >
                    {updatingId === app.id ? "Updating..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/my-jobs"
            className="w-full py-4 text-on-surface-variant text-sm font-bold hover:text-primary border-t border-outline-variant transition-colors block text-center"
          >
            View full list
          </Link>
        </div>
      )}
    </div>
  );
}
