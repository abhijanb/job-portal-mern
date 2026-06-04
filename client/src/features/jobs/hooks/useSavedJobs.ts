import toast from "react-hot-toast";
import type { Job } from "../../../shared/types";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  useGetSavedJobsQuery,
  useSaveJobMutation,
  useRemoveSavedJobMutation,
} from "../../candidate/api/savedJobApi";

export function useSavedJobs(job: Job | null | undefined) {
  const { isAuthenticated } = useAuth();

  const { data: savedJobs } = useGetSavedJobsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [saveJob, { isLoading: saving }] = useSaveJobMutation();
  const [removeSavedJob, { isLoading: removing }] = useRemoveSavedJobMutation();

  const saved = !!savedJobs?.some((s) => s.jobId === job?.id);

  const toggleSave = async () => {
    if (!job) return;
    if (!isAuthenticated) {
      toast.error("Sign in to save jobs.");
      return;
    }
    try {
      if (saved) {
        await removeSavedJob(job.id).unwrap();
        toast.success("Removed from saved jobs");
      } else {
        await saveJob(job.id).unwrap();
        toast.success("Job saved");
      }
    } catch {
      toast.error("Failed to update saved jobs.");
    }
  };

  return { saved, toggleSave, loading: saving || removing };
}
