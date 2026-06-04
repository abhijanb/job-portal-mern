import { baseApi } from "../../../shared/api/baseApi";
import type { Job } from "../../../shared/types";

export interface JobStats {
  activeJobs: number;
  totalApplications: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobSearchParams {
  title?: string;
  location?: string;
  type?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export interface JobSearchResult {
  data: Job[];
  pagination: Pagination;
}

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobSearchResult, JobSearchParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.title) searchParams.set("title", params.title);
        if (params?.location) searchParams.set("location", params.location);
        if (params?.type) searchParams.set("type", params.type);
        if (params?.experience)
          searchParams.set("experience", params.experience);
        if (params?.salaryMin !== undefined)
          searchParams.set("salaryMin", String(params.salaryMin));
        if (params?.salaryMax !== undefined)
          searchParams.set("salaryMax", String(params.salaryMax));
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));

        const queryString = searchParams.toString();
        return queryString ? `/jobs?${queryString}` : "/jobs?page=1&limit=12";
      },
      transformResponse: (response: {
        success: true;
        data: Job[];
        pagination: Pagination;
      }) => ({
        data: response.data,
        pagination: response.pagination,
      }),
      providesTags: ["Jobs"],
    }),
    getJob: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response: { success: true; data: Job }) =>
        response.data,
      providesTags: (_result, _err, id) => [{ type: "Jobs", id }],
    }),
    getJobsByCompany: builder.query<Job[], string>({
      query: (companyId) => `/jobs/company/${companyId}`,
      transformResponse: (response: { success: true; data: Job[] }) =>
        response.data,
      providesTags: ["Jobs"],
    }),
    getJobStats: builder.query<JobStats, void>({
      query: () => "/jobs/stats",
      transformResponse: (response: { success: true; data: JobStats }) =>
        response.data,
      providesTags: ["Jobs"],
    }),
    createJob: builder.mutation<Job, Record<string, unknown>>({
      query: (body) => ({ url: "/jobs", method: "POST", body }),
      invalidatesTags: ["Jobs"],
    }),
    updateJob: builder.mutation<
      Job,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Jobs"],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({ url: `/jobs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useLazyGetJobsQuery,
  useGetJobQuery,
  useGetJobsByCompanyQuery,
  useGetJobStatsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
