import { baseApi } from "../../../shared/api/baseApi";
import type { Application } from "../../../shared/types";

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    apply: builder.mutation<
      Application,
      { jobId: string; coverLetter?: string }
    >({
      query: (body) => ({ url: "/applications", method: "POST", body }),
      transformResponse: (response: { success: true; data: Application }) =>
        response.data,
      invalidatesTags: ["Applications"],
    }),
    getMyApplications: builder.query<Application[], void>({
      query: () => "/applications/mine",
      transformResponse: (response: { success: true; data: Application[] }) =>
        response.data,
      providesTags: ["Applications"],
    }),
    getCompanyApplications: builder.query<Application[], void>({
      query: () => "/applications/company",
      transformResponse: (response: { success: true; data: Application[] }) =>
        response.data,
      providesTags: ["Applications"],
    }),
    getJobApplications: builder.query<Application[], string>({
      query: (jobId) => `/applications/job/${jobId}`,
      transformResponse: (response: { success: true; data: Application[] }) =>
        response.data,
      providesTags: ["Applications"],
    }),
    updateApplicationStatus: builder.mutation<
      Application,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: { success: true; data: Application }) =>
        response.data,
      invalidatesTags: ["Applications"],
    }),
  }),
});

export const {
  useApplyMutation,
  useGetMyApplicationsQuery,
  useGetCompanyApplicationsQuery,
  useGetJobApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = applicationApi;
