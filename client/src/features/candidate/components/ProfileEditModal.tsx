import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Modal from "../../../shared/components/Modal";
import { useUpdateProfileMutation } from "../api/profileApi";
import type { Profile } from "../../../shared/types";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: Profile | undefined;
}

export default function ProfileEditModal({ open, onClose, profile }: Props) {
  const [updateProfile] = useUpdateProfileMutation();
  const [form, setForm] = useState({
    headline: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    location: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        headline: profile?.headline ?? "",
        phone: profile?.phone ?? "",
        linkedinUrl: profile?.linkedinUrl ?? "",
        githubUrl: profile?.githubUrl ?? "",
        portfolioUrl: profile?.portfolioUrl ?? "",
        location: profile?.location ?? "",
      });
    }
  }, [open, profile]);

  const handleSave = async () => {
    try {
      await updateProfile(form).unwrap();
      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-on-surface-variant">
            Professional Headline
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-on-surface-variant">
            Location
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-on-surface-variant">
            Phone
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-on-surface-variant">
            LinkedIn URL
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
            value={form.linkedinUrl}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-on-surface-variant">
            GitHub URL
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-on-surface-variant">
            Portfolio URL
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
            value={form.portfolioUrl}
            onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all flex items-center gap-2"
            onClick={handleSave}
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
