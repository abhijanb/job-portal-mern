import { Link } from "react-router-dom";
import {
  Edit3,
  Trash2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Job } from "../../../shared/types";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-secondary/10 text-secondary",
  DRAFT: "bg-surface-container-highest text-on-surface-variant",
  CLOSED: "bg-error-container text-on-error-container",
};

const statusDots: Record<string, string> = {
  ACTIVE: "bg-secondary",
  DRAFT: "bg-outline-variant",
  CLOSED: "bg-error",
};

interface Props {
  paginated: Job[];
  filteredTotal: number;
  isLoading: boolean;
  safePage: number;
  totalPages: number;
  goToPage: (p: number) => void;
  handleDelete: (id: string) => void;
  handleReopen: (id: string) => void;
}

export default function JobsTable({
  paginated,
  filteredTotal,
  isLoading,
  safePage,
  totalPages,
  goToPage,
  handleDelete,
  handleReopen,
}: Props) {
  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const pages: (number | "...")[] = [];
    const range = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - range && i <= safePage + range)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages.map((p, i) =>
      p === "..." ? (
        <span
          key={`ellipsis-${i}`}
          className="text-on-surface-variant px-1 text-sm"
        >
          ...
        </span>
      ) : (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-1.5 border rounded text-sm font-medium transition-colors ${
            p === safePage
              ? "border-secondary bg-white text-secondary"
              : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
          }`}
        >
          {p}
        </button>
      ),
    );
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Applicants
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Date Posted
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-on-surface-variant"
                >
                  Loading jobs...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-on-surface-variant"
                >
                  No jobs found.
                </td>
              </tr>
            ) : (
              paginated.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span
                        className={`text-base font-semibold text-primary ${job.status === "CLOSED" ? "opacity-60" : ""}`}
                      >
                        {job.title}
                      </span>
                      <span className="text-sm text-on-surface-variant">
                        {job.type
                          ?.replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        {job.location ? ` \u2022 ${job.location}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[job.status] ?? ""}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDots[job.status] ?? ""}`}
                      />
                      {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-primary">
                      {job._count?.applications ?? 0} applicants
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-on-surface-variant">
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="p-2 hover:bg-surface-container-high text-on-surface-variant rounded-lg transition-colors inline-block"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      {job.status === "ACTIVE" && (
                        <Link
                          to={`/my-jobs/${job.id}/applications`}
                          className="text-secondary text-sm font-medium px-3 py-1.5 hover:bg-secondary/10 rounded-lg transition-colors"
                          title="View Applicants"
                        >
                          <UserCheck size={18} className="inline -mt-0.5" />{" "}
                          Applicants
                        </Link>
                      )}
                      {job.status === "DRAFT" && (
                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="text-secondary text-sm font-medium px-3 py-1.5 hover:bg-secondary/10 rounded-lg transition-colors"
                        >
                          Finish Draft
                        </Link>
                      )}
                      {job.status === "CLOSED" && (
                        <button
                          onClick={() => handleReopen(job.id)}
                          className="text-secondary text-sm font-medium px-3 py-1.5 hover:bg-secondary/10 rounded-lg transition-colors"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated.length > 0 && (
        <div className="px-5 py-3 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-xs text-on-surface-variant">
            Showing {(safePage - 1) * 10 + 1}–
            {Math.min(safePage * 10, filteredTotal)} of {filteredTotal} jobs
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => goToPage(safePage - 1)}
              className="p-1.5 border border-outline-variant rounded hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {renderPageNumbers()}
            <button
              disabled={safePage >= totalPages}
              onClick={() => goToPage(safePage + 1)}
              className="p-1.5 border border-outline-variant rounded hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
