import { Link } from "react-router-dom";
import { Building2, MapPin, DollarSign, Clock } from "lucide-react";

export interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  badge: string | null;
  badgeColor: string;
}

interface JobCardProps {
  job: FeaturedJob;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-outline-variant hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center">
          <Building2 className="text-secondary" size={24} />
        </div>
        {job.badge && (
          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${job.badgeColor}`}>
            {job.badge}
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
        {job.title}
      </h3>
      <p className="text-base text-on-surface-variant mb-4">{job.company}</p>
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="flex items-center gap-1 text-xs text-on-surface-variant">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-on-surface-variant">
          <DollarSign size={14} /> {job.salary}
        </span>
        <span className="flex items-center gap-1 text-xs text-on-surface-variant">
          <Clock size={14} /> {job.type}
        </span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
        <span className="text-xs text-outline">Posted {job.posted}</span>
        <Link to={`/jobs/${job.id}`} className="bg-surface-container-high text-primary px-6 py-2 rounded-lg text-sm font-bold hover:bg-secondary hover:text-on-secondary transition-all">
          Apply Now
        </Link>
      </div>
    </div>
  );
}
