import {createApi, fetchBaseQuery, BaseQueryFn, FetchArgs} from "@reduxjs/toolkit/query/react"
import {customError, LoginResponseType, ProfileResponseType} from "./types.ts";
import {getAccessToken, getRefreshToken, updateTokens, handleLogout, getHeaders} from "../utils.ts";

interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    role?: string;
    aboutMe?: string;
    profilePicture?: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`,
    prepareHeaders: (headers) => {
        const token = getAccessToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, customError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to get a new token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            handleLogout();
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: 'auth/refresh',
                method: 'POST',
                body: { refresh_token: refreshToken },
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { access_token, refresh_token } = refreshResult.data as { access_token: string, refresh_token: string };
            // Store the new tokens
            updateTokens(access_token, refresh_token);

            // Retry the original request
            result = await baseQuery(args, api, extraOptions);
        } else {
            handleLogout();
        }
    }

    return result;
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users'],
    endpoints: ({mutation, query}) => ({
        login: mutation<LoginResponseType, void>({
            query: (data) => ({
                url: 'auth/login',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response) => response,
            transformErrorResponse: (
                response
            ) => response,
        }),
        register: mutation<LoginResponseType, User>({
            query: (data) => ({
                url: 'users',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response) => response,
            transformErrorResponse: (
                response
            ) => response,
        }),
        getAllUsers: query<ProfileResponseType, void>({
            query: () => ({
                url: `/users/`,
                method: "GET",
                headers: getHeaders(),
            }),
        }),
        deleteUser: mutation<ProfileResponseType, number>({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
                headers: getHeaders(),
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation
} = userApi
