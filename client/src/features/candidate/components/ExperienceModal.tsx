import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Modal from "../../../shared/components/Modal";
import {
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from "../api/profileApi";
import type { Experience } from "../../../shared/types";
import { experienceSchema } from "../../../shared/schemas/profile";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  experience?: Experience | null;
}

export default function ExperienceModal({ open, onClose, experience }: Props) {
  const [create] = useCreateExperienceMutation();
  const [update] = useUpdateExperienceMutation();
  const isEdit = !!experience;
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (experience) {
      setForm({
        title: experience.title,
        company: experience.company,
        location: experience.location ?? "",
        startDate: experience.startDate ? experience.startDate.slice(0, 7) : "",
        endDate: experience.endDate ? experience.endDate.slice(0, 7) : "",
        current: experience.current,
        description: experience.description ?? "",
      });
    } else {
      setForm({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  }, [open, experience]);

  const handleSave = async () => {
    setError("");
    const result = experienceSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    const payload = { ...result.data };
    if (payload.current) payload.endDate = "";
    try {
      if (isEdit) {
        await update({ id: experience!.id, data: payload }).unwrap();
      } else {
        await create(payload).unwrap();
      }
      toast.success(isEdit ? "Experience updated!" : "Experience added!");
      onClose();
    } catch {
      toast.error("Failed to save experience.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Experience" : "Add Experience"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Job Title
            </label>
            <input
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Company
            </label>
            <input
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="col-span-2">
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
              Start Date
            </label>
            <input
              type="month"
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-on-surface-variant">
              End Date
            </label>
            <input
              type="month"
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              disabled={form.current}
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                checked={form.current}
                onChange={(e) =>
                  setForm({ ...form, current: e.target.checked })
                }
              />
              <span className="text-sm text-on-surface-variant">
                I currently work here
              </span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Description
            </label>
            <textarea
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none resize-none mt-1"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>
        {error && <p className="text-error text-sm text-center">{error}</p>}
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
            <Save size={16} /> {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
