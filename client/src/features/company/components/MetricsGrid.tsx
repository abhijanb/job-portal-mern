import { Briefcase, Users } from "lucide-react";

interface Props {
  activeJobs: number;
  totalApps: number;
  statsLoading: boolean;
}

export default function MetricsGrid({
  activeJobs,
  totalApps,
  statsLoading,
}: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-lg transition-shadow">
        <div className="p-2 bg-secondary-fixed rounded-lg mb-4 w-fit">
          <Briefcase className="text-on-secondary-fixed-variant" size={24} />
        </div>
        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
          Active Jobs
        </p>
        <p className="text-3xl font-bold text-primary">
          {statsLoading ? "..." : activeJobs}
        </p>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-lg transition-shadow">
        <div className="p-2 bg-primary-fixed rounded-lg mb-4 w-fit">
          <Users className="text-on-primary-fixed-variant" size={24} />
        </div>
        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
          Total Applications
        </p>
        <p className="text-3xl font-bold text-primary">{totalApps}</p>
      </div>
    </section>
  );
}
