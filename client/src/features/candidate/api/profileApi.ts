import { baseApi } from "../../../shared/api/baseApi";
import type { Profile, Experience, Education } from "../../../shared/types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => "/profile",
      transformResponse: (response: { success: true; data: Profile }) => response.data,
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<Profile, Record<string, unknown>>({
      query: (body) => ({ url: "/profile", method: "PUT", body }),
      transformResponse: (response: { success: true; data: Profile }) => response.data,
      invalidatesTags: ["Profile"],
    }),

    createExperience: builder.mutation<Experience, Record<string, unknown>>({
      query: (body) => ({ url: "/profile/experiences", method: "POST", body }),
      transformResponse: (response: { success: true; data: Experience }) => response.data,
      invalidatesTags: ["Profile"],
    }),
    updateExperience: builder.mutation<Experience, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({ url: `/profile/experiences/${id}`, method: "PUT", body: data }),
      transformResponse: (response: { success: true; data: Experience }) => response.data,
      invalidatesTags: ["Profile"],
    }),
    deleteExperience: builder.mutation<void, string>({
      query: (id) => ({ url: `/profile/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: ["Profile"],
    }),

    createEducation: builder.mutation<Education, Record<string, unknown>>({
      query: (body) => ({ url: "/profile/educations", method: "POST", body }),
      transformResponse: (response: { success: true; data: Education }) => response.data,
      invalidatesTags: ["Profile"],
    }),
    updateEducation: builder.mutation<Education, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({ url: `/profile/educations/${id}`, method: "PUT", body: data }),
      transformResponse: (response: { success: true; data: Education }) => response.data,
      invalidatesTags: ["Profile"],
    }),
    deleteEducation: builder.mutation<void, string>({
      query: (id) => ({ url: `/profile/educations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Profile"],
    }),

    getProfileByUserId: builder.query<Profile, string>({
      query: (userId) => `/profile/${userId}`,
      transformResponse: (response: { success: true; data: Profile }) => response.data,
    }),
    uploadResume: builder.mutation<Profile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return { url: "/profile/resume", method: "POST", body: formData };
      },
      transformResponse: (response: { success: true; data: Profile }) => response.data,
      invalidatesTags: ["Profile"],
    }),

    uploadAvatar: builder.mutation<Profile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return { url: "/profile/avatar", method: "POST", body: formData };
      },
      transformResponse: (response: { success: true; data: Profile }) => response.data,
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetProfileByUserIdQuery,
  useUpdateProfileMutation,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUploadResumeMutation,
  useUploadAvatarMutation,
} = profileApi;
