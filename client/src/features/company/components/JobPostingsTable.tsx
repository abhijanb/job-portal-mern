import { Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import type { Job } from "../../../shared/types";
import type { Application } from "../../../shared/types";

interface Props {
  jobs: Job[] | undefined;
  jobsLoading: boolean;
  activeJobs: number;
  applications: Application[] | undefined;
  now: number;
}

export default function JobPostingsTable({ jobs, jobsLoading, activeJobs, applications, now }: Props) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant">
        <h3 className="text-xl font-bold text-primary">My Job Postings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant">
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-center">Applications</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-center">Days Live</th>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {jobsLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">Loading...</td>
              </tr>
            ) : !jobs || jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                  No job postings yet.{" "}
                  <Link to="/jobs/create" className="text-secondary hover:underline font-medium">Post your first job</Link>
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const daysLive = Math.floor((now - new Date(job.createdAt).getTime()) / 86400000);
                const appCount = applications?.filter((a) => a.jobId === job.id).length ?? 0;
                return (
                  <tr key={job.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold uppercase">
                          {job.title.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-primary">{job.title}</div>
                          <div className="text-sm text-on-surface-variant">{job.location ?? "Remote"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "ACTIVE"
                          ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${appCount > 0 ? "text-primary" : "text-on-surface-variant opacity-50"}`}>
                        {appCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-on-surface-variant">
                      {job.status === "ACTIVE" ? `${daysLive}d` : "\u2014"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {job.status === "ACTIVE" && (
                          <Link
                            to={`/my-jobs/${job.id}/applications`}
                            className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                            title="View Applicants"
                          >
                            <UserCheck size={18} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low/50">
        <p className="text-sm text-on-surface-variant">
          Showing {jobs?.length ?? 0} of {activeJobs} job postings
        </p>
      </div>
    </section>
  );
}
