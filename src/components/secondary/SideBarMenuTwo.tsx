import { useState } from "react";
import { Avatar, Layout, Menu, Tag } from "antd";
import { Link } from "react-router-dom";
import reti from "../../assets/reti.png";
import {
  HomeOutlined,
  LogoutOutlined,
  PhoneOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { handleLogout, loginDetails } from "../../utils.ts";
import { ShoppingOutlined } from "@ant-design/icons";
import { useGetUserProfileQuery } from "../../services/profiles.ts";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
}

const { Sider } = Layout;

const SiderTwo = ({ closeDrawer }) => {
  const [selectedKey, setSelectedKey] = useState("home");
  const user = loginDetails();
  const { data: userProfile } = useGetUserProfileQuery(user?.user?.id);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update the selected key when an item is clicked
  };

  // Function to generate menu items

  const getMenuItems = (closeDrawer: () => void): MenuItem[] => {
    const menuItems = [
      {
        key: "dashboard",
        icon: <HomeOutlined />,
        label: (
          <Link to="/dashboard" onClick={closeDrawer}>
            Dashboard
          </Link>
        ),
      },
      {
        key: "opportunities",
        icon: <ProjectOutlined />,
        label: (
          <Link to="/opportunities" onClick={closeDrawer}>
            Opportunities
          </Link>
        ),
      },
      {
        key: "products",
        icon: <ShoppingOutlined />,
        label: (
          <Link to="/products" onClick={closeDrawer}>
            Products
          </Link>
        ),
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: (
          <Link type="link" onClick={handleLogout} to={""}>
            Log Out
          </Link>
        ),
      },
    ];
    if (
      user?.user?.role === "super" ||
      user?.user?.role === "staff" ||
      user?.user?.role === "admin"
    ) {
      menuItems.splice(
        3,
        0,
        {
          key: "Profiles",
          icon: <UsergroupAddOutlined />,
          label: (
            <Link to="/users" onClick={closeDrawer}>
              Profiles
            </Link>
          ),
        },
        {
          key: "support-requests",
          icon: <QuestionCircleOutlined />,
          label: (
            <Link to="/support-requests" onClick={closeDrawer}>
              Support Requests
            </Link>
          ),
        }
      );
    } else {
      menuItems.splice(
        3,
        0,
        {
          key: "help-support",
          icon: <QuestionCircleOutlined />,
          label: (
            <Link to="/support" onClick={closeDrawer}>
              Help & Support
            </Link>
          ),
        },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: (
            <Link to="/settings" onClick={closeDrawer}>
              Settings
            </Link>
          ),
        }
      );
    }
    return menuItems;
  };

  return (
    <Sider
      width={250}
      theme="light"
      className="fixed h-screen border-gray-300"
      style={{ backgroundColor: "rgb(6, 46, 100)" }}
    >
      <div
        className="flex items-center justify-center px-8 py-4"
        style={{ backgroundColor: "rgb(6, 46, 100)" }}
      >
        <img alt="Your Company" src={reti} className="h-20 w-auto" />
      </div>
      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={getMenuItems(closeDrawer)}
        onClick={handleMenuClick}
        className="capitalize flex-1 text-md custom-menu"
        style={{
          backgroundColor: "rgb(6, 46, 100)",
          color: "white",
        }}
      />
      <div className="absolute bottom-0 w-full flex items-center p-4 text-white bg-[rgba(255,255,255,0.1)]">
        <Avatar
          size="large"
          icon={<UserOutlined />}
          src={
            userProfile?.data?.profileImage || "https://via.placeholder.com/80"
          }
        />
        <div className="ml-2">
          <span className="text-sm text-red-600 capitalize mr-2">
            {user?.user?.role === 'youth' ? 'YP' : user?.user?.role} 
          </span>
          <Tag color="#f50">
            <label className="block text-white">
              {`${user?.user?.firstName} ${user?.user?.lastName}`}{" "}
            </label>
          </Tag>
          <div className="flex items-center gap-1 text-white">
            <PhoneOutlined className="text-white" />
            <label>{user?.user?.phoneNumber}</label>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default SiderTwo;
