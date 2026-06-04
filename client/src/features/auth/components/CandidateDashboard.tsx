import { Link } from "react-router-dom";
import { useGetMyApplicationsQuery } from "../../candidate/api/applicationApi";
import CandidateHeader from "./CandidateHeader";
import ApplicationsList from "./ApplicationsList";
import SavedJobs from "./SavedJobs";

export default function CandidateDashboard() {
  const { data: applications } = useGetMyApplicationsQuery();

  return (
    <div className="space-y-8">
      <CandidateHeader />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-primary">My Applications</h3>
            <Link to="/applications" className="text-sm font-bold text-secondary hover:underline">View all</Link>
          </div>
          <ApplicationsList applications={applications ?? []} />
        </div>
        <div className="md:col-span-4 space-y-6">
          <SavedJobs />
        </div>
      </div>
    </div>
  );
}
