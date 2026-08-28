import { useState } from "react";
import { Table, Tag, Select, Modal, Form, Input, Button } from "antd";
import type { TableProps } from "antd";
import { toast } from "react-toastify";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import Header from "../../../components/secondary/Header";
import Loader from "../../loader.tsx";
import {
    useGetAllSupportRequestsQuery,
    useRespondToSupportRequestMutation,
    SupportRequest,
    SupportRequestStatus,
} from "../../../services/support.ts";
import { getApiErrorMessage } from "../../../utils/apiError.ts";

const { TextArea } = Input;
const { Option } = Select;

const STATUS_COLORS: Record<string, string> = {
    open: "orange",
    in_progress: "blue",
    resolved: "green",
};

const SupportRequestsTable = () => {
    const [statusFilter, setStatusFilter] = useState<SupportRequestStatus | undefined>(undefined);
    const { data, isLoading, refetch } = useGetAllSupportRequestsQuery({ status: statusFilter });
    const [respondToSupportRequest, { isLoading: isResponding }] = useRespondToSupportRequestMutation();
    const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);
    const [form] = Form.useForm();

    const openRespondModal = (record: SupportRequest) => {
        setActiveRequest(record);
        form.setFieldsValue({
            response: record.adminResponse || "",
            status: record.status === "open" ? "resolved" : record.status,
        });
    };

    const closeModal = () => {
        setActiveRequest(null);
        form.resetFields();
    };

    const handleRespond = async () => {
        if (!activeRequest) return;
        try {
            const values = await form.validateFields();
            await respondToSupportRequest({
                id: activeRequest.id,
                response: values.response,
                status: values.status,
            }).unwrap();
            toast.success("Response sent successfully");
            closeModal();
            refetch();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to send response"));
        }
    };

    const columns: TableProps<SupportRequest>["columns"] = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "From",
            key: "from",
            render: (_, record) =>
                record.user ? `${record.user.firstName} ${record.user.lastName}` : record.contact || "Anonymous",
        },
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
            title: "Submitted",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <a className="text-blue-500 hover:underline" onClick={() => openRespondModal(record)}>
                    {record.adminResponse ? "Update response" : "Respond"}
                </a>
            ),
        },
    ];

    return (
        <>
            <Header pageTitle="Support Requests" />
            <CustomDashboardLayout>
                <div className="mb-4 flex items-center gap-4">
                    <Select
                        allowClear
                        placeholder="Filter by status"
                        style={{ width: 200 }}
                        onChange={(value) => setStatusFilter(value)}
                    >
                        <Option value="open">Open</Option>
                        <Option value="in_progress">In progress</Option>
                        <Option value="resolved">Resolved</Option>
                    </Select>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={data?.data}
                        rowKey="id"
                        pagination={false}
                    />
                )}

                <Modal
                    open={!!activeRequest}
                    title={activeRequest ? `Respond to request #${activeRequest.id}` : ""}
                    onCancel={closeModal}
                    footer={[
                        <Button key="cancel" onClick={closeModal}>Cancel</Button>,
                        <Button key="submit" type="primary" loading={isResponding} onClick={handleRespond}>
                            Send response
                        </Button>,
                    ]}
                >
                    {activeRequest && (
                        <div className="space-y-4">
                            <p className="text-gray-600">{activeRequest.description}</p>
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Response"
                                    name="response"
                                    rules={[{ required: true, message: "Please enter a response" }]}
                                >
                                    <TextArea rows={4} placeholder="Write your response to the user" />
                                </Form.Item>
                                <Form.Item label="Status" name="status">
                                    <Select>
                                        <Option value="open">Open</Option>
                                        <Option value="in_progress">In progress</Option>
                                        <Option value="resolved">Resolved</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </Modal>
            </CustomDashboardLayout>
        </>
    );
};

export default SupportRequestsTable;
