import Layout from "antd/es/layout/layout";
import AllOpportunitiesPage from "./AllOpportunities";
import { Button } from "antd";
import { useState } from "react";
import AddOpportunitiesForm from "../Forms/AddOpportunityForm";
import Header from "../../../components/secondary/Header";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import { loginDetails } from "../../../utils";
import Chat from "../../../components/secondary/Chat";

const OpportunitiesPage = () => {
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Header pageTitle="Opportunities" />
            <CustomDashboardLayout>
                {loginDetails().user.role === 'employer' && (
                    <div className="flex items-center justify-end mb-4">
                        <div>
                            <Button type="primary" onClick={showModal}>
                                Create a job
                            </Button>
                            <AddOpportunitiesForm
                                onOk={handleOk}
                                onCancel={handleCancel}
                                open={open}
                                loading={false}
                                isEdit={false}
                            />
                        </div>
                    </div>
                )}

                <Layout>
                    <AllOpportunitiesPage />
                </Layout>
            </CustomDashboardLayout>
            {loginDetails().user.role !== 'admin' && <Chat />}
        </>
    )
}

export default OpportunitiesPage;
