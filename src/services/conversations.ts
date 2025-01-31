import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import {
  customError,
  MessagesResponseType,
  ConversationDetailsResponseType,
  ConversationsResponseType,
  ConversationType,
  Message,
} from "./types.ts";
import { getHeaders } from "../utils.ts";


// Create the API
export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`,
  }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
  tagTypes: ["Conversations"],
  endpoints: ({ mutation, query }) => ({
    // Get all conversations
    getConversations: query<ConversationsResponseType, void>({
      query: () => ({
        url: "conversations",
        method: "GET",
        headers: getHeaders(),
      }),
      providesTags: ["Conversations"],
    }),

    // Get single conversation details
    getConversationDetails: query<ConversationDetailsResponseType, string>({
      query: (conversationId) => ({
        url: `conversations/${conversationId}`,
        method: "GET",
        headers: getHeaders(),
      }),
      providesTags: ["Conversations"],
    }),

    // Get user conversations
    getUserConversations: query<ConversationDetailsResponseType, number>({
        query: (userId) => ({
          url: `conversations/user`,
          method: "GET",
          headers: getHeaders(),
        }),
        providesTags: ["Conversations"],
      }),

    // Get messages for a conversation
    getMessages: query<MessagesResponseType, string>({
      query: (conversationId) => ({
        url: `conversations/${conversationId}/messages`,
        method: "GET",
        headers: getHeaders(),
      }),
      providesTags: ["Conversations"],
    }),

    // Send a message
    sendMessage: mutation<Message, { conversationId: string; content: string }>(
      {
        query: ({ conversationId, content }) => ({
          url: `conversations/${conversationId}/messages`,
          method: "POST",
          headers: getHeaders(),
          body: { content },
        }),
        invalidatesTags: ["Conversations"],
      }
    ),

    // Create a new conversation
    createConversation: mutation<ConversationType, { participants: string[] }>({
      query: (data) => ({
        url: "conversations",
        method: "POST",
        headers: getHeaders(),
        body: data,
      }),
      invalidatesTags: ["Conversations"],
    }),

    // Delete a conversation
    deleteConversation: mutation<void, string>({
      query: (conversationId) => ({
        url: `conversations/${conversationId}`,
        method: "DELETE",
        headers: getHeaders(),
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

// Export hooks
export const {
  useGetConversationsQuery,
  useGetConversationDetailsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useGetUserConversationsQuery,
} = conversationApi;
