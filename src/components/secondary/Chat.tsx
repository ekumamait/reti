import {
  CheckOutlined,
  DownOutlined,
  LeftOutlined,
  MessageOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Badge, Card } from "antd";
import MessagingChatDetails from "../../layouts/DashboardPages/Messaging/MessageChatDetails";
import { loginDetails } from "../../utils";
import { useGetUserConversationsQuery } from "../../services/conversations";
import { io } from "socket.io-client";
import { useProfiles } from "../../hooks/useProfiles";
import { useEffect, useState } from "react";
import Loader from "../../layouts/loader";

export default function Chat({ receiverId }: { receiverId?: number }) {
  const user = loginDetails();
  const userId = user.user.id;
  const { data } = useGetUserConversationsQuery(userId);
  const [conversations, setConversations] = useState<any>([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isChatsVisible, setIsChatsVisible] = useState(false);
  const { profiles, isLoading: profilesLoading } = useProfiles(conversations);
  const [onlineUsers, setOnlineUsers] = useState({});

  const getReceiverProfile = (conversation) => {
    const lastMessage =
      conversation?.messages[conversation?.messages.length - 1];
    const otherUserId =
      lastMessage?.senderId === userId
        ? lastMessage?.receiverId
        : lastMessage?.senderId;
    return profiles?.data?.find((p) => p.userId === parseInt(otherUserId));
  };

  useEffect(() => {
    if (data) {
      setConversations(data?.data);
    }
    if (isChatsVisible) {
      const newSocket = io(`${import.meta.env.VITE_BASE_URL}`, {
        query: { token: user.access_token, userId },
      });

      setSocket(newSocket);
      newSocket.emit("user-online", { userId });
      newSocket.on("online-users", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("receiveMessage", (newMessageData: any) => {
        if (!newMessageData.data || !newMessageData.data.messages) return;
        const newMessage =
          newMessageData.data.messages[newMessageData.data.messages.length - 1];
        if (!newMessage) {
          return;
        }

        setConversations((prevConversations) => {
          const matchingConversation = prevConversations.find((conv) =>
            conv.messages.some(
              (msg) =>
                (msg.senderId === newMessage.senderId &&
                  msg.receiverId === newMessage.receiverId) ||
                (msg.senderId === newMessage.receiverId &&
                  msg.receiverId === newMessage.senderId)
            )
          );

          if (!matchingConversation) {
            return [
              ...prevConversations,
              {
                id: Date.now(),
                messages: [newMessage],
                unreadCount: 1,
              },
            ];
          }

          const updatedConversations = prevConversations.map((conv) => {
            if (conv.id === matchingConversation.id) {
              return {
                ...conv,
                messages: [...conv.messages, newMessage],
                unreadCount:
                  conv.id === selectedConversation?.id
                    ? 0
                    : (conv.unreadCount || 0) + 1,
              };
            }
            return conv;
          });
          return updatedConversations;
        });
      });

      return () => {
        newSocket.emit("user-offline", { userId });
        newSocket.disconnect();
      };
    }
  }, [data, isChatsVisible, user.access_token, userId, selectedConversation]);

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  useEffect(() => {
    if (receiverId) {
      const conversation = conversations.find((conv) =>
        conv.messages.some(
          (msg) =>
            (msg.receiverId === receiverId && msg.senderId === userId) ||
            (msg.receiverId === userId && msg.senderId === receiverId)
        )
      );
      if (conversation) {
        setSelectedConversation(conversation);
        setIsChatsVisible(true);
      } else {
        setSelectedConversation({
          id: `new-${receiverId}`,
          messages: [],
          receiverId,
        });
        setIsChatsVisible(true);
      }
    }
  }, [receiverId, conversations, userId]);

  const lastMessage =
    selectedConversation?.messages[selectedConversation?.messages.length - 1];

  const determinedReceiverId =
    lastMessage?.senderId === userId
      ? lastMessage?.receiverId
      : lastMessage?.senderId;

  return (
    <div className="sm:flex items-start justify-between gap-2">
      {isChatsVisible && selectedConversation ? (
        <Card className="shadow-sm fixed bottom-0 right-0 sm:right-4 z-50 w-full sm:w-auto">
          <LeftOutlined onClick={() => setSelectedConversation(null)} />
          <MessagingChatDetails
            conversation={selectedConversation}
            socket={socket}
            userId={userId}
            online={!!onlineUsers[String(determinedReceiverId)]}
            receiverId={determinedReceiverId}
            
          />
        </Card>
      ) : (
        <div className="fixed bottom-0 right-0 sm:right-4 z-50 w-full sm:w-auto">
          <div
            className="bg-white shadow-lg cursor-pointer w-full sm:w-[750px]"
            style={{
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              className="flex items-center justify-between p-3 border-b bg-gray-50"
              onClick={() => setIsChatsVisible(!isChatsVisible)}
              style={{
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            >
              <div className="flex items-center gap-2 p-3">
                <MessageOutlined />
                <span className="font-semibold">Chats</span>
                <Badge
                  count={
                    conversations.filter((conversation) =>
                      conversation?.messages?.some((msg) => !msg?.isRead)
                    )?.length
                  }
                />
              </div>
              <div>
                {isChatsVisible ? (
                  <DownOutlined className="text-gray-600" />
                ) : (
                  <UpOutlined className="text-gray-600" />
                )}
              </div>
            </div>

            {isChatsVisible && (
              <div className="overflow-y-auto h-52">
                <ul className="space-y-2 p-4">
                  {conversations?.map((conversation) => {
                    const lastMessage =
                      conversation?.messages[conversation?.messages.length - 1];
                    const receiverProfile = getReceiverProfile(conversation);
                    const unreadCount =
                      conversation?.messages?.filter(
                        (msg) =>
                          !msg.isRead && Number(msg.receiverId) === userId
                      ).length || null;

                    return (
                      <li
                        key={conversation.id}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                        onClick={() => handleConversationClick(conversation)}
                      >
                        <div>
                          <div className="flex justify-between gap-2">
                            <div
                              className={`font-bold ${
                                lastMessage?.isRead
                                  ? "text-gray-800"
                                  : "text-blue-600"
                              }`}
                            >
                              {/* User {conversation?.id} */}
                              {profilesLoading ? (
                                <Loader />
                              ) : (
                                `${receiverProfile?.user?.firstName} ${receiverProfile?.user?.lastName}`
                              )}
                            </div>
                            <Badge
                              count={unreadCount}
                              className="hidden lg:block"
                            ></Badge>
                          </div>
                          <div className="text-gray-600 truncate flex items-center gap-0">
                            {lastMessage && (
                              <span className="inline-flex">
                                {lastMessage.isRead ? (
                                  <>
                                    <CheckOutlined className="text-gray-400 text-[10px]" />
                                    <CheckOutlined className="text-gray-400 text-[10px] mr-1" />
                                  </>
                                ) : (
                                  <CheckOutlined className="text-gray-400 text-[10px] mr-1" />
                                )}
                              </span>
                            )}
                            {lastMessage.content}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
