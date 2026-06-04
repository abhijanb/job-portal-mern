import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  useGetJobStatsQuery,
  useGetJobsByCompanyQuery,
} from "../../jobs/api/jobApi";
import { useGetCompanyApplicationsQuery } from "../../candidate/api/applicationApi";
import MetricsGrid from "./MetricsGrid";
import JobPostingsTable from "./JobPostingsTable";
import RecentActivitySection from "./RecentActivitySection";
import TalentPipelineSection from "./TalentPipelineSection";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const { data: stats, isLoading: statsLoading } = useGetJobStatsQuery();
  const { data: jobs, isLoading: jobsLoading } = useGetJobsByCompanyQuery(
    companyId ?? "",
    { skip: !companyId },
  );
  const { data: applications } = useGetCompanyApplicationsQuery();

  const activeJobs = stats?.activeJobs ?? jobs?.length ?? 0;
  const totalApps = applications?.length ?? 0;
  const recentApps = (applications ?? []).slice(0, 3);
  const [now] = useState(() => Date.now());

  return (
    <div className="space-y-8">
      <MetricsGrid
        activeJobs={activeJobs}
        totalApps={totalApps}
        statsLoading={statsLoading}
      />

      <JobPostingsTable
        jobs={jobs}
        jobsLoading={jobsLoading}
        activeJobs={activeJobs}
        applications={applications}
        now={now}
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivitySection recentApps={recentApps} />
        <TalentPipelineSection recentApps={recentApps} />
      </section>
    </div>
  );
}
