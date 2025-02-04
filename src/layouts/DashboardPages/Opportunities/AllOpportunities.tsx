import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Avatar, Tag, Typography } from "antd";
import { useGetOpportunitiesQuery } from "../../../services/opportunities.ts";
import Loader from "../../loader.tsx";
import { formatRelativeTime } from "../../../utils.ts";
import Pagination from "../../../components/secondary/Pagination";

const AllOpportunitiesPage = ({
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchText,
  statusFilter,
}) => {
  const navigate = useNavigate();
  const { data: opportunities, isLoading } = useGetOpportunitiesQuery();

  const filteredOpportunities = opportunities?.data?.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchText.toLowerCase()) ||
      opportunity.companyName.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'all' || opportunity.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedOpportunities = filteredOpportunities?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedOpportunities?.map((opportunity) => (
            <div
              key={opportunity.id}
              onClick={() => navigate(`/opportunities/${opportunity.id}`)}
              className="h-34 relative flex flex-col p-1 border border-gray-300 rounded-lg bg-white hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
            >
              <div className="p-2">
                <div className="space-y-4">
                  <h3 className="text-lg capitalize truncate  text-gray-700">
                    {opportunity.title}
                  </h3>
                  <p className="text-sm truncate text-gray-500 flex items-center gap-1">
                    <div className="text-right mb-1">
                      <ClockCircleOutlined /> {formatRelativeTime(opportunity.createdAt)}
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
                            {`${opportunity.employer.firstName} ${opportunity.employer.lastName}`}
                          </Typography.Text>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Tag
                        color={opportunity.status === "active" ? "success" : "error"}
                      >
                        {opportunity.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredOpportunities && filteredOpportunities.length > pageSize && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredOpportunities.length / pageSize)}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default AllOpportunitiesPage;
