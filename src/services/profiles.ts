import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { ProfileResponseType, LoginResponseType, User, customError } from "./types.ts";
import { getAccessToken, getHeaders } from "../utils.ts";

export const profileApi = createApi({
    reducerPath: 'profileApi',
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
    tagTypes: ['Profiles'],
    endpoints: ({query, mutation}) => ({
        getUserProfile: query<ProfileResponseType, number>({
            query: (profileId) => ({
                url: `profiles/${profileId}`,
                method: "GET",
                headers: getHeaders(),
            }),
            transformResponse: (response: ProfileResponseType) => response,
        }),
        updateProfile: mutation<LoginResponseType, { data: User; profileId: string }>({
            query: ({ data, profileId }) => ({
                url: `profiles/${profileId}`,
                method: 'PATCH',
                body: data,
                headers: getHeaders(),
            }),
            invalidatesTags: ['Profiles'],
            transformResponse: (response: LoginResponseType) => response,
            transformErrorResponse: (response) => {
                return response;
            },
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateProfileMutation,
} = profileApi;
