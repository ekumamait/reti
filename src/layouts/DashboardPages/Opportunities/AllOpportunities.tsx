import { ClockCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Avatar, Tag, Typography, Button } from "antd";
import { useDeleteOpportunityMutation } from "../../../services/opportunities.ts";
import Loader from "../../loader.tsx";
import { formatRelativeTime, loginDetails } from "../../../utils.ts";
import Pagination from "../../../components/secondary/Pagination";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Empty } from 'antd';

const AllOpportunitiesPage = ({
  currentPage,
  onPageChange,
  onPageSizeChange,
  searchText,
  statusFilter,
  opportunities,
  isLoading,
  refetch
}) => {
  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(window.innerWidth >= 2560 ? 12 : 6);
  const [deleteOpportunity] = useDeleteOpportunityMutation();

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth >= 2560 ? 12 : 6);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredOpportunities = opportunities?.data?.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchText.toLowerCase()) ||
      opportunity.companyName.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || opportunity.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedOpportunities = filteredOpportunities?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const canDelete = loginDetails().user.role === 'admin' ||
    loginDetails().user.id === opportunities?.data?.find(o => o.id === opportunities.id)?.employer?.id;

  const handleDeleteOpportunity = async (id: number) => {
    try {
      await deleteOpportunity(id).unwrap();
      toast.success('Opportunity deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete opportunity');
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {filteredOpportunities && filteredOpportunities && paginatedOpportunities?.length === 0 ? (
            <div className="mt-32">
              <Empty />
            </div>) :
            (
              <div>
                <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedOpportunities?.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                      className="h-34 relative flex p-1 border border-gray-300 rounded-lg bg-white hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex-1 p-2">
                        <div className="space-y-4">
                          <h3 className="text-lg capitalize truncate  text-gray-700">
                            {opportunity.title}
                          </h3>
                          <p className="text-sm truncate text-gray-500 flex items-center gap-1">
                            <div className="text-right mb-1">
                              <ClockCircleOutlined />{" "}
                              {formatRelativeTime(opportunity.createdAt)}
                            </div>
                          </p>

                          <div className="mt-4">
                            <div className="flex items-center justify-between">
                              <p className="py-2 text-sm font-semibold truncate">
                                Created By
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-x-2">
                                <Avatar
                                  style={{ backgroundColor: "rgb(6, 46, 100)" }}
                                >
                                  {opportunity.companyName[0]}
                                </Avatar>
                                <div>
                                  <Typography.Text type="secondary">
                                    {`${opportunity?.employer?.firstName} ${opportunity?.employer?.lastName}`}
                                  </Typography.Text>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <Tag
                                color={
                                  opportunity.status === "active"
                                    ? "success"
                                    : "error"
                                }
                              >
                                {opportunity.status}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </div>

                      {opportunity.imageUrl && !opportunity.imageUrl.includes('dummy') && (
                        <div className="w-2/5 p-2">
                          <img
                            src={opportunity.imageUrl}
                            alt="Opportunity"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {canDelete && (
                        <Button
                          type="text"
                          icon={<DeleteOutlined className="text-red-500" />}
                          size="small"
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOpportunity(opportunity.id);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {filteredOpportunities && filteredOpportunities.length > pageSize && (
                  <>
                    {/* Desktop Pagination */}
                    <div className="mt-4 fixed bottom-0 p-4 sm:block w-full">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                          filteredOpportunities.length / pageSize
                        )}
                        pageSize={pageSize}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                      />
                    </div>

                    {/* Mobile Pagination */}
                    <div className=" p-4 sm:hidden w-full z-50 mb-16">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(
                          filteredOpportunities.length / pageSize
                        )}
                        pageSize={pageSize}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                      />
                    </div>
                  </>
                )}
              </div>

            )}
        </>
      )}
    </>
  );
};

export default AllOpportunitiesPage;
