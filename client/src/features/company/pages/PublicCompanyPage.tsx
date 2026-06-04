import { useParams, Link } from "react-router-dom";
import { Building2, MapPin, Globe, Briefcase } from "lucide-react";
import { useGetCompanyQuery } from "../api/companyApi";
import { formatSalary, timeAgo } from "../../../shared/utils/format";

export default function PublicCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: company,
    isLoading,
    isError,
  } = useGetCompanyQuery(id ?? "", { skip: !id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">
          Failed to load company. Please try again.
        </p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">Company not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Building2 className="text-secondary" size={40} />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {company.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-on-surface-variant">
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {company.location}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-secondary hover:underline"
                >
                  <Globe size={16} /> {company.website}
                </a>
              )}
            </div>
            {company.description && (
              <p className="text-base text-on-surface-variant mt-4">
                {company.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
        <Briefcase size={24} /> Active Jobs ({company.jobs?.length ?? 0})
      </h2>

      {!company.jobs || company.jobs.length === 0 ? (
        <p className="text-on-surface-variant">
          No active jobs at this company.
        </p>
      ) : (
        <div className="space-y-4">
          {company.jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-on-surface-variant">
                    {job.location && <span>{job.location}</span>}
                    {job.type && (
                      <span>
                        {job.type
                          .replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    )}
                    {(job.salaryMin || job.salaryMax) && (
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-on-surface-variant shrink-0">
                  Posted {timeAgo(job.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
