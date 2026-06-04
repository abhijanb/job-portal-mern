import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <FileSearch size={56} className="text-outline-variant" />
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-lg text-on-surface-variant">This page doesn't exist.</p>
      <div className="flex gap-3 mt-2">
        <Link to="/" className="px-5 py-2 bg-secondary text-on-secondary rounded-xl text-sm font-bold hover:brightness-110 transition-all">
          Go Home
        </Link>
        <Link to="/jobs" className="px-5 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
