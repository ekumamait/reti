import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Avatar, Tag, Typography } from "antd";
import { useGetOpportunitiesQuery } from "../../../services/opportunities.ts";
import Loader from "../../loader.tsx";
import { formatRelativeTime } from "../../../utils.ts";

const AllOpportunitiesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetOpportunitiesQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((job) => {
            return (
              <div
                key={job.id}
                onClick={() => navigate(`/opportunities/${job.id}`)}
                className="h-34 relative flex flex-col p-1 border border-gray-300 rounded-lg bg-white hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <div className="p-2">
                  <div className="space-y-4">
                    <h3 className="text-lg capitalize truncate  text-gray-700">
                      {job.title}
                    </h3>
                    <p className="text-sm truncate text-gray-500 flex items-center gap-1">
                      <div className="text-right mb-1">
                        <ClockCircleOutlined /> {formatRelativeTime(job.createdAt)}
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
                            {job.companyName[0]}
                          </Avatar>
                          <div>
                            <Typography.Text type="secondary">
                              {`${job.employer.firstName} ${job.employer.lastName}`}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Tag
                          color={job.status === "active" ? "success" : "error"}
                        >
                          {job.status}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AllOpportunitiesPage;
