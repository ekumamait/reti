import { toast } from "react-toastify";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "../../services/notifications";
import { Button } from "antd";
import Loader from "../../layouts/loader";

const NotificationComponent = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      toast.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <>{
      isLoading ? <Loader /> :
        <div className="max-h-96 overflow-y-auto">
          {notifications?.data.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-200 hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              {!notification.isRead && (
                <Button
                  type="link"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark as read
                </Button>
              )}
            </div>
          ))}
        </div>
    }
    </>

  );
};

export default NotificationComponent;
