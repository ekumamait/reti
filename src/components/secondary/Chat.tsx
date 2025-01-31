import {
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

export default function Chat({ receiverId }) {
  const user = loginDetails();
  const userId = user.user.id;
  const { data } = useGetUserConversationsQuery(userId);
  const [conversations, setConversations] = useState<any>([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isChatsVisible, setIsChatsVisible] = useState(false);
  const { profiles, isLoading: profilesLoading } = useProfiles(conversations);

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
      return () => newSocket.disconnect();
    }
  }, [data, isChatsVisible, user.access_token, userId]);

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

  return (
    <div className="sm:flex items-start justify-between gap-2">
      {isChatsVisible && selectedConversation ? (
        <Card className="shadow-sm fixed bottom-0 right-0 sm:right-4 z-50 w-full sm:w-auto">
          <LeftOutlined onClick={() => setSelectedConversation(null)} />
          <MessagingChatDetails
            conversation={selectedConversation}
            socket={socket}
            userId={userId}
            online={true}
            receiverId={selectedConversation?.receiverId}
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
                            <div className="text-xs text-green-500">Online</div>
                          </div>
                          <div className="text-gray-600 truncate">
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
