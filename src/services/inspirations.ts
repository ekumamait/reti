import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { customError, InspirationsResponseType } from "./types.ts";
import { getHeaders } from "../utils.ts";

export const inspirationApi = createApi({
    reducerPath: 'inspirationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`
    }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['Inspirations'],
    endpoints: ({ mutation, query }) => ({
        getInspirations: query<InspirationsResponseType, void>({
            query: () => ({
                url: 'inspirations',
                method: 'GET',
                headers: getHeaders(),
            }),
            providesTags: ['Inspirations'],
        }),
        getMentorInspirations: query<InspirationsResponseType, void>({
            query: () => ({
                url: 'inspirations/mentor',
                method: 'GET',
                headers: getHeaders(),
            }),
            providesTags: ['Inspirations'],
        }),
        useLikeInspirationMutation: query<InspirationsResponseType, void>({
            query: () => ({
                url: 'inspirations/mentor',
                method: 'POST',
                headers: getHeaders(),
            }),
            providesTags: ['Inspirations'],
        }),
        addInspiration: mutation<void, any>({
            query: (body) => ({
                url: 'inspirations',
                method: 'POST',
                headers: getHeaders(),
                body,
            }),
            invalidatesTags: ['Inspirations'],
        }),
        likeInspiration: mutation<void,number>({
            query: (id) => ({
                url: `inspirations/${id}/like`,
                method: 'PUT',
                headers: getHeaders(),
            }),
            invalidatesTags: ['Inspirations'],
        }),
        updateInspiration: mutation<void, { id: number; body: any }>({
            query: ({ id, body }) => ({
                url: `inspirations/${id}`,
                method: 'PATCH',
                headers: getHeaders(),
                body,
            }),
            invalidatesTags: ['Inspirations'],
        }),
        deleteInspiration: mutation<void, number>({
            query: (id) => ({
                url: `inspirations/${id}`,
                method: 'DELETE',
                headers: getHeaders(),
            }),
            invalidatesTags: ['Inspirations'],
        }),
    }),
});

export const {
    useGetInspirationsQuery,
    useAddInspirationMutation,
    useUpdateInspirationMutation,
    useDeleteInspirationMutation,
    useLikeInspirationMutation,
    useGetMentorInspirationsQuery,
} = inspirationApi;
