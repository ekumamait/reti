import { Collapse, Form, Input, Select, Button, Table, Tag, Empty } from "antd";
import type { TableProps } from "antd";
import { toast } from "react-toastify";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import Header from "../../../components/secondary/Header";
import Loader from "../../loader.tsx";
import {
    useSendSupportRequestMutation,
    useGetMySupportRequestsQuery,
    SupportRequest,
} from "../../../services/support.ts";
import { loginDetails } from "../../../utils.ts";

const { TextArea } = Input;

const FAQ_ITEMS = [
    {
        key: "reset-password",
        label: "How do I recover my account if I forget my password?",
        children: (
            <p>
                On the login page, click <strong>"Forgot your password?"</strong> and enter the
                email address on your profile. We'll send you a link to set a new password. If you
                don't have an email on file, submit a request below under "Account recovery" and
                our team will help you.
            </p>
        ),
    },
    {
        key: "update-profile",
        label: "How do I update my profile information?",
        children: (
            <p>
                Go to <strong>Settings</strong> from the sidebar to update your personal details,
                skills, bio, and profile photo at any time.
            </p>
        ),
    },
    {
        key: "apply-opportunities",
        label: "How do I apply for jobs and opportunities?",
        children: (
            <p>
                Visit the <strong>Opportunities</strong> page to browse open jobs and training
                opportunities, then click on one to view details and apply.
            </p>
        ),
    },
    {
        key: "data-privacy",
        label: "How is my personal data used and protected?",
        children: (
            <p>
                See our <a href="/privacy" target="_blank" rel="noreferrer" className="text-red-500 hover:underline">Privacy Policy</a> for
                details on what we collect, how it's used, and your rights over your data.
            </p>
        ),
    },
    {
        key: "contact-support",
        label: "How do I report a technical problem or complaint?",
        children: (
            <p>
                Submit a request below using the "Technical issue" or "General" category. You can
                track the status and our response in the "My requests" section on this page.
            </p>
        ),
    },
];

const STATUS_COLORS: Record<string, string> = {
    open: "orange",
    in_progress: "blue",
    resolved: "green",
};

const SupportPage = () => {
    const [form] = Form.useForm();
    const user = loginDetails();
    const [sendSupportRequest, { isLoading: isSubmitting }] = useSendSupportRequestMutation();
    const { data, isLoading, refetch } = useGetMySupportRequestsQuery();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await sendSupportRequest({
                contact: values.contact || user?.user?.phoneNumber,
                description: values.description,
                category: values.category,
            }).unwrap();
            toast.success(response.message || "Support request sent successfully");
            form.resetFields();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Support request failed. Please try again.");
        }
    };

    const columns: TableProps<SupportRequest>["columns"] = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category: string) => <span className="capitalize">{category?.replace("_", " ")}</span>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={STATUS_COLORS[status] || "default"} className="capitalize">
                    {status?.replace("_", " ")}
                </Tag>
            ),
        },
        {
            title: "Response",
            dataIndex: "adminResponse",
            key: "adminResponse",
            render: (response: string | null) => response || <span className="text-gray-400">Awaiting response</span>,
        },
        {
            title: "Submitted",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Header pageTitle="Help & Support" />
            <CustomDashboardLayout>
                <div className="max-w-4xl space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold mb-2">Guidance</h2>
                        <Collapse items={FAQ_ITEMS} accordion />
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">Submit a request</h2>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{ category: "general", contact: user?.user?.phoneNumber }}
                            className="max-w-lg"
                        >
                            <Form.Item
                                label="What do you need help with?"
                                name="category"
                                rules={[{ required: true, message: "Please select a category" }]}
                            >
                                <Select size="large">
                                    <Select.Option value="technical_issue">Technical issue</Select.Option>
                                    <Select.Option value="account_recovery">Account recovery</Select.Option>
                                    <Select.Option value="guidance">Guidance</Select.Option>
                                    <Select.Option value="general">General</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Contact"
                                name="contact"
                                rules={[{ required: true, message: "Please enter a valid contact" }]}
                            >
                                <Input placeholder="e.g. 0705999239 or your email" size="large" />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: "Please describe your issue" }]}
                            >
                                <TextArea rows={4} placeholder="Describe the assistance you need" />
                            </Form.Item>
                            <Button type="primary" loading={isSubmitting} onClick={handleSubmit}>
                                Submit request
                            </Button>
                        </Form>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-2">My requests</h2>
                        {isLoading ? (
                            <Loader />
                        ) : data?.data?.length ? (
                            <Table
                                columns={columns}
                                dataSource={data.data}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <Empty description="You haven't submitted any support requests yet" />
                        )}
                    </section>
                </div>
            </CustomDashboardLayout>
        </>
    );
};

export default SupportPage;
