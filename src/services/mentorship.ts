import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { customError } from "./types.ts";
import { getHeaders } from "../utils.ts";

export const mentorshipApi = createApi({
    reducerPath: 'mentorshipApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`
    }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['Mentorship'],
    endpoints: (builder) => ({
        getMentorshipSessions: builder.query<any, string>({
            query: (role) => ({
                url: `mentorship-sessions/${role}`,
                method: 'GET',
                headers: getHeaders(),
            }),
            providesTags: ['Mentorship'],
        }),
        createMentorshipSession: builder.mutation<any, any>({
            query: (data) => ({
                url: 'mentorship-sessions',
                method: 'POST',
                body: data,
                headers: getHeaders(),
            }),
            invalidatesTags: ['Mentorship'],
        }),
        updateMentorshipSession: builder.mutation<any, { sessionId: number; body: any }>({
            query: ({sessionId, data}) => ({
                url: `mentorship-sessions/${sessionId}`,
                method: 'PATCH',
                body: data,
                headers: getHeaders(),
            }),
            invalidatesTags: ['Mentorship'],
        }),
        deleteMentorshipSession: builder.mutation<any, any>({
            query: (sessionId) => ({
                url: `mentorship-sessions/${sessionId}`,
                method: 'DELETE',
                headers: getHeaders(),
            }),
            invalidatesTags: ['Mentorship'],
        }),
    }),
});

export const {
    useGetMentorshipSessionsQuery,
    useCreateMentorshipSessionMutation,
    useUpdateMentorshipSessionMutation,
    useDeleteMentorshipSessionMutation,
} = mentorshipApi;