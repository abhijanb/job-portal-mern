import { Briefcase, UserPlus, TrendingUp, type LucideIcon } from "lucide-react";
import { useGetJobStatsQuery } from "../../jobs/api/jobApi";
import { useGetCompanyApplicationsQuery } from "../../candidate/api/applicationApi";

export default function StatsCards() {
  const { data: stats, isLoading: statsLoading } = useGetJobStatsQuery();
  const { data: applications } = useGetCompanyApplicationsQuery();

  const now = new Date();
  const hiresThisMonth = applications?.filter((a) => {
    if (a.status !== "ACCEPTED") return false;
    const d = new Date(a.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length ?? 0;

  const items: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Briefcase, label: "Total Active Jobs", value: statsLoading ? "..." : String(stats?.activeJobs ?? 0) },
    { icon: UserPlus, label: "Total Applications", value: String(applications?.length ?? 0) },
    { icon: TrendingUp, label: "Hires this Month", value: String(hiresThisMonth) },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <item.icon className="text-secondary mb-4" size={32} />
          <div>
            <p className="text-sm font-medium text-on-surface-variant">{item.label}</p>
            <h3 className="text-2xl font-bold text-primary">{item.value}</h3>
          </div>
        </div>
      ))}
    </section>
  );
}
