import { useAuth } from "../hooks/useAuth";
import CompanyDashboard from "../../company/components/CompanyDashboard";
import CandidateDashboard from "../components/CandidateDashboard";

export default function DashboardPage() {
  const { isCandidate, isCompanyAdmin } = useAuth();

  if (isCompanyAdmin) return <CompanyDashboard />;
  if (!isCandidate) return null;

  return <CandidateDashboard />;
}
