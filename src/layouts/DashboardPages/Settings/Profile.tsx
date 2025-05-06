import {
  DownloadOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Select, Space } from "antd";

import { Content } from "antd/es/layout/layout";
import { useGetUserProfileQuery } from "../../../services/profiles.ts";
import { loginDetails } from "../../../utils.ts";
import { useEffect, useState } from "react";
import ProfileTabs from "./ProfileTabs.tsx";
import { toast } from "react-toastify";
import { handleDownloadData } from "../../../utils.ts";
import { useParams } from "react-router-dom";
import { useUpdateUserMutation } from "../../../services/users.ts";
import { roles } from "../../../services/types.ts";
import { useCreateNotificationMutation } from "../../../services/notifications.ts";

const ProfileSettings = () => {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userId = paramUserId ? Number(paramUserId) : loginDetails().user.id;
  const { data, isError, error, refetch } = useGetUserProfileQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  const [createNotification] = useCreateNotificationMutation();
  const user = data?.data?.user;
  const currentRole = user?.role;

  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    currentRole
  );

  useEffect(() => {
    if (currentRole) {
      setSelectedRole(currentRole);
    }
  }, [currentRole]);

  const handleRoleUpdate = async (newRole: string) => {
    if (!user?.id) return;
    const notificationData = {
      title: "Role Update",
      message: `Your role has been updated to ${newRole}.`,
      userId: user.id,
    };
    try {
      await updateUser({
        userId: user.id,
        data: { role: newRole },
      }).unwrap();
      await createNotification(notificationData).unwrap();

      toast.success(`Role updated to ${newRole}`);
      setSelectedRole(newRole);
      refetch();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const getAssignableRoles = (userRole: string) => {
    if (userRole === "super") return roles;
    if (userRole === "admin") return ["staff", "youth"];
    if (userRole === "staff") return ["youth", "mentor", "employer"];
    return [];
  };
  const assignableRoles = getAssignableRoles(loginDetails()?.user?.role);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isError, error]);

  return (
    <Content className="px-4 py-4  bg-white border border-gray-900/10 rounded-lg">
      <div className=" text-gray-900 p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <Space wrap size={16}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={
                  data?.data?.profileImage ||
                  data?.data.profileImage ||
                  "https://via.placeholder.com/80"
                }
              />
            </Space>
            <p className="text-lg font-semibold mt-2">
              {data &&
                `${data?.data.user.firstName} ${data?.data.user.lastName}`}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-md truncate text-blue-500 flex items-center gap-1">
                <span className="text-blue-400">
                  <EnvironmentOutlined />
                </span>
                {data?.data?.location}
              </p>
              <p className="text-md truncate text-blue-500 flex items-center gap-1">
                <span className="text-blue-400">
                  <ShoppingOutlined />
                </span>
                {data?.data?.skills[0]}
              </p>
            </div>
            <p className="text-md text-gray-500">{data?.data?.bio}</p>
            <p className="text-md text-green-600">{data?.data?.retiPartner}</p>
            <div className="flex flex-row items-center gap-4">
              {assignableRoles.length > 0 && (
                <div>
                  <Select
                    style={{ width: 150 }}
                    value={selectedRole}
                    onChange={handleRoleUpdate}
                  >
                    {assignableRoles.map((role) => (
                      <Select.Option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              <Button
                type="dashed"
                className="px-4 text-red-500"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadData(data)}
              >
                Download data
              </Button>
            </div>
          </div>
        </div>
        <div className="text-gray-900 p-4">
          <ProfileTabs profileData={data} />
        </div>
      </div>
    </Content>
  );
};

export default ProfileSettings;
