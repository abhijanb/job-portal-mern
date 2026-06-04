import { useRef } from "react";
import { Camera, Phone, LinkIcon, Code2, ExternalLink } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useUploadAvatarMutation } from "../api/profileApi";
import type { Profile } from "../../../shared/types";
import toast from "react-hot-toast";

export default function ProfileHeader({ profile }: { profile: Profile | undefined }) {
  const { user } = useAuth();
  const [uploadAvatar, { isLoading: isAvatarUploading }] = useUploadAvatarMutation();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAvatar(file).unwrap();
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to upload avatar.");
    }
  };

  return (
    <section className="col-span-12 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="relative group">
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg border-4 border-surface-container-lowest">
          <img
            className="w-full h-full object-cover"
            src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "")}&background=random&size=200`}
            alt={user?.name ?? "Profile"}
          />
        </div>
        <button
          className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary p-2 rounded-lg shadow-md hover:scale-105 transition-transform disabled:opacity-60"
          onClick={() => avatarInputRef.current?.click()}
          disabled={isAvatarUploading}
        >
          <Camera size={18} />
        </button>
        {isAvatarUploading && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-semibold text-on-surface mb-1">{user?.name ?? "User"}</h1>
        <p className="text-on-surface-variant text-lg mb-4">{profile?.headline ?? "Candidate"}</p>

        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
          {profile?.phone && (
            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30 text-sm">
              <Phone size={16} />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile?.linkedinUrl && (
            <a className="flex items-center gap-2 text-secondary hover:underline bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/20 text-sm" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <LinkIcon size={16} />
              <span>LinkedIn</span>
            </a>
          )}
          {profile?.githubUrl && (
            <a className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30 text-sm" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              <Code2 size={16} />
              <span>GitHub</span>
            </a>
          )}
          {profile?.portfolioUrl && (
            <a className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/30 text-sm" href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              <span>Portfolio</span>
            </a>
          )}
        </div>

        <div className="flex gap-3 justify-center md:justify-start">
          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary text-on-secondary px-6 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all shadow-md inline-block">
              Download Resume
            </a>
          )}
          {profile?.portfolioUrl && (
            <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition-all inline-block">
              View Portfolio
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
