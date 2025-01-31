import { SearchOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import { useGetUserProfileQuery } from "../../../services/profiles";
import { ConversationType } from "../../../services/types";

const MessagingChats = ({
  conversations,
  userId,
  onConversationClick,
}: {
  conversations: ConversationType[];
  userId: number | null;
  onConversationClick: (conversation: ConversationType) => void;
}) => {
  if (
    !conversations ||
    conversations.length === 0 ||
    !conversations[0].messages ||
    conversations[0].messages.length === 0
  ) {
    return <div>No conversations available</div>;
  }

  return (
    <>
      {/* messages */}
      <div className="sm:w-6/12 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg/6 truncate font-semibold text-gray-900">
              Messages
            </h2>
            <Badge
              className="site-badge-count-109"
              count="2"
              style={{ backgroundColor: "#189bcc " }}
            />
          </div>

          <div>
            <Button shape="circle" icon={<SearchOutlined />} />
          </div>
        </div>

        <div className="h-[550px] xl:h-screen overflow-y-auto">
          <ul role="list" className="divide-y divide-gray-100">
            {conversations?.map((conversation) => {
              const lastMessage =
                conversation?.messages[conversation?.messages?.length - 1];
              const receiverId = conversation?.messages?.find(
                (msg: any) => msg.senderId !== userId
              )?.senderId;

              const { data } = useGetUserProfileQuery(receiverId);

              return (
                <li
                  key={conversation.id}
                  className="flex justify-between gap-x-2 py-5 px-4 hover:bg-gray-50"
                  onClick={() => onConversationClick(conversation)}
                >
                  <div className="flex min-w-0 gap-x-4">
                    <img
                      alt=""
                      src="https://via.placeholder.com/150"
                      className="size-8 flex-none rounded-full bg-gray-50"
                    />
                    <div className="min-w-0 flex-auto">
                      <p
                        className={`text-sm/6 truncate font-semibold ${
                          lastMessage.isRead ? "text-gray-900" : "text-blue-600"
                        }`}
                      >
                        {data?.data?.user?.firstName
                          ? `${data.data.user.firstName} ${data.data.user.lastName}`
                          : `User ${receiverId}`}
                      </p>
                      <p className="mt-1 truncate text-xs/5 text-gray-500">
                        {lastMessage.content}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="mt-1 text-xs/5 text-gray-500">
                      <time dateTime={lastMessage.createdAt}>
                        {new Date(lastMessage.createdAt).toLocaleTimeString()}
                      </time>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MessagingChats;
