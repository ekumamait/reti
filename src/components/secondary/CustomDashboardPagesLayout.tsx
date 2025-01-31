
import React from 'react';


interface LayoutProps {
    children?: React.ReactNode;
}

const CustomDashboardLayout: React.FC<LayoutProps> = ({ children, }) => {

    return (
        <div className="sm:px-6 sm:py-8 p-4 max-w-screen relative">
            {children}
        </div>
    );
};

export default CustomDashboardLayout;