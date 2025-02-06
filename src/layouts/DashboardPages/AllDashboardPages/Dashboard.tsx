import { Card, Avatar, Tag, Button, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import {
  ClockCircleOutlined,
  LikeOutlined,
  UserOutlined,
  EditOutlined,
  DownOutlined,
  LikeFilled,
} from "@ant-design/icons";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "../../../services/notifications";
import { loginDetails, formatRelativeTime, formatTwitterTime } from "../../../utils";
import { InspirationsType } from "../../../services/types";
import {
  useGetInspirationsQuery,
  useDeleteInspirationMutation,
  useLikeInspirationMutation,
} from "../../../services/inspirations";
import Loader from "../../loader";
import { useGetAllProfilesQuery, useGetUserProfileQuery } from "../../../services/profiles";
import Chat from "../../../components/secondary/Chat";
import { toast } from "react-toastify";
import MentorshipCalendar from "../../../components/secondary/Calendar";
import DeletePopconfirm from "../../../components/secondary/CustomDeletePopUp";
import AddInspirationsForm from "../Forms/AddGuidanceForm";
import Pagination from "../../../components/secondary/Pagination";

const DashboardPage = () => {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [likeInspiration] = useLikeInspirationMutation();
  const user = loginDetails();
  const { data: inspirationsData } = useGetInspirationsQuery();
  const { data: userProfile } = useGetUserProfileQuery(user?.user?.id);
  const [inspirations, setInspirations] = useState<InspirationsType[]>([]);
  const [deleteInspiration] = useDeleteInspirationMutation();
  const { data: userProfiles } = useGetAllProfilesQuery();
  const [editingInspiration, setEditingInspiration] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters] = useState({
    searchText: "",
    mentor: "",
    dateRange: null,
  });
  const [sortCriteria, setSortCriteria] = useState("newest");
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [isMentorDropdownVisible, setIsMentorDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationPageSize, setNotificationPageSize] = useState(4);

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification?.isRead) {
        const notificationId = notification.id;
        await markAsRead(notificationId).unwrap();
      }
      return;
    } catch (error) {
      toast.error("Failed to mark notification as read:", error);
    }
  };

  const handleInspirationLike = async (inspirationId: number) => {
    try {
      const updatedInspirations = inspirations.map((inspiration) =>
        inspiration.id === inspirationId
          ? {
            ...inspiration,
            isLiked: !inspiration.isLiked,
            likesCount: inspiration.isLiked
              ? inspiration.likesCount - 1
              : inspiration.likesCount + 1,
          }
          : inspiration
      );
      setInspirations(updatedInspirations);
      const data = await likeInspiration(inspirationId).unwrap();
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

  const currentUserId = user?.user?.id;
  const paginatedInspirations = filteredInspirations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedNotifications = notificationsData?.data?.slice(
    (notificationPage - 1) * notificationPageSize,
    notificationPage * notificationPageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleNotificationPageChange = (page: number) => {
    setNotificationPage(page);
  };

  const handleNotificationPageSizeChange = (size: number) => {
    setNotificationPageSize(size);
    setNotificationPage(1);
  };

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
          <Card title="Notifications" className="shadow-sm">
            <div className="space-y-2 p-2 overflow-y-auto h-[230px]">
              {isLoading ? (
                <Loader />
              ) : (
                <ul className="space-y-4">
                  {paginatedNotifications?.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${!notification.isRead
                          ? "bg-blue-50 border-l-4 border-blue-600 font-medium"
                          : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p
                            className={`text-sm ${!notification.isRead ? "text-blue-900" : "text-gray-700"
                              }`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-sm mt-1 ${!notification.isRead ? "text-blue-800" : "text-gray-600"
                              }`}
                          >
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            <ClockCircleOutlined className="mr-1" />
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {notificationsData?.data &&
              notificationsData?.data?.length > notificationPageSize && (
                <div className="mt-4">
                  <Pagination
                    currentPage={notificationPage}
                    totalPages={Math.ceil(
                      notificationsData?.data?.length / notificationPageSize
                    )}
                    pageSize={notificationPageSize}
                    onPageChange={handleNotificationPageChange}
                    onPageSizeChange={handleNotificationPageSizeChange}
                  />
                </div>
              )}
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
          <Card title="Posts" className="shadow-sm">
            <div className="space-y-2 p-2 overflow-y-auto h-[330px]">
              {paginatedInspirations?.map((inspiration) => {
                const mentorProfile = userProfiles?.data?.find(
                  profile => profile.user.id === inspiration.mentor.id
                );
                return (
                  <div key={inspiration.id} className="border-b p-4 hover:bg-gray-50 transition-colors">
                    {/* Poster Header */}
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={mentorProfile?.profileImage || "https://via.placeholder.com/50"}
                        className="shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {inspiration.mentor.firstName} {inspiration.mentor.lastName}
                          </h4>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500 text-sm">
                            {formatTwitterTime(inspiration.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="ml-12">
                      {/* <h3 className="font-bold text-lg mb-2">{inspiration.title}</h3> */}
                      <p className="text-gray-800 mb-4 whitespace-pre-line">
                        {inspiration.content}
                      </p>

                      {/* Image Preview */}
                      {inspiration.imageUrl && (
                        <img
                          src={inspiration.imageUrl}
                          alt="Inspiration visual"
                          className="rounded-xl mb-4 max-w-full h-auto max-h-96 object-cover"
                        />
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-gray-500">
                          <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                            <div
                              className="flex items-center cursor-pointer group"
                              onClick={() => handleInspirationLike(inspiration.id)}
                            >
                              {inspiration.likedBy.some(user => user.id === currentUserId) ? (
                                <LikeFilled className="text-red-500 mr-1 transition-colors animate-[bounce_0.4s_ease-in-out]" />
                              ) : (
                                <LikeOutlined className="mr-1 text-gray-500 group-hover:text-red-400 transition-colors" />
                              )}
                              <span className={`${inspiration.likedBy.some(user => user.id === currentUserId)
                                  ? 'text-red-500 font-semibold'
                                  : 'text-gray-600 group-hover:text-red-400'
                                } transition-colors`}>
                                {inspiration.likesCount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mentor Actions */}
                        {user?.user.role === "mentor" && (
                          <div className="flex gap-4">
                            <EditOutlined
                              className="text-gray-500 hover:text-blue-500 cursor-pointer"
                              onClick={() => handleEdit(inspiration)}
                            />
                            <DeletePopconfirm
                              title="Delete Inspiration"
                              description="Are you sure to delete this inspiration?"
                              onConfirm={() => handleDelete(inspiration.id)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredInspirations.length > pageSize && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredInspirations.length / pageSize)}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </Card>
        </div>

        {/* Right Column - Calendar */}
        <div className="space-y-4">
          <Card title="Activity Calendar" className="shadow-sm">
            <MentorshipCalendar />
          </Card>

          {/* Chats */}
          <Chat receiverId={undefined} />
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

export default DashboardPage;
