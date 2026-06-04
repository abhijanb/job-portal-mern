import { Link } from "react-router-dom";
import { Bookmark, MapPin, DollarSign, Clock } from "lucide-react";
import { useGetSavedJobsQuery, useRemoveSavedJobMutation } from "../api/savedJobApi";
import { formatSalary, timeAgo } from "../../../shared/utils/format";
import toast from "react-hot-toast";

export default function SavedJobsPage() {
  const { data: savedJobs, isLoading } = useGetSavedJobsQuery();
  const [remove] = useRemoveSavedJobMutation();

  const handleRemove = async (jobId: string) => {
    try {
      await remove(jobId).unwrap();
      toast.success("Removed from saved jobs");
    } catch {
      toast.error("Failed to remove saved job");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-on-surface-variant">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-1">Saved Jobs</h1>
        <p className="text-base text-on-surface-variant">Jobs you've saved for later review.</p>
      </div>

      {!savedJobs || savedJobs.length === 0 ? (
        <div className="text-center py-24">
          <Bookmark className="mx-auto text-on-surface-variant mb-4" size={48} />
          <p className="text-on-surface-variant text-lg mb-4">No saved jobs yet.</p>
          <Link to="/jobs" className="text-secondary font-medium hover:underline">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((sj) => (
            <div key={sj.id} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Link to={`/jobs/${sj.jobId}`} className="flex items-center gap-4 min-w-0 group flex-1">
                <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-secondary">{sj.job.company?.name?.charAt(0) ?? "J"}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors truncate">{sj.job.title}</h3>
                  <p className="text-sm text-on-surface-variant">{sj.job.company?.name ?? "Unknown Company"}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-on-surface-variant">
                    {sj.job.location && (
                      <span className="flex items-center gap-1"><MapPin size={14} /> {sj.job.location}</span>
                    )}
                    {(sj.job.salaryMin || sj.job.salaryMax) && (
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {formatSalary(sj.job.salaryMin, sj.job.salaryMax)}</span>
                    )}
                    {sj.createdAt && (
                      <span className="flex items-center gap-1"><Clock size={14} /> Saved {timeAgo(sj.createdAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(sj.jobId)}
                className="shrink-0 px-4 py-2 text-sm font-medium text-error border border-error/20 rounded-lg hover:bg-error/5 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
