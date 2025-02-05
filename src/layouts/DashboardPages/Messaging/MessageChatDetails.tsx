import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useGetUserProfileQuery } from "../../../services/profiles";
import { Message } from "../../../services/types";
import { formatRelativeTime } from "../../../utils";
import { useMarkMessageAsReadMutation } from "../../../services/conversations";

const MessagingChatDetails = ({
  conversation,
  socket,
  userId,
  online,
  receiverId: propReceiverId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { data } = useGetUserProfileQuery(propReceiverId, { skip: !propReceiverId });
  const [markMessageAsRead] = useMarkMessageAsReadMutation();

  useEffect(() => {
    if (conversation) {
      setMessages(conversation?.messages || []);
    }
    if (socket) {
      socket.on("receiveMessage", (updatedConversation: any) => {
        if (updatedConversation.id === conversation.id) {
          setMessages(updatedConversation.messages);
        }
      });
      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [conversation, socket]);

  const receiverId =
    propReceiverId ||
    conversation?.messages?.find(
      (msg: Message) => Number(msg.senderId) !== userId
    )?.senderId ||
    conversation?.messages?.find(
      (msg: Message) => Number(msg.senderId) === userId
    )?.receiverId;

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const message = {
      senderId: Number(userId),
      receiverId: Number(receiverId),
      content: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prevMessages) => [...prevMessages, message]);
    if (socket) {
      socket.emit("sendMessage", { messages: [message] });
    }
    setNewMessage("");
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    const markConversationAsRead = async () => {
      if (!conversation?.id || !userId) return;
      const convoId = conversation.id;
      const response = await markMessageAsRead(convoId).unwrap();
      if (response) {
        setMessages(prev => prev.map(msg => ({
          ...msg,
          isRead: Number(msg.receiverId) === userId ? msg.isRead : true
        })));
      }
    };

    markConversationAsRead();
  }, [conversation?.id, userId]); 

  return (
    <div className="h-full w-full sm:w-[710px]">
      {/* typing */}
      <div className="sm:w-11/12">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between w-full sm:w-[710px]">
          <h2 className="text-lg/6 truncate font-semibold text-gray-900">
            {data?.data?.user?.firstName
              ? `${data.data.user.firstName} ${data.data.user.lastName}`
              : " "}
          </h2>
          <div className="flex items-center justify-center gap-x-1.5">
            {online ? (
              <p className="text-xs/5 text-green-500">online</p>
            ) : (
              <p className="text-xs/5 text-red-500">offline</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="p-4 h-[400px] w-full sm:w-[710px] overflow-y-auto bg-gray-50">
          {/* Example messages */}
          <h2 className="pb-8 text-xs flex items-center justify-center">
            Today
          </h2>

          {/* Display messages */}
          {sortedMessages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${Number(msg.senderId) === userId ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`relative max-w-[70%] rounded-xl p-4 ${
                  Number(msg.senderId) === userId
                    ? "bg-gray-200 rounded-br-none ml-12"
                    : "bg-blue-100 rounded-bl-none mr-12 shadow-sm"
                }`}
              >
                <p className="text-gray-900 text-sm mb-2">{msg.content}</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(msg.createdAt)}
                  </span>
                  {Number(msg.senderId) === userId && (
                    <span className="flex items-center gap-0.5">
                      {msg.isRead ? (
                        <>
                          <CheckOutlined className="text-gray-400 text-[10px]" />
                          <CheckOutlined className="text-gray-400 text-[10px]" />
                        </>
                      ) : (
                        <CheckOutlined className="text-gray-400 text-[10px]" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-2 border-t border-gray-200 flex items-center justify-between w-full sm:w-[710px]">
          <TextArea
            className="p-2 mr-2 ml-2"
            placeholder="Type a message"
            autoSize
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div>
            <Button
              className="px-4 py-2"
              type="primary"
              icon={<CaretRightOutlined />}
              size="large"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingChatDetails;
