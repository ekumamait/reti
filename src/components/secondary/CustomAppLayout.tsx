import React from "react";
import { Layout as AntdLayout } from "antd";

import SiderTwo from "./SideBarMenuTwo";

const { Content } = AntdLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const CustomAppLayout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <AntdLayout className="min-h-screen relative">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <SiderTwo closeDrawer={undefined} />
      </div>

      <AntdLayout className="lg:ml-[250px]">
        {/* Main Content */}
        <Content className="min-h-screen">
          {children}
        </Content>
      </AntdLayout>

    </AntdLayout>
  );
};

export default CustomAppLayout;






















