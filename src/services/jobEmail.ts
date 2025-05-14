import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { customError } from "./types.ts";
import { getAccessToken } from "../utils.ts";

export const jobEmailApi = createApi({
    reducerPath: 'jobEmailApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`,
        prepareHeaders: (headers) => {
            const token = getAccessToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['JobEmail'],
    endpoints: ({ mutation, query }) => ({
        sendJobEmail: mutation<any, FormData>({
            query: (formData) => ({
              url: `jobemail`,
              method: 'POST',
              body: formData,
            }),
            invalidatesTags: ['JobEmail'],
          }),
          
        hasUserApplied: query<{ hasApplied: boolean }, number>({
            query: (jobId) => ({
                url: `jobemail/applied/${jobId}`, 
                method: "GET",
            }),
        }),
        shareProfileByEmail: mutation<any, FormData>({
            query: (formData) => ({
              url: `jobemail/share-profile`,
              method: "POST",
              body: formData,
            }),
          }),
          
          
    }),
});

export const {
    useSendJobEmailMutation,
    useHasUserAppliedQuery,
    useShareProfileByEmailMutation
} = jobEmailApi;
