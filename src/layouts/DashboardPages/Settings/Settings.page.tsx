import { Layout, Tabs } from "antd";
import { TabsProps } from "../../../services/types";
import ChangePasswordSettings from "./ChangePasswordSettings";
import Header from "../../../components/secondary/Header";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import ProfileSettings from "./Profile";
import PersonalDetailsSettings from "./PersonalDetails";

const SettingsPage = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile",
      children: <ProfileSettings />,
    },
    {
      key: "2",
      label: "Personal Details",
      children: (
        <div className="w-[75%] ">
          <PersonalDetailsSettings />
        </div>
      ),
    },
    {
      key: "3",
      label: "Account",
      children: (
        <div className="w-[75%]">
          <ChangePasswordSettings />
        </div>
      ),
    },
  ];

  return (
    <>
      <Header pageTitle="Settings" />
      <CustomDashboardLayout>
        <Layout>
          <Tabs defaultActiveKey="1" items={items} />
        </Layout>
      </CustomDashboardLayout>
    </>
  );
};

export default SettingsPage;
