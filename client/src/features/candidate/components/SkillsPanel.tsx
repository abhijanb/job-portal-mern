import { PlusCircle } from "lucide-react";

interface Props {
  skills: string[];
  onEdit: () => void;
}

export default function SkillsPanel({ skills, onEdit }: Props) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-on-surface">Skills</h2>
        <button className="text-secondary hover:bg-secondary/10 p-1 rounded-full transition-colors" onClick={onEdit}>
          <PlusCircle size={22} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill} className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-lg text-xs font-medium">
              {skill}
            </span>
          ))
        ) : (
          <p className="text-on-surface-variant text-sm italic">No skills added yet.</p>
        )}
      </div>
    </section>
  );
}
