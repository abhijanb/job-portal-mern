import { useState } from "react";
import { useGetProfileQuery } from "../api/profileApi";
import { useGetMyApplicationsQuery } from "../api/applicationApi";
import ProfileHeader from "../components/ProfileHeader";
import ExperienceTimeline from "../components/ExperienceTimeline";
import EducationTimeline from "../components/EducationTimeline";
import SkillsPanel from "../components/SkillsPanel";
import ApplicationsSidebar from "../components/ApplicationsSidebar";
import ResumeWidget from "../components/ResumeWidget";
import ProfileEditModal from "../components/ProfileEditModal";
import ExperienceModal from "../components/ExperienceModal";
import EducationModal from "../components/EducationModal";
import SkillsModal from "../components/SkillsModal";
import type { Experience, Education } from "../../../shared/types";

export default function ProfilePage() {
  const { data: profile, isLoading, error: profileError } = useGetProfileQuery();
  const { data: applications, isLoading: isAppsLoading, error: appsError } = useGetMyApplicationsQuery();

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  const openNewExperience = () => { setEditingExperience(null); setShowExperienceModal(true); };
  const openEditExperience = (exp: Experience) => { setEditingExperience(exp); setShowExperienceModal(true); };
  const openNewEducation = () => { setEditingEducation(null); setShowEducationModal(true); };
  const openEditEducation = (edu: Education) => { setEditingEducation(edu); setShowEducationModal(true); };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-error text-sm">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  const experiences = profile?.experiences ?? [];
  const educations = profile?.educations ?? [];
  const skills = profile?.skills ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <ProfileHeader profile={profile} />

          <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
            <ExperienceTimeline
              experiences={experiences}
              onEdit={openEditExperience}
              onAdd={openNewExperience}
            />
            <EducationTimeline
              educations={educations}
              onEdit={openEditEducation}
              onAdd={openNewEducation}
            />
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
            <SkillsPanel skills={skills} onEdit={() => setShowSkillsModal(true)} />
            <ApplicationsSidebar
              applications={applications}
              isLoading={isAppsLoading}
              error={appsError}
            />
            <ResumeWidget resumeUrl={profile?.resumeUrl} />
          </div>
        </div>
      </main>

      <ProfileEditModal open={showProfileEdit} onClose={() => setShowProfileEdit(false)} profile={profile} />
      <ExperienceModal open={showExperienceModal} onClose={() => setShowExperienceModal(false)} experience={editingExperience} />
      <EducationModal open={showEducationModal} onClose={() => setShowEducationModal(false)} education={editingEducation} />
      <SkillsModal open={showSkillsModal} onClose={() => setShowSkillsModal(false)} skills={skills} />
    </div>
  );
}
