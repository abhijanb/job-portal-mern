import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Bookmark,
  Share2,
  CheckCircle,
  Users,
} from "lucide-react";
import { useGetJobQuery } from "../api/jobApi";
import {
  useGetMyApplicationsQuery,
  useApplyMutation,
} from "../../candidate/api/applicationApi";
import { useAuth } from "../../auth/hooks/useAuth";
import { useSavedJobs } from "../hooks/useSavedJobs";
import ApplyModal from "../components/ApplyModal";
import { timeAgo, formatSalary } from "../../../shared/utils/format";

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();
  const { data: job, isLoading } = useGetJobQuery(id ?? "");
  const [apply, { isLoading: applying }] = useApplyMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const { saved, toggleSave } = useSavedJobs(job);

  const { data: myApplications } = useGetMyApplicationsQuery(undefined, {
    skip: !isAuthenticated || !isCandidate,
  });

  useEffect(() => {
    if (!job || !myApplications) return;
    if (myApplications.some((a) => a.jobId === job.id)) setApplied(true);
  }, [job, myApplications]);

  const handleApply = useCallback(
    async (data: { coverLetter: string }) => {
      if (!job) return;
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      try {
        await apply({
          jobId: job.id,
          coverLetter: data.coverLetter || undefined,
        }).unwrap();
        setApplied(true);
        setModalOpen(false);
        toast.success("Application submitted!");
      } catch {
        toast.error("Failed to apply. You may have already applied.");
      }
    },
    [job, apply, isAuthenticated, navigate],
  );

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isCandidate) {
      toast.error("Only candidates can apply for jobs.");
      return;
    }
    setModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="space-y-4 w-full animate-pulse">
          <div className="h-8 bg-surface-container rounded-lg w-2/3" />
          <div className="h-4 bg-surface-container rounded w-1/3" />
          <div className="h-64 bg-surface-container rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Briefcase size={48} className="text-outline-variant" />
        <p className="text-xl font-semibold text-on-surface-variant">
          Job not found
        </p>
        <Link to="/jobs" className="text-secondary hover:underline text-sm">
          Browse all jobs
        </Link>
      </div>
    );
  }

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const typeLabel = TYPE_LABELS[job.type] ?? job.type;

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-5 items-start">
              <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0">
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Building2 className="text-secondary" size={30} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary leading-tight">
                  {job.title}
                </h1>
                <Link
                  to={`/companies/${job.companyId}`}
                  className="text-base text-secondary hover:underline font-medium"
                >
                  {job.company?.name ?? "Unknown Company"}
                </Link>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2">
                  {job.location && (
                    <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <MapPin size={15} className="shrink-0" /> {job.location}
                    </span>
                  )}
                  {salary && (
                    <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <DollarSign size={15} className="shrink-0" /> {salary}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Briefcase size={15} className="shrink-0" /> {typeLabel}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Clock size={15} className="shrink-0" />{" "}
                    {timeAgo(job.createdAt)}
                  </span>
                  {job._count?.applications !== undefined && (
                    <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <Users size={15} className="shrink-0" />{" "}
                      {job._count.applications} applicants
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              {applied ? (
                <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-secondary text-secondary text-sm font-bold">
                  <CheckCircle size={16} /> Applied
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  disabled={applying}
                  className="grow md:grow-0 bg-secondary text-on-secondary px-6 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              )}
              <button
                onClick={toggleSave}
                title={saved ? "Unsave job" : "Save job"}
                className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${
                  saved
                    ? "bg-secondary/10 border-secondary text-secondary"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                title="Copy link"
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-outline-variant/60">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{" "}
              Actively Hiring
            </span>
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/60 rounded-full text-xs font-semibold">
              {typeLabel}
            </span>
            {job.experience && (
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant/60 rounded-full text-xs font-semibold">
                {job.experience}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8">
              <h2 className="text-lg font-bold text-primary mb-4">
                About the Role
              </h2>
              <div
                className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_strong]:text-on-surface [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8">
                <h2 className="text-lg font-bold text-primary mb-4">
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply CTA */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
              <h3 className="text-base font-bold text-primary mb-1">
                Ready to apply?
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                {applied
                  ? "You've already submitted your application for this role."
                  : "Submit your application in minutes. A cover letter is optional."}
              </p>
              {applied ? (
                <div className="flex items-center gap-2 justify-center w-full px-4 py-2.5 rounded-xl border border-secondary text-secondary text-sm font-bold">
                  <CheckCircle size={16} /> Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  disabled={applying}
                  className="w-full bg-secondary text-on-secondary py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              )}
            </div>

            {/* Job Details */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
              <h3 className="text-base font-bold text-primary mb-4">
                Job Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-on-surface-variant font-medium">
                    Job Type
                  </dt>
                  <dd className="text-on-surface font-semibold">{typeLabel}</dd>
                </div>
                {job.location && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-on-surface-variant font-medium">
                      Location
                    </dt>
                    <dd className="text-on-surface font-semibold">
                      {job.location}
                    </dd>
                  </div>
                )}
                {salary && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-on-surface-variant font-medium">
                      Salary
                    </dt>
                    <dd className="text-on-surface font-semibold">{salary}</dd>
                  </div>
                )}
                {job.experience && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-on-surface-variant font-medium">
                      Experience
                    </dt>
                    <dd className="text-on-surface font-semibold">
                      {job.experience}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <dt className="text-on-surface-variant font-medium">
                    Posted
                  </dt>
                  <dd className="text-on-surface font-semibold">
                    {timeAgo(job.createdAt)}
                  </dd>
                </div>
                {job._count?.applications !== undefined && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-on-surface-variant font-medium">
                      Applicants
                    </dt>
                    <dd className="text-on-surface font-semibold">
                      {job._count.applications}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Company */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
              <h3 className="text-base font-bold text-primary mb-3">
                About the Company
              </h3>
              {job.company?.description && (
                <p className="text-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-4">
                  {job.company.description}
                </p>
              )}
              <dl className="space-y-2">
                {job.company?.location && (
                  <div className="flex justify-between items-center text-sm">
                    <dt className="text-on-surface-variant">Location</dt>
                    <dd className="text-on-surface font-medium">
                      {job.company.location}
                    </dd>
                  </div>
                )}
              </dl>
              <Link
                to={`/companies/${job.companyId}`}
                className="mt-4 block text-center text-sm text-secondary hover:underline font-medium"
              >
                View company profile →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ApplyModal
          key={job.id}
          job={job}
          onClose={() => setModalOpen(false)}
          onSubmit={handleApply}
          isSubmitting={applying}
        />
      )}
    </>
  );
}
