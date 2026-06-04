
import { useAuth } from "../hooks/useAuth";

export default function CandidateHeader() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Welcome back, {user?.name?.split(" ")[0] ?? "User"}
        </h1>
        <p className="text-base text-on-surface-variant mt-1">
          Here's an overview of your portal.
        </p>
      </div>

    </div>
  );
}
