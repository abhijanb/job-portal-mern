import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import JobListings from "../components/JobListings";
import { useLazyGetJobsQuery } from "../../jobs/api/jobApi";
import type { JobSearchParams } from "../../jobs/api/jobApi";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [triggerJobs, { data, isLoading }] = useLazyGetJobsQuery();

  const onSearch = useCallback(
    (params: JobSearchParams) => {
      const hasFilters = Object.values(params).some(
        (v) => v !== undefined && v !== "",
      );
      if (!hasFilters) {
        triggerJobs({ page: 1, limit: 12 });
        return;
      }
      triggerJobs({ ...params, page: 1, limit: 12 });
    },
    [triggerJobs],
  );

  useEffect(() => {
    const title = searchParams.get("title");
    if (title) {
      triggerJobs({ title, page: 1, limit: 12 });
    } else {
      triggerJobs({ page: 1, limit: 12 });
    }
  }, [searchParams, triggerJobs]);

  return (
    <>
      <HeroSection onSearch={onSearch} />
      <JobListings data={data} isLoading={isLoading} onSearch={onSearch} />
    </>
  );
}
