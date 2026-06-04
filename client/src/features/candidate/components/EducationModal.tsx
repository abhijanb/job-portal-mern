import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Modal from "../../../shared/components/Modal";
import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
} from "../api/profileApi";
import type { Education } from "../../../shared/types";
import { educationSchema } from "../../../shared/schemas/profile";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  education?: Education | null;
}

export default function EducationModal({ open, onClose, education }: Props) {
  const [create] = useCreateEducationMutation();
  const [update] = useUpdateEducationMutation();
  const isEdit = !!education;
  const [form, setForm] = useState({
    degree: "",
    school: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (education) {
      setForm({
        degree: education.degree,
        school: education.school,
        field: education.field ?? "",
        startDate: education.startDate ? education.startDate.slice(0, 7) : "",
        endDate: education.endDate ? education.endDate.slice(0, 7) : "",
        current: education.current,
        description: education.description ?? "",
      });
    } else {
      setForm({
        degree: "",
        school: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  }, [open, education]);

  const handleSave = async () => {
    setError("");
    const result = educationSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    const payload = { ...result.data };
    if (payload.current) payload.endDate = "";
    try {
      if (isEdit) {
        await update({ id: education!.id, data: payload }).unwrap();
      } else {
        await create(payload).unwrap();
      }
      toast.success(isEdit ? "Education updated!" : "Education added!");
      onClose();
    } catch {
      toast.error("Failed to save education.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Education" : "Add Education"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Degree
            </label>
            <input
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-on-surface-variant">
              School / Institution
            </label>
            <input
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-on-surface-variant">
              Field of Study
            </label>
            <input
              className="w-full border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none mt-1"
              value={form.field}
              onChange={(e) => setForm({ ...form, field: e.target.value })}
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
                I currently study here
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
