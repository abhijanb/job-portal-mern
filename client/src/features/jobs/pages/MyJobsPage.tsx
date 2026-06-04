import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  useGetJobsByCompanyQuery,
  useGetJobStatsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "../api/jobApi";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import JobStatsCards from "../components/JobStatsCards";
import JobFilters from "../components/JobFilters";
import JobsTable from "../components/JobsTable";
import toast from "react-hot-toast";

export default function MyJobsPage() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") ?? "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data: stats } = useGetJobStatsQuery(undefined, { skip: !companyId });
  const { data: jobs, isLoading } = useGetJobsByCompanyQuery(companyId ?? "", {
    skip: !companyId,
  });
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const handleReopen = async (id: string) => {
    try {
      await updateJob({ id, data: { status: "ACTIVE" } }).unwrap();
      toast.success("Job reopened!");
    } catch {
      toast.error("Failed to reopen job.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted!");
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  const filtered = (jobs ?? []).filter((job) => {
    if (statusFilter && job.status !== statusFilter) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(q);
      const deptMatch = (job.type ?? "").toLowerCase().includes(q);
      const locMatch = (job.location ?? "").toLowerCase().includes(q);
      if (!titleMatch && !deptMatch && !locMatch) return false;
    }
    return true;
  });

  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

  const goToPage = (p: number) => {
    setPage(p);
    const next = new URLSearchParams();
    if (debouncedSearch) next.set("q", debouncedSearch);
    if (statusFilter) next.set("status", statusFilter);
    if (p > 1) next.set("page", String(p));
    setSearchParams(next, { replace: true });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">My Jobs</h1>
          <p className="text-base text-on-surface-variant">
            Manage and track your active job listings and candidate pipelines.
          </p>
        </div>
        <Link
          to="/jobs/create"
          className="flex items-center justify-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-[0px_4px_20px_rgba(8,90,192,0.15)]"
        >
          <Plus size={20} />
          Post a New Job
        </Link>
      </div>

      <JobStatsCards stats={stats} jobs={jobs} />

      <JobFilters
        searchInput={searchInput}
        onSearchChange={(val) => {
          setSearchInput(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
      />

      <JobsTable
        paginated={paginated}
        filteredTotal={filtered.length}
        isLoading={isLoading}
        safePage={safePage}
        totalPages={totalPages}
        goToPage={goToPage}
        handleDelete={handleDelete}
        handleReopen={handleReopen}
      />
    </div>
  );
}
