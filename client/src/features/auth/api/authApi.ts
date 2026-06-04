import { baseApi } from "../../../shared/api/baseApi";
import type { RegisterRequest, LoginRequest, AuthResponse } from "../../../shared/schemas/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: true; data: AuthResponse }) => response.data,
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: true; data: AuthResponse }) => response.data,
    }),
    getMe: builder.query<AuthResponse["user"], void>({
      query: () => "/auth/me",
      transformResponse: (response: { success: true; data: { user: AuthResponse["user"] } }) => response.data.user,
    }),
    logout: builder.mutation<{ message?: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery, useLazyGetMeQuery, useLogoutMutation } = authApi;
