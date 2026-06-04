import { useParams, Link } from "react-router-dom";
import {
  Phone,
  LinkIcon,
  Code2,
  Building2,
  School,
  ExternalLink,
  ArrowLeft,
  Loader2,
  FileText,
} from "lucide-react";
import { useGetProfileByUserIdQuery } from "../../candidate/api/profileApi";

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default function CandidateProfileViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const { jobId } = useParams<{ jobId: string }>();
  const { data: profile, isLoading } = useGetProfileByUserIdQuery(
    userId ?? "",
    { skip: !userId },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  const experiences = profile?.experiences ?? [];
  const educations = profile?.educations ?? [];
  const skills = profile?.skills ?? [];

  return (
    <div>
      {/* Back button */}
      <Link
        to={`/my-jobs/${jobId}/applications`}
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-secondary mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Applicants
      </Link>

      {/* Profile Header */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow border-2 border-surface-container-lowest shrink-0">
          <img
            className="w-full h-full object-cover"
            src={
              profile?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.userId ?? "User")}&background=085ac0&color=fff&size=120`
            }
            alt="Profile"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-xl font-semibold text-primary mb-1">
            {profile?.headline ?? "Candidate Profile"}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {profile?.phone && (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30">
                <Phone size={14} />
                {profile.phone}
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30">
                {profile.location}
              </div>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-secondary hover:underline bg-secondary/5 px-3 py-1 rounded-full border border-secondary/20"
              >
                <LinkIcon size={14} /> LinkedIn
              </a>
            )}
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30"
              >
                <Code2 size={14} /> GitHub
              </a>
            )}
            {profile?.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30"
              >
                <ExternalLink size={14} /> Portfolio
              </a>
            )}
          </div>
          <div className="flex gap-3 mt-4 justify-center md:justify-start">
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-xs font-medium hover:brightness-110 transition-all inline-flex items-center gap-1.5"
              >
                <FileText size={14} /> Download Resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Experience + Education */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Experience
            </h2>
            {experiences.length > 0 ? (
              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary border border-outline-variant">
                        <Building2 size={18} />
                      </div>
                      <div className="w-0.5 h-full bg-outline-variant/30 mt-2" />
                    </div>
                    <div className="pb-5 flex-1">
                      <h3 className="text-base font-semibold text-primary">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-secondary font-medium">
                        {exp.company}
                        {exp.location ? ` • ${exp.location}` : ""} —{" "}
                        {fmtDate(exp.startDate)} —{" "}
                        {exp.current ? "Present" : fmtDate(exp.endDate!)}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-on-surface-variant mt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">
                No experience listed.
              </p>
            )}
          </section>

          {/* Education */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Education
            </h2>
            {educations.length > 0 ? (
              <div className="space-y-5">
                {educations.map((edu) => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary border border-outline-variant">
                        <School size={18} />
                      </div>
                      <div className="w-0.5 h-full bg-outline-variant/30 mt-2" />
                    </div>
                    <div className="pb-5 flex-1">
                      <h3 className="text-base font-semibold text-primary">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </h3>
                      <p className="text-sm text-secondary font-medium">
                        {edu.school} — {fmtDate(edu.startDate)} —{" "}
                        {edu.current ? "Present" : fmtDate(edu.endDate!)}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-on-surface-variant mt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">
                No education listed.
              </p>
            )}
          </section>
        </div>

        {/* Right sidebar: Skills */}
        <div className="space-y-6">
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
            <h2 className="text-lg font-semibold text-primary mb-4">Skills</h2>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-lg text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">
                No skills listed.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
