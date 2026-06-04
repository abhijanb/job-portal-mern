import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Job } from "../../../shared/types";

interface ApplyModalProps {
  job: Job;
  onSubmit: (data: { coverLetter: string }) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

export default function ApplyModal({
  job,
  onSubmit,
  isSubmitting,
  onClose,
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ coverLetter });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-outline-variant">
          <div>
            <h3 className="text-lg font-bold text-primary">{job.title}</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {job.company?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form id="apply-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-on-surface-variant">
            A cover letter is optional but can help your application stand out.
          </p>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Cover Letter{" "}
              <span className="text-on-surface-variant font-normal">
                (optional)
              </span>
            </label>
            <textarea
              className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm bg-surface text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
              placeholder="Why are you a good fit for this role?"
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="apply-form"
            disabled={isSubmitting}
            className="flex-1 bg-secondary text-on-secondary px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
