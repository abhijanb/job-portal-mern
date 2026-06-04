import { Link } from "react-router-dom";
import { MapPin, DollarSign, Clock, Heart } from "lucide-react";
import type { Job } from "../../../shared/types";
import { formatSalary, timeAgo } from "../../../shared/utils/format";
import { useSavedJobs } from "../../jobs/hooks/useSavedJobs";

interface JobListItemProps {
  job: Job;
}

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  INTERNSHIP: "Internship",
};

export default function JobListItem({ job }: JobListItemProps) {
  const skills = job.skills ?? [];
  const { saved: isSaved, toggleSave } = useSavedJobs(job);

  return (
    <article className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant shrink-0 overflow-hidden">
          {job.company?.logo ? (
            <img
              alt={`${job.company.name} logo`}
              className="w-12 h-12"
              src={job.company.logo}
            />
          ) : (
            <span className="text-xl font-bold text-secondary">
              {job.company?.name?.charAt(0) ?? "C"}
            </span>
          )}
        </div>
        <div className="grow space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/jobs/${job.id}`}
                className="text-xl font-bold text-on-surface group-hover:text-secondary transition-colors"
              >
                {job.title}
              </Link>
              <p className="text-base font-semibold text-on-surface-variant">
                {job.company?.name ?? "Unknown Company"}
              </p>
            </div>
            <button
              onClick={toggleSave}
              className={`transition-colors shrink-0 ${isSaved ? "text-error" : "text-on-surface-variant hover:text-error"}`}
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 py-2">
            <span className="flex items-center gap-1 text-sm text-on-surface-variant">
              <MapPin size={16} />
              {job.location ?? "Remote"}
            </span>
            <span className="flex items-center gap-1 text-sm text-on-surface-variant">
              <DollarSign size={16} />
              {formatSalary(job.salaryMin, job.salaryMax) ?? "Competitive"}
            </span>
            <span className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Clock size={16} />
              Posted {timeAgo(job.createdAt)}
            </span>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-container text-xs font-semibold rounded-md border border-outline-variant"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-container text-xs font-semibold rounded-md border border-outline-variant">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end md:items-end shrink-0">
          <span className="flex items-center gap-1 text-sm text-on-surface-variant mb-2 md:hidden">
            <Clock size={16} />
            {typeLabels[job.type] ?? job.type}
          </span>
          <Link
            to={`/jobs/${job.id}`}
            className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all inline-block text-center"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </article>
  );
}
