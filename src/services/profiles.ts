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
        getUserProfile: query<any, number>({
            query: (profileId) => ({
                url: `profiles/${profileId}`,
                method: "GET",
                headers: getHeaders(),
            }),
            transformResponse: (response: ProfileResponseType) => response,
        }),
        getAllProfiles: query<any, void>({
            query: () => ({
                url: `profiles`,
                method: "GET",
                headers: getHeaders(),
            }),
            invalidatesTags: ['Profiles'],
        }),
        updateProfile: mutation<LoginResponseType,  { profile: Partial<User>; profileId: string }>({
            query: ({ profile, profileId }) => ({
                url: `profiles/${profileId}`,
                method: 'PATCH',
                body: profile,
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
    useGetAllProfilesQuery,
    useUpdateProfileMutation,
} = profileApi;
