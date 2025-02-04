import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { LoginResponseType, User, customError } from "./types.ts";
import { getAccessToken, getHeaders } from "../utils.ts";

export const supportApi = createApi({
    reducerPath: 'supportApi',
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
    tagTypes: ['Support'],
    endpoints: ({mutation}) => ({
        sendSupportRequest: mutation<LoginResponseType, { contact: string; description: string }>({
            query: (requestBody) => {
                return {
                    url: `support`,
                    method: 'POST',
                    body: requestBody,
                    headers: getAccessToken() ? getHeaders() : undefined,
                }
            },
            invalidatesTags: ['Support'],
        }),
    }),
});

export const {
    useSendSupportRequestMutation,
} = supportApi;
