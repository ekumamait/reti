import Layout from "antd/es/layout/layout";
import AllOpportunitiesPage from "./AllOpportunities";
import { Button, Input } from "antd";
import { useState } from "react";
import AddOpportunitiesForm from "../Forms/AddOpportunityForm";
import Header from "../../../components/secondary/Header";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import { loginDetails } from "../../../utils";
import Chat from "../../../components/secondary/Chat";
import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useGetOpportunitiesQuery } from "../../../services/opportunities.ts";

const { Search } = Input;
const { Option } = Select;

const OpportunitiesPage = () => {
  const [open, setOpen] = useState(false);
  const [opportunityPage, setOpportunityPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpportunityPageChange = (page: number) => {
    setOpportunityPage(page);
  };

  const handleOpportunityPageSizeChange = () => {
    setOpportunityPage(1);
  };

  const { data: opportunities, isLoading, refetch } = useGetOpportunitiesQuery();

  return (
    <>
      <Header pageTitle="Opportunities" />
      <CustomDashboardLayout>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          {opportunities?.data?.length === 0 ? null : (
            <div className="flex flex-1 gap-4">
              <Search
                placeholder="Search by title or company"
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={setStatusFilter}
              >
                <Option value="all">Show All</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
          )}

          {loginDetails().user.role === "employer" && (
            <div className="flex items-center justify-end mb-4">
              <div>
                <Button type="primary" onClick={showModal} className="ml-auto">
                  Create a job
                </Button>
                <AddOpportunitiesForm
                  onOk={handleOk}
                  onCancel={handleCancel}
                  open={open}
                  loading={false}
                  isEdit={false}
                  initialData={undefined}
                />
              </div>
            </div>
          )}
        </div>
        <Layout>
          <AllOpportunitiesPage
            currentPage={opportunityPage}
            onPageChange={handleOpportunityPageChange}
            onPageSizeChange={handleOpportunityPageSizeChange}
            searchText={searchText}
            statusFilter={statusFilter}
            opportunities={opportunities}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Layout>
      </CustomDashboardLayout>
      {loginDetails().user.role !== "super" && <Chat />}
    </>
  );
};

export default OpportunitiesPage;
