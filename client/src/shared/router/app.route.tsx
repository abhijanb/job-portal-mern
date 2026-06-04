import NotFoundPage from "../pages/NotFoundPage";
import Layout from "../components/Layout";
import PublicLayout from "../components/PublicLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RoleGate } from "../components/RoleGate";
import HomePage from "../../features/home/pages/HomePage";
import DashboardPage from "../../features/auth/pages/DashboardPage";
import JobDetailPage from "../../features/jobs/pages/JobDetailPage";
import CreateJobPage from "../../features/jobs/pages/CreateJobPage";
import MyJobsPage from "../../features/jobs/pages/MyJobsPage";
import EditJobPage from "../../features/jobs/pages/EditJobPage";
import JobApplicantsPage from "../../features/jobs/pages/JobApplicantsPage";
import CandidateProfileViewPage from "../../features/jobs/pages/CandidateProfileViewPage";
import ApplicationsPage from "../../features/candidate/pages/ApplicationsPage";
import ProfilePage from "../../features/candidate/pages/ProfilePage";
import SavedJobsPage from "../../features/candidate/pages/SavedJobsPage";
import CompanyPage from "../../features/company/pages/CompanyPage";
import PublicCompanyPage from "../../features/company/pages/PublicCompanyPage";

export const appRoutes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "jobs", element: <HomePage /> },
      { path: "jobs/:id", element: <JobDetailPage /> },
      { path: "companies/:id", element: <PublicCompanyPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      {
        path: "jobs/create",
        element: (
          <RoleGate allowedRoles={["COMPANY_ADMIN"]}>
            <CreateJobPage />
          </RoleGate>
        ),
      },
      {
        path: "jobs/:id/edit",
        element: (
          <RoleGate allowedRoles={["COMPANY_ADMIN"]}>
            <EditJobPage />
          </RoleGate>
        ),
      },
      {
        path: "my-jobs",
        element: (
          <RoleGate allowedRoles={["COMPANY_ADMIN"]}>
            <MyJobsPage />
          </RoleGate>
        ),
      },
      {
        path: "my-jobs/:jobId/applications",
        element: (
          <RoleGate allowedRoles={["COMPANY_ADMIN"]}>
            <JobApplicantsPage />
          </RoleGate>
        ),
      },
      {
        path: "my-jobs/:jobId/applications/:userId/profile",
        element: (
          <RoleGate allowedRoles={["COMPANY_ADMIN"]}>
            <CandidateProfileViewPage />
          </RoleGate>
        ),
      },
      {
        path: "company",
        element: (
          <RoleGate allowedRoles={["COMPANY_ADMIN"]}>
            <CompanyPage />
          </RoleGate>
        ),
      },
      {
        path: "applications",
        element: (
          <RoleGate allowedRoles={["CANDIDATE"]}>
            <ApplicationsPage />
          </RoleGate>
        ),
      },
      {
        path: "profile",
        element: (
          <RoleGate allowedRoles={["CANDIDATE"]}>
            <ProfilePage />
          </RoleGate>
        ),
      },
      {
        path: "saved-jobs",
        element: (
          <RoleGate allowedRoles={["CANDIDATE"]}>
            <SavedJobsPage />
          </RoleGate>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
