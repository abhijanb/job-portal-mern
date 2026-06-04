import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGetJobsByCompanyQuery } from "../../jobs/api/jobApi";
import { formatSalary } from "../../../shared/utils/format";

export default function ActiveListings() {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const { data: jobs, isLoading } = useGetJobsByCompanyQuery(companyId ?? "", { skip: !companyId });

  return (
    <div className="xl:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Active Listings</h2>
        <Link to="/my-jobs" className="text-sm font-bold text-secondary hover:underline">View All</Link>
      </div>
      {isLoading ? (
        <p className="text-on-surface-variant text-sm">Loading...</p>
      ) : !jobs || jobs.length === 0 ? (
        <p className="text-on-surface-variant text-sm">No jobs yet. Post your first job!</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  <Building2 className="text-secondary" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary">{job.title}</h4>
                  <p className="text-base text-on-surface-variant">{job.location ?? "Remote"} &bull; {formatSalary(job.salaryMin, job.salaryMax) ?? "Competitive"}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
