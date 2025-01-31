import {
  Card,
  Avatar,
  Tag,
  Button,
  Select,
  Input,
  DatePicker,
  Dropdown,
  Menu,
} from "antd";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import {
  ClockCircleOutlined,
  LikeOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  LikeFilled,
} from "@ant-design/icons";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "../../../services/notifications";
import { loginDetails, formatRelativeTime } from "../../../utils";
import { InspirationsType } from "../../../services/types";
import { useGetInspirationsQuery, useDeleteInspirationMutation, useLikeInspirationMutation } from "../../../services/inspirations";
import Loader from "../../loader";
import { useGetUserProfileQuery } from "../../../services/profiles";
import Chat from "../../../components/secondary/Chat";
import { toast } from "react-toastify";
import MentorshipCalendar from "../../../components/secondary/Calendar";
import DeletePopconfirm from "../../../components/secondary/CustomDeletePopUp";
import AddInspirationsForm from "../Forms/AddGuidanceForm";

const YouthDashboardPage = () => {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [likeInspiration] = useLikeInspirationMutation();
  const user = loginDetails();
  const { data: inspirationsData } = useGetInspirationsQuery();
  const { data: userProfile } = useGetUserProfileQuery(user?.user?.id);
  const [inspirations, setInspirations] = useState<InspirationsType[]>([]);
  const [deleteInspiration] = useDeleteInspirationMutation();
  const [editingInspiration, setEditingInspiration] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchText: "",
    mentor: "",
    dateRange: null,
  });
  const [sortCriteria, setSortCriteria] = useState("newest");
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [isMentorDropdownVisible, setIsMentorDropdownVisible] = useState(false);

  const reversedNotifications = notificationsData?.data?.slice().reverse();
  const handleNotificationClick = async (notificationId: number) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      toast.error("Failed to mark notification as read:", error);
    }
  };

  const handleInspirationLike = async (inspirationId: number) => {
    try {
      const updatedInspirations = inspirations.map(inspiration =>
        inspiration.id === inspirationId ? {
          ...inspiration,
          isLiked: !inspiration.isLiked,
          likesCount: inspiration.isLiked ? inspiration.likesCount - 1 : inspiration.likesCount + 1
        } : inspiration
      );
      setInspirations(updatedInspirations);
      const data = await likeInspiration(
        inspirationId).unwrap();
      toast.success(data.message);
    } catch (error) {
      setInspirations([...inspirations]);
      toast.error("Failed to update like status");
    }
  };

  useEffect(() => {
    if (inspirationsData) {
      setInspirations(inspirationsData?.data);
    }
  }, [inspirationsData]);

  const handleEdit = (inspiration) => {
    setEditingInspiration(inspiration);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingInspiration(null);
  };

  const handleEditOk = () => {
    setIsEditModalOpen(false);
    setEditingInspiration(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteInspiration(id).unwrap();
      toast.success("Inspiration deleted successfully");
    } catch (error) {
      toast.error("Failed to delete inspiration");
    }
  };

  const mentorOptions = [
    ...new Set(
      inspirations?.map((i) => `${i.mentor.firstName} ${i.mentor.lastName}`)
    ),
  ];

  const sortInspirations = (inspirations) => {
    if (!inspirations) return [];

    return [...inspirations].sort((a, b) => {
      if (sortCriteria === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortCriteria === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortCriteria === "mentor") {
        const nameA =
          `${a.mentor.firstName} ${a.mentor.lastName}`.toLowerCase();
        const nameB =
          `${b.mentor.firstName} ${b.mentor.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });
  };

  const filteredInspirations = sortInspirations(
    inspirations.filter((inspiration) => {
      const matchesSearch = filters.searchText
        ? inspiration.title
            .toLowerCase()
            .includes(filters.searchText.toLowerCase()) ||
          inspiration.content
            .toLowerCase()
            .includes(filters.searchText.toLowerCase())
        : true;

      const matchesMentor =
        sortCriteria === "mentor"
          ? user?.user.role === "youth"
            ? selectedMentor
              ? `${inspiration.mentor.firstName} ${inspiration.mentor.lastName}` ===
                selectedMentor
              : true
            : inspiration.mentor.id === user?.user.id
          : true;

      const matchesDate = filters.dateRange
        ? new Date(inspiration.createdAt) >= filters.dateRange[0] &&
          new Date(inspiration.createdAt) <= filters.dateRange[1]
        : true;

      return matchesSearch && matchesMentor && matchesDate;
    })
  );

  return (
    <CustomDashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Main Content */}
        <div className="space-y-4">
          {/* User Greeting Card */}
          <Card className="shadow-sm text-black text-sm">
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  src={
                    userProfile?.data?.profileImage ||
                    "https://via.placeholder.com/80"
                  }
                />
              </div>

              <div className="flex-1">
                <h2> Hi {user?.user.firstName} 👋</h2>
                <div className="text-gray-500">You're amazing!</div>
              </div>
              <div>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </Card>

          {/* Recent Notifications */}
          <Card title="Recent Notifications" className="shadow-sm">
            <div className="space-y-2 p-2 overflow-y-auto h-[230px]">
              {isLoading ? (
                <Loader />
              ) : (
                <ul className="space-y-4">
                  {reversedNotifications?.map((notification) => (
                    <li
                      key={notification.id}
                      className="cursor-pointer flex justify-between items-center hover:bg-gray-100 p-2 rounded-md"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div>
                        <p
                          className={`font-medium truncate ${!notification.isRead
                              ? "text-blue-600"
                              : "text-gray-800"
                            }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 whitespace--normal break-words flex-1 max-w-[80%] overflow-hidden">
                          {notification.message}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatRelativeTime(notification.createdAt)} <ClockCircleOutlined />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
          <div className="flex justify-between mb-4">
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) => {
                    if (key === "newest" || key === "oldest") {
                      setSortCriteria(key);
                      setIsSortDropdownVisible(false);
                    } else if (key === "mentor") {
                      setSortCriteria("mentor");
                      setIsSortDropdownVisible(false);
                    }
                  }}
                >
                  <Menu.Item key="newest">Newest First</Menu.Item>
                  <Menu.Item key="oldest">Oldest First</Menu.Item>
                  {user?.user.role === "youth" && (
                    <Menu.SubMenu key="mentor" title="By Mentor">
                      {mentorOptions.map((mentor) => (
                        <Menu.Item
                          key={mentor}
                          onClick={() => {
                            setSelectedMentor(mentor);
                            setSortCriteria("mentor");
                          }}
                        >
                          {mentor}
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  )}
                  {user?.user.role === "mentor" && (
                    <Menu.Item key="mentor">My Inspirations</Menu.Item>
                  )}
                </Menu>
              }
              visible={isSortDropdownVisible}
              onVisibleChange={setIsSortDropdownVisible}
              trigger={["click"]}
            >
              <Button>
                Sort <DownOutlined />
              </Button>
            </Dropdown>
            {user?.user.role === "mentor" && (
              <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
                Add Inspiration
              </Button>
            )}
          </div>
          {/* Recent Inspirations */}
          <Card title="Inspiration Quotations" className="shadow-sm">
            <div className="space-y-2 p-2 overflow-y-auto h-[330px]">
              {filteredInspirations?.map((inspiration) => (
                <div key={inspiration.id} className="border-b p-3">
                  <div className="flex justify-between items-center">
                    <p className="text-red-500 font-medium">
                      {inspiration.title}
                    </p>

                    {user?.user.role === "mentor" && (
                      <div className="flex space-x-2">
                        <EditOutlined
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEdit(inspiration)}
                        />
                        <DeletePopconfirm
                          title="Delete"
                          description="Are you sure to delete this inspiration?"
                          onConfirm={() => handleDelete(inspiration.id)}
                          okText="Yes"
                          cancelText="No"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 whitespace-normal break-words flex-1 max-w-[90%] overflow-hidden">
                      {inspiration.content}
                    </p>
                    <div
                      className="flex items-center cursor-pointer group"
                      onClick={() => handleInspirationLike(inspiration.id)}
                    >
                      {inspiration.isLiked ? (
                        <LikeFilled className="text-red-500 mr-1 transition-colors" />
                      ) : (
                        <LikeOutlined className="mr-1 text-gray-500 group-hover:text-red-400 transition-colors" />
                      )}
                      <span className={`${inspiration.isLiked ? 'text-red-500' : 'text-gray-600'} group-hover:text-red-400`}>
                        {inspiration.likesCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <span>
                      Posted By:
                      <Tag className="ml-2" color="red">
                        {`${inspiration?.mentor.firstName} ${inspiration?.mentor.lastName}`}
                      </Tag>
                    </span>
                    <span>
                      Posted At:
                      <Tag className="ml-2" color="blue">
                        <ClockCircleOutlined />{" "}
                        {formatRelativeTime(inspiration.createdAt)}
                      </Tag>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Calendar */}
        <div className="space-y-4">
          <Card title="Activity Calendar" className="shadow-sm">
            <MentorshipCalendar />
          </Card>

          {/* Chats */}
          <Chat />
        </div>
      </div>

      <AddInspirationsForm
        open={isAddModalOpen}
        onOk={() => setIsAddModalOpen(false)}
        onCancel={() => setIsAddModalOpen(false)}
        loading={false}
      />

      <AddInspirationsForm
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        loading={false}
        initialData={editingInspiration}
        isEdit={true}
      />

      {isMentorDropdownVisible && (
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => {
                setSelectedMentor(key);
                setIsMentorDropdownVisible(false);
                setSortCriteria("mentor");
              }}
            >
              {mentorOptions.map((mentor) => (
                <Menu.Item key={mentor}>{mentor}</Menu.Item>
              ))}
            </Menu>
          }
          visible={isMentorDropdownVisible}
          onVisibleChange={setIsMentorDropdownVisible}
          trigger={["click"]}
        >
          <Button>
            Select Mentor <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </CustomDashboardLayout>
  );
};

export default YouthDashboardPage;
