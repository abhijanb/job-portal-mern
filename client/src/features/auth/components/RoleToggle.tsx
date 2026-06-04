type Role = "candidate" | "employer";

interface RoleToggleProps {
  value: Role;
  onChange: (role: Role) => void;
}

export default function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="mb-6 p-1 bg-surface-container rounded-lg flex gap-1">
      {(["candidate", "employer"] as const).map((role) => (
        <button
          key={role}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium tracking-wide transition-cubic ${
            value === role
              ? "bg-secondary text-on-secondary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
          onClick={() => onChange(role)}
          type="button"
        >
          {role === "candidate" ? "Candidate" : "Employer"}
        </button>
      ))}
    </div>
  );
}
