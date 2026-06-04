import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-base text-on-surface-variant mt-1">Here is an overview of your current hiring activity.</p>
      </div>
      <div className="flex gap-4">
      
        <Link
          to="/jobs/create"
          className="px-6 py-2 bg-secondary text-on-secondary rounded-lg text-sm font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Post New Job
        </Link>
      </div>
    </section>
  );
}
