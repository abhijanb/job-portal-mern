import { Briefcase, Users } from "lucide-react";
import type { JobStats } from "../api/jobApi";
import type { Job } from "../../../shared/types";

interface Props {
  stats: JobStats | undefined;
  jobs: Job[] | undefined;
}

export default function JobStatsCards({ stats, jobs }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform">
        <div className="bg-secondary/10 p-2 rounded-lg mb-3 w-fit">
          <Briefcase className="text-secondary" size={24} />
        </div>
        <div className="text-3xl font-bold text-primary">
          {stats?.activeJobs ??
            (jobs ?? []).filter((j) => j.status === "ACTIVE").length}
        </div>
        <div className="text-sm text-on-surface-variant font-medium">
          Total Active Jobs
        </div>
      </div>
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform">
        <div className="bg-secondary/10 p-2 rounded-lg mb-3 w-fit">
          <Users className="text-secondary" size={24} />
        </div>
        <div className="text-3xl font-bold text-primary">
          {stats?.totalApplications ?? 0}
        </div>
        <div className="text-sm text-on-surface-variant font-medium">
          Total Applications
        </div>
      </div>
    </div>
  );
}
