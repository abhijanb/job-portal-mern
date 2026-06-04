import { useEffect, useState } from "react";
import JobListItem from "./JobListItem";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { JobSearchParams, JobSearchResult } from "../../jobs/api/jobApi";

interface JobListingsProps {
  data: JobSearchResult | undefined;
  isLoading: boolean;
  onSearch: (params: JobSearchParams) => void;
}

export default function JobListings({
  data,
  isLoading,
  onSearch,
}: JobListingsProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const debouncedTitle = useDebounce(title, 400);
  const debouncedLocation = useDebounce(location, 400);

  const jobs = data?.data;

  useEffect(() => {
    if (!debouncedTitle && !debouncedLocation) return;
    onSearch({
      title: debouncedTitle || undefined,
      location: debouncedLocation || undefined,
      page: 1,
      limit: 12,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedLocation]);

  const handleApply = () => {
    const params = { title, location, type, experience, salaryMin, salaryMax };
    const hasFilters = Object.values(params).some((v) => v && v.length > 0);
    if (!hasFilters) return;
    onSearch({
      title: title || undefined,
      location: location || undefined,
      type: type || undefined,
      experience: experience || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      page: 1,
      limit: 12,
    });
  };

  const handleClear = () => {
    setTitle("");
    setLocation("");
    setType("");
    setExperience("");
    setSalaryMin("");
    setSalaryMax("");
    onSearch({ page: 1, limit: 12 });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-6">
      <aside className="md:col-span-3 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Filters</h3>
          <button
            className="text-xs font-medium text-secondary hover:underline"
            onClick={handleClear}
          >
            Clear all
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Search
          </label>
          <input
            className="w-full border border-outline-variant rounded-lg p-2 text-sm bg-surface-container-lowest outline-none focus:border-secondary transition-colors"
            placeholder="Job title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border border-outline-variant rounded-lg p-2 text-sm bg-surface-container-lowest outline-none focus:border-secondary transition-colors"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-4">
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Salary Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-outline-variant rounded-lg p-1 bg-surface-container-lowest">
              <span className="text-xs text-on-surface-variant px-1">Min</span>
              <input
                className="w-full border-none p-1 focus:ring-0 text-sm font-semibold bg-transparent outline-none"
                type="text"
                placeholder="$0"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
            </div>
            <div className="border border-outline-variant rounded-lg p-1 bg-surface-container-lowest">
              <span className="text-xs text-on-surface-variant px-1">Max</span>
              <input
                className="w-full border-none p-1 focus:ring-0 text-sm font-semibold bg-transparent outline-none"
                type="text"
                placeholder="$300k"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div className="space-y-4">
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Job Type
          </label>
          <div className="space-y-2">
            {[
              { value: "FULL_TIME", label: "Full-time" },
              { value: "REMOTE", label: "Remote" },
              { value: "CONTRACT", label: "Contract" },
              { value: "INTERNSHIP", label: "Internship" },
              { value: "PART_TIME", label: "Part-time" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <input
                  checked={type === value}
                  onChange={() => setType(type === value ? "" : value)}
                  className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary focus:ring-offset-0"
                  type="checkbox"
                />
                <span className="text-base group-hover:text-on-surface transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-4">
          <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Experience Level
          </label>
          <div className="space-y-2">
            {[
              { value: "entry", label: "Entry Level" },
              { value: "mid", label: "Mid-Senior" },
              { value: "exec", label: "Director/Executive" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <input
                  checked={experience === value}
                  onChange={() =>
                    setExperience(experience === value ? "" : value)
                  }
                  className="w-5 h-5 border-outline-variant text-secondary focus:ring-secondary"
                  name="exp"
                  type="radio"
                  value={value}
                />
                <span className="text-base group-hover:text-on-surface transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold hover:brightness-110 transition-all"
        >
          Apply Filters
        </button>
      </aside>

      {/* Main Feed */}
      <section className="md:col-span-9">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            {(jobs?.length ?? 0).toLocaleString()} Available Opportunities
          </h2>
        </div>

        {isLoading ? (
          <p className="text-on-surface-variant text-center py-12">
            Loading jobs...
          </p>
        ) : !jobs || jobs.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">
            No jobs found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <JobListItem key={job.id} job={job} />
            ))}
          </div>
        )}

        {jobs && jobs.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <span className="text-sm text-on-surface-variant">
              Showing {jobs.length} results
            </span>
          </div>
        )}
      </section>
    </section>
  );
}
