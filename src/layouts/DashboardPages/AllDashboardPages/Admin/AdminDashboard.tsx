import { Card, Avatar } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { loginDetails } from "../../../../utils";
import CustomDashboardLayout from "../../../../components/secondary/CustomDashboardPagesLayout";
import UserStatistics from "./UsersGraph";
import JobOpportunitiesStatistics from "./OpportunitiesGraph";
import ProductStockStatistics from "./ProductsGraph";
import MapComponent from "./AdminMap";

const AdminDashboardPage = () => {
  const user = loginDetails();

  return (
    <>
      <CustomDashboardLayout>
        <div className="w-full">
          {/* banner */}
          <Card className="shadow-sm text-black text-sm mb-1">
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  className="mr-2"
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
        </div>
        <div className="sm:flex justify-between gap-2">
          <div className="sm:w-6/12">
            {/* User Statistics */}
            <Card title="User Statistics" className="mb-1">
              <UserStatistics />
            </Card>
          </div>

          <div className="sm:w-6/12">
            <Card title="Job Statistics" className="mb-1">
              <JobOpportunitiesStatistics />
            </Card>
          </div>
        </div>

        <div className="sm:flex justify-between gap-2">
          <div className="sm:w-6/12">
            {/* products Statistics */}
            <Card title="Products Statistics" className="mb-1">
              <ProductStockStatistics />
            </Card>
          </div>

          <div className="sm:w-6/12">
            <Card title="User Locations" className="mb-1">
              <MapComponent />
            </Card>
          </div>
        </div>
      
      </CustomDashboardLayout>
    </>
  );
};

export default AdminDashboardPage;
