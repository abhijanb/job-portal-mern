import { baseApi } from "../../../shared/api/baseApi";
import type { SavedJob } from "../../../shared/types";

export const savedJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedJobs: builder.query<SavedJob[], void>({
      query: () => "/saved-jobs",
      transformResponse: (response: { success: true; data: SavedJob[] }) =>
        response.data,
      providesTags: ["SavedJobs"],
    }),
    saveJob: builder.mutation<SavedJob, string>({
      query: (jobId) => ({
        url: "/saved-jobs",
        method: "POST",
        body: { jobId },
      }),
      transformResponse: (response: { success: true; data: SavedJob }) =>
        response.data,
      invalidatesTags: ["SavedJobs"],
    }),
    removeSavedJob: builder.mutation<void, string>({
      query: (jobId) => ({ url: `/saved-jobs/${jobId}`, method: "DELETE" }),
      invalidatesTags: ["SavedJobs"],
    }),
  }),
});

export const {
  useGetSavedJobsQuery,
  useSaveJobMutation,
  useRemoveSavedJobMutation,
} = savedJobApi;
