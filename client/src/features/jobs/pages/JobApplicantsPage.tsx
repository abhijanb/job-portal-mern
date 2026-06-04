import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useGetJobQuery } from "../api/jobApi";
import { useGetJobApplicationsQuery, useUpdateApplicationStatusMutation } from "../../candidate/api/applicationApi";
import toast from "react-hot-toast";
import JobHeaderCard from "../components/JobHeaderCard";
import ApplicationStatsCards from "../components/ApplicationStatsCards";
import ApplicationFilters from "../components/ApplicationFilters";
import ApplicantsTable from "../components/ApplicantsTable";

const statusLabels: Record<string, string> = {
  PENDING: "New",
  REVIEWING: "Screening",
  SHORTLISTED: "Interview",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

export default function JobApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();

  const { data: job, isLoading: jobLoading } = useGetJobQuery(jobId ?? "", { skip: !jobId });
  const { data: applications, isLoading: appsLoading } = useGetJobApplicationsQuery(jobId ?? "", { skip: !jobId });
  const [updateStatus] = useUpdateApplicationStatusMutation();

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = (applications ?? []).filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = app.user?.name?.toLowerCase().includes(q);
      const emailMatch = app.user?.email?.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

  const stats = {
    total: applications?.length ?? 0,
    newToday: applications?.filter((a) => {
      const d = new Date(a.createdAt);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length ?? 0,
    interviewing: applications?.filter((a) => a.status === "SHORTLISTED").length ?? 0,
  };

  const handleStatusChange = async (appId: string, status: string) => {
    try {
      await updateStatus({ id: appId, status }).unwrap();
      toast.success(`Application ${statusLabels[status]?.toLowerCase() ?? status.toLowerCase()}!`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  if (jobLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <JobHeaderCard job={job} />
        <ApplicationStatsCards {...stats} />
      </section>

      <ApplicationFilters
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
        searchQuery={searchQuery}
        onSearchChange={(v) => setSearchQuery(v)}
        safePage={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        paginatedLength={paginated.length}
        filteredLength={filtered.length}
        limit={limit}
      />

      <ApplicantsTable
        paginated={paginated}
        jobId={jobId}
        handleStatusChange={handleStatusChange}
        safePage={safePage}
        totalPages={totalPages}
        setPage={setPage}
        filtered={filtered}
        limit={limit}
      />
    </div>
  );
}
