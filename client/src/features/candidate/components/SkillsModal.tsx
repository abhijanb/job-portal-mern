import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import Modal from "../../../shared/components/Modal";
import { useUpdateProfileMutation } from "../api/profileApi";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  skills: string[];
}

export default function SkillsModal({ open, onClose, skills }: Props) {
  const [updateProfile] = useUpdateProfileMutation();
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (open) setItems([...skills]);
  }, [open, skills]);

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems([...items, trimmed]);
      setInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setItems(items.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    try {
      await updateProfile({ skills: items }).unwrap();
      toast.success("Skills updated!");
      onClose();
    } catch {
      toast.error("Failed to update skills.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Skills">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-outline-variant rounded-lg p-3 text-sm bg-surface focus:ring-1 focus:ring-secondary outline-none"
            placeholder="Type a skill and press Add"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
          />
          <button
            className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
            onClick={addSkill}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((skill) => (
            <span
              key={skill}
              className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-error transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
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
