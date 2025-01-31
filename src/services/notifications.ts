import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { customError, NotificationResponse, CreateNotificationRequest, Notification } from "./types.ts";
import { getHeaders } from "../utils.ts";

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`
    }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationResponse, void>({
            query: () => ({
                url: 'notifications',
                method: 'GET',
                headers: getHeaders(),
            }),
            providesTags: ['Notifications'],
        }),

        createNotification: builder.mutation<Notification, CreateNotificationRequest>({
            query: (data) => ({
                url: 'notifications',
                method: 'POST',
                body: data,
                headers: getHeaders(),
            }),
            invalidatesTags: ['Notifications'],
        }),

        markAsRead: builder.mutation<void, number>({
            query: (notificationId) => ({
                url: `notifications/${notificationId}/read`,
                method: 'PATCH',
                headers: getHeaders(),
            }),
            invalidatesTags: ['Notifications'],
        }),

        deleteNotification: builder.mutation<void, number>({
            query: (notificationId) => ({
                url: `notifications/${notificationId}`,
                method: 'DELETE',
                headers: getHeaders(),
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
} = notificationApi;
