import { useRef } from "react";
import { FileText } from "lucide-react";
import { useUploadResumeMutation } from "../api/profileApi";
import toast from "react-hot-toast";

interface Props {
  resumeUrl?: string | null;
}

export default function ResumeWidget({ resumeUrl }: Props) {
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadResume(file).unwrap();
      toast.success("Resume uploaded!");
    } catch {
      toast.error("Failed to upload resume.");
    }
  };

  return (
    <section className="bg-secondary text-on-secondary rounded-xl p-6 shadow-lg relative overflow-hidden group">
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleResumeUpload}
      />
      <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 pointer-events-none">
        <FileText size={100} />
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-2">Master Resume</h3>
        <p className="text-on-secondary/80 text-xs mb-4">
          {resumeUrl ? "Your resume is ready." : "No resume uploaded yet."}
        </p>
        <div className="flex gap-2">
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="bg-on-secondary text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all active:scale-95 inline-block">
              View PDF Online
            </a>
          )}
          <button
            className={`border border-on-secondary/30 text-on-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all active:scale-95 ${isUploading ? "opacity-60" : ""}`}
            onClick={() => resumeInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : resumeUrl ? "Update" : "Upload Resume"}
          </button>
        </div>
      </div>
    </section>
  );
}
