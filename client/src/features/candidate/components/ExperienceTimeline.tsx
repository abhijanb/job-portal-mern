import { Building2, Edit2, PlusCircle, Trash2 } from "lucide-react";
import type { Experience } from "../../../shared/types";
import { useDeleteExperienceMutation } from "../api/profileApi";
import toast from "react-hot-toast";

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

interface Props {
  experiences: Experience[];
  onEdit: (exp: Experience) => void;
  onAdd: () => void;
}

export default function ExperienceTimeline({
  experiences,
  onEdit,
  onAdd,
}: Props) {
  const [deleteExperience] = useDeleteExperienceMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id).unwrap();
      toast.success("Experience deleted!");
    } catch {
      toast.error("Failed to delete experience.");
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-on-surface">Experience</h2>
        <button
          className="text-secondary hover:bg-secondary/10 p-1 rounded-full transition-colors"
          onClick={onAdd}
        >
          <PlusCircle size={22} />
        </button>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary border border-outline-variant">
                  <Building2 size={20} />
                </div>
                <div className="w-0.5 h-full bg-outline-variant/30 mt-2" />
              </div>
              <div className="pb-6 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface">
                      {exp.title}
                    </h3>
                    <p className="text-secondary text-sm font-medium mb-1">
                      {exp.company}
                      {exp.location
                        ? ` \u2022 ${exp.location}`
                        : ""} &mdash; {fmtDate(exp.startDate)} &mdash;{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                          ? fmtDate(exp.endDate)
                          : "Present"}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="text-on-surface-variant hover:text-secondary p-1 transition-colors"
                      onClick={() => onEdit(exp)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="text-on-surface-variant hover:text-error p-1 transition-colors"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-on-surface-variant text-sm leading-relaxed mt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-on-surface-variant text-sm italic">
          No experience added yet.
        </p>
      )}
    </section>
  );
}
