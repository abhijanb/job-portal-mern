import { Link } from "react-router-dom";
import { MapPin, Edit3, Share2 } from "lucide-react";
import type { Job } from "../../../shared/types";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Props {
  job: Job | undefined;
}

export default function JobHeaderCard({ job }: Props) {

  return (
    <div className="md:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest">{job?.type?.replace("_", " ") ?? "Department"}</span>
          <span className="w-1 h-1 bg-outline-variant rounded-full" />
          <span className="text-xs text-on-surface-variant">
            Posted {job?.createdAt ? format(new Date(job.createdAt), "MMM d, yyyy") : ""}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">{job?.title ?? "Job Title"}</h2>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            {job?.status ?? "Active"}
          </span>
          {job?.location && (
            <span className="text-sm text-on-surface-variant flex items-center gap-1">
              <MapPin size={14} />
              {job.location}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Link
          to={`/jobs/${job?.id}/edit`}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all"
        >
          <Edit3 size={16} />
          Edit Listing
        </Link>
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
          className="flex items-center gap-2 bg-transparent border border-primary text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}
