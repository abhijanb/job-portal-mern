import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import JobCard from "./JobCard";
import { useGetJobsQuery } from "../../jobs/api/jobApi";
import { formatSalary, timeAgo } from "../../../shared/utils/format";
import type { Job } from "../../../shared/types";

export default function FeaturedJobs() {
  const [limit, setLimit] = useState(6);
  const { data: result, isLoading } = useGetJobsQuery({ page: 1, limit });
  const jobs = result?.data;
  const total = result?.pagination?.total ?? 0;

  const featured = (jobs ?? []).map((job: Job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.name ?? "Unknown Company",
    location: job.location ?? "Remote",
    salary: formatSalary(job.salaryMin, job.salaryMax) ?? "Competitive",
    type: job.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    posted: timeAgo(job.createdAt),
    badge: job.status === "ACTIVE" ? "Active" : null,
    badgeColor: "bg-green-100 text-green-700",
  }));

  const hasMore = jobs ? jobs.length < total : false;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary">Featured Opportunities</h2>
          <p className="text-base text-on-surface-variant">Top-rated positions recommended for your profile</p>
        </div>
        <Link to="/jobs" className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline">
          View all {total} jobs
          <ArrowRight size={18} />
        </Link>
      </div>
      {isLoading ? (
        <p className="text-on-surface-variant text-center py-12">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setLimit((l) => l + 6)}
            className="flex items-center gap-2 bg-white border border-outline-variant px-8 py-3 rounded-lg text-primary font-bold text-sm hover:bg-surface-container-low transition-all"
          >
            Load More Jobs
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
