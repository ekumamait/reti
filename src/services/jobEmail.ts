import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { customError } from "./types.ts";
import { getAccessToken, getHeaders } from "../utils.ts";

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
    endpoints: ({ mutation }) => ({
        sendJobEmail: mutation<any, { employerEmail: string; jobTitle: string; }>({
            query: (requestBody) => ({
                url: `jobemail`,
                method: 'POST',
                body: requestBody,
            }),
            invalidatesTags: ['JobEmail'],
        }),
    }),
});

export const {
    useSendJobEmailMutation,
} = jobEmailApi;
