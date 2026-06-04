import { baseApi } from "../../../shared/api/baseApi";
import type { Company } from "../../../shared/types";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query<Company, string>({
      query: (id) => `/companies/${id}`,
      transformResponse: (response: { success: true; data: Company }) =>
        response.data,
      providesTags: (_result, _err, id) => [{ type: "Company" as const, id }],
    }),
    createCompany: builder.mutation<Company, Record<string, unknown>>({
      query: (body) => ({ url: "/companies", method: "POST", body }),
      invalidatesTags: [{ type: "Company" as const, id: "LIST" }],
    }),
    updateCompany: builder.mutation<
      Company,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Company" as const, id },
      ],
    }),
  }),
});

export const {
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
