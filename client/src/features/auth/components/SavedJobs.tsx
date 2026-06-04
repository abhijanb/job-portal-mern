import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useGetSavedJobsQuery } from "../../candidate/api/savedJobApi";

export default function SavedJobs() {
  const { data: savedJobs, isLoading } = useGetSavedJobsQuery();

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant">
      <h3 className="text-xl font-bold text-primary mb-4">Saved Jobs</h3>
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-on-surface-variant">Loading...</p>
        ) : !savedJobs || savedJobs.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No saved jobs.</p>
        ) : (
          savedJobs.slice(0, 5).map((sj) => (
            <Link
              key={sj.id}
              to={`/jobs/${sj.jobId}`}
              className="flex gap-4 items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded bg-surface-container shrink-0" />
              <div className="grow min-w-0">
                <p className="text-sm font-bold text-primary truncate">{sj.job.title}</p>
                <p className="text-xs font-medium text-on-surface-variant">{sj.job.company?.name ?? ""}</p>
              </div>
              <Bookmark className="text-on-surface-variant group-hover:text-secondary transition-colors shrink-0" size={20} />
            </Link>
          ))
        )}
      </div>
      <Link to="/saved-jobs" className="w-full mt-4 py-2 text-sm font-bold text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-colors inline-block text-center">
        See all saved
      </Link>
    </div>
  );
}
