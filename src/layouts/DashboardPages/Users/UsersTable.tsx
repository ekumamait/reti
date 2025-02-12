import { Space, Table, Tag, Input, Select, Button } from "antd";
import type { TableProps } from "antd";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import Header from "../../../components/secondary/Header";
import { useDeleteUserMutation } from "../../../services/users";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import DeletePopconfirm from "../../../components/secondary/CustomDeletePopUp";
import { useState } from "react";
import Loader from "../../loader.tsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/secondary/Pagination";
import { useGetAllProfilesQuery } from "../../../services/profiles.ts";
import { loginDetails } from "../../../utils.ts";

const { Search } = Input;
const { Option } = Select;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
}

const UsersPage = () => {
  const { data: profdata } = useGetAllProfilesQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const navigate = useNavigate();
  const user = loginDetails();
  const loggedInUser = user?.user.id;

  const loggedInUserProfile = profdata?.data.find(
    (profile: any) => profile.user.id === loggedInUser
  );
  const loggedInUserRole = loggedInUserProfile?.user?.role || "";
  const loggedInUserPartner =
    loggedInUserProfile?.geoLocationDetails?.partnerResponsible || "";

  const handleViewUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleDeleteUser = async (userId: any) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete user ${error.data?.message}`);
    }
  };

  const filteredData = profdata?.data
    ?.map((profile: any) => ({
      id: profile.id,
      firstName: profile.user?.firstName || "N/A",
      lastName: profile.user?.lastName || "N/A",
      phoneNumber: profile.user?.phoneNumber || "N/A",
      role: profile.user?.role || "N/A",
      partnerResponsible:
        profile.geoLocationDetails?.partnerResponsible || "N/A",
    }))
    .filter((profile) => {
      const matchesSearch =
        profile.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        profile.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        profile.phoneNumber.includes(searchText) ||
        profile.role.toLowerCase().includes(searchText.toLowerCase());

      const matchesRole = roleFilter === "all" || profile.role === roleFilter;
      const matchesPartner = ["admin", "staff"].includes(loggedInUserRole)
        ? profile.partnerResponsible === loggedInUserPartner
        : true;
      const excludeSuperRole = ["admin", "staff"].includes(loggedInUserRole)
        ? profile.role !== "super"
        : true;

      return matchesSearch && matchesRole && matchesPartner && excludeSuperRole;
    });

  const paginatedUsers = filteredData?.slice(
    (userPage - 1) * userPageSize,
    userPage * userPageSize
  );

  const handleUserPageChange = (page: number) => {
    setUserPage(page);
  };

  const handleUserPageSizeChange = (size: number) => {
    setUserPageSize(size);
    setUserPage(1);
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "super" ? "red" : "green"}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "super", value: "super" },
        { text: "Youth", value: "youth" },
        { text: "Mentor", value: "mentor" },
        { text: "Employer", value: "employer" },
        { text: "Admin", value: "admin" },
        { text: "Staff", value: "staff" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <a
              className="text-blue-500 hover:underline"
              onClick={() => handleViewUser(record.id)}
            >
              See Details
            </a>
            <DeletePopconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              onConfirmMessage="User deleted successfully"
              onCancelMessage="User deletion cancelled"
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined className="text-red-500 cursor-pointer" />
            </DeletePopconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Header pageTitle="Profiles" />
      <CustomDashboardLayout>
        <div className="mb-4 flex gap-4">
          <Search
            placeholder="Search by name or phone"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={setRoleFilter}
          >
            <Option value="all">All Roles</Option>
            <Option value="super">Admin</Option>
            <Option value="youth">Youth</Option>
            <Option value="mentor">Mentor</Option>
            <Option value="employer">Employer</Option>
          </Select>

          <Button type="primary" onClick={refetch} loading={isLoading}>
            Refresh
          </Button>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={paginatedUsers}
              loading={isLoading}
              rowKey="id"
              pagination={false}
            />
            {filteredData && filteredData.length > userPageSize && (
              <div className="mt-4">
                <Pagination
                  currentPage={userPage}
                  totalPages={Math.ceil(filteredData.length / userPageSize)}
                  pageSize={userPageSize}
                  onPageChange={handleUserPageChange}
                  onPageSizeChange={handleUserPageSizeChange}
                />
              </div>
            )}
          </>
        )}
      </CustomDashboardLayout>
    </>
  );
};

export default UsersPage;
