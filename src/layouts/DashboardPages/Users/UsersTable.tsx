import { Space, Table, Tag, Input, Select } from "antd";
import type { TableProps } from "antd";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import Header from "../../../components/secondary/Header";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../../services/users";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import DeletePopconfirm from "../../../components/secondary/CustomDeletePopUp";
import { useState } from "react";
import Loader from '../../loader.tsx';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const { data, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const navigate = useNavigate();

  const handleViewUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete user ${error.data?.message}`);
    }
  };

  const filteredData = data?.data?.filter((user: User) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phoneNumber.includes(searchText);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Youth', value: 'youth' },
        { text: 'Mentor', value: 'mentor' },
        { text: 'Employer', value: 'employer' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <a className='text-blue-500 hover:underline' onClick={() => handleViewUser(record.id)}>See Details</a>
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
            <Option value="admin">Admin</Option>
            <Option value="youth">Youth</Option>
            <Option value="mentor">Mentor</Option>
            <Option value="employer">Employer</Option>
          </Select>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={isLoading}
            rowKey="id"
          />
        )}
      </CustomDashboardLayout>
    </>
  );
};

export default UsersPage;


