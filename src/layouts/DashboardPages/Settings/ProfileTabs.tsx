import { Tabs } from "antd";
import { TabsProps } from "../../../services/types";
import ProfileDetails from "./ProfileDetails";
import Education from "./ProfileEducation";
import Experience from "./ProfileWorkExperience";
import ProfileDetailsExt from "./ProfileDetailsExt";


const ProfileTabs = ({ profileData }) => {
  

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Skills, Demographics, and Location Details",
      children: <ProfileDetails profileData={profileData}/>,
    },
    {
      key: "2",
      label: "Training Institutions, Cohorts and Trades",
      children: <ProfileDetailsExt profileData={profileData}/>,
    },
    {
      key: "3",
      label: "Work experience",
      children: <Experience/>,
    },
    {
      key: "4",
      label: "Education",
      children: <Education/>,
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
};

export default ProfileTabs;
