import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  safePage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  paginatedLength: number;
  filteredLength: number;
  limit: number;
}

export default function ApplicationFilters({
  statusFilter, onStatusFilterChange,
  searchQuery, onSearchChange,
  safePage, totalPages, onPageChange,
  paginatedLength, filteredLength, limit,
}: Props) {
  return (
    <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
          <span className="text-xs font-medium text-on-surface-variant">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-transparent border-none text-xs font-medium focus:ring-0 p-0 pr-6 outline-none"
          >
            <option value="">All Applicants</option>
            <option value="PENDING">New</option>
            <option value="REVIEWING">Screening</option>
            <option value="SHORTLISTED">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACCEPTED">Accepted</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={14} />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-56 pl-8 pr-3 py-1.5 text-sm bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:border-secondary transition-colors"
          />
        </div>
        <span className="text-xs text-outline">
          Showing {paginatedLength > 0 ? ((safePage - 1) * limit) + 1 : 0}–{Math.min(safePage * limit, filteredLength)} of {filteredLength}
        </span>
        <div className="flex gap-1">
          <button
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-low disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
            const p = start + i;
            return p <= totalPages ? (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-medium transition-colors ${
                  p === safePage
                    ? "border-secondary bg-secondary text-on-secondary"
                    : "border-outline-variant hover:bg-surface-container-low"
                }`}
              >
                {p}
              </button>
            ) : null;
          })}
          <button
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-low disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
