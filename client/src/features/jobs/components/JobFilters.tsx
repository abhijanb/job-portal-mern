import { Search } from "lucide-react";

interface Props {
  searchInput: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export default function JobFilters({ searchInput, onSearchChange, statusFilter, onStatusFilterChange }: Props) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 mb-4 flex flex-col lg:flex-row gap-3 items-center">
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by job title, department..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg outline-none focus:border-secondary transition-colors bg-white"
        />
      </div>
      <div className="flex gap-3 w-full lg:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-secondary transition-colors w-full md:w-40"
        >
          <option value="">Status: All</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
    </div>
  );
}
