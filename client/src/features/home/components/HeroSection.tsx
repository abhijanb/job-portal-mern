import { useForm } from "react-hook-form";
import { Search, MapPin, Filter } from "lucide-react";
import type { JobSearchParams } from "../../jobs/api/jobApi";

interface SearchFormValues {
  title: string;
  location: string;
  type: string;
}

interface HeroSectionProps {
  onSearch: (params: JobSearchParams) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { register, handleSubmit } = useForm<SearchFormValues>({
    defaultValues: {
      title: "",
      location: "",
      type: "",
    },
  });

  const handleSearch = ({ title, location, type }: SearchFormValues) => {
    onSearch({
      title: title.trim() || undefined,
      location: location.trim() || undefined,
      type: type || undefined,
    });
  };

  return (
    <section className="bg-surface-container-low py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">
          Your Career Evolution Starts Here
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
          Connect with leading global companies and high-growth startups hiring professionals like you.
        </p>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-2 max-w-4xl mx-auto flex flex-col md:flex-row gap-1 items-center border border-outline-variant transition-all">
          <div className="flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-outline-variant h-12">
            <Search className="text-on-surface-variant mr-2 shrink-0" size={20} />
            <input
              className="w-full border-none focus:ring-0 text-base bg-transparent outline-none"
              placeholder="Job Title, Keyword..."
              type="text"
              {...register("title")}
            />
          </div>
          <div className="flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-outline-variant h-12">
            <MapPin className="text-on-surface-variant mr-2 shrink-0" size={20} />
            <input
              className="w-full border-none focus:ring-0 text-base bg-transparent outline-none"
              placeholder="City or Remote"
              type="text"
              {...register("location")}
            />
          </div>
          <div className="flex items-center px-4 w-full h-12">
            <Filter className="text-on-surface-variant mr-2 shrink-0" size={20} />
            <select
              className="w-full border-none focus:ring-0 text-base bg-transparent outline-none appearance-none"
              {...register("type")}
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="REMOTE">Remote</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
          <button
            className="bg-secondary text-on-secondary px-12 h-12 rounded-lg font-bold hover:brightness-110 transition-all whitespace-nowrap w-full md:w-auto flex items-center justify-center"
            type="submit"
            onClick={handleSubmit(handleSearch)}
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
