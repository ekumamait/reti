import { useEffect, useState } from "react";
import Layout, { Content } from "antd/es/layout/layout";
import MessagingChats from "./MessagesChats";
import MessagingChatDetails from "./MessageChatDetails";
import MessagingItemDetails from "./MessageItemDetails";
import Header from "../../../components/secondary/Header";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import io from "socket.io-client";
import { useGetUserConversationsQuery } from "../../../services/conversations";
import { ConversationType } from "../../../services/types";
import { loginDetails } from "../../../utils";

const MessagesPage = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [online, setOnline] = useState<boolean>(false);

  const user = loginDetails();
  const userId = user.user.id;
  const { data } = useGetUserConversationsQuery(userId);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BASE_URL}`, {
      query: { token: user.access_token, userId: userId },
    });
    socket.on("connect", () => {
      setOnline(true);
    });
    socket.on("receiveMessage", (conversation: ConversationType) => {
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations?.map((conv) => {
          if (conv.id === conversation.id) {
            return { ...conv, messages: conversation.messages };
          }
          return conv;
        });
        return updatedConversations;
      });
    });
    setSocket(socket);

    if (data) {
      setConversations(data?.data);
    }
    return () => {
      socket.disconnect();
    };
  }, [data, user.access_token, userId]);

  const handleConversationClick = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
  };
  return (
    <>
      <Header pageTitle="Messaging" />

      <CustomDashboardLayout>
        <Layout>
          <Content className="bg-white mt-2 border border-gray-900/10 rounded-lg">
            <div className="sm:flex">
              <MessagingChats
                conversations={conversations}
                onConversationClick={handleConversationClick}
                userId={userId}
              />
              <MessagingChatDetails
                conversation={selectedConversation}
                socket={socket}
                userId={userId}
                online={online}
              />
              {/* <MessagingItemDetails /> */}
            </div>
          </Content>
        </Layout>
      </CustomDashboardLayout>
    </>
  );
};

export default MessagesPage;
