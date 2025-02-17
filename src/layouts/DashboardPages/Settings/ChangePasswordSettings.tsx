import { Button, Form, Input, Layout } from "antd";

import { Content } from "antd/es/layout/layout";
import { useGetUserProfileQuery, useUpdateProfileMutation } from "../../../services/profiles";
import { loginDetails } from "../../../utils";
import { toast } from "react-toastify";

const ChangePasswordSettings = () => {
    const [emailForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const { data, refetch } = useGetUserProfileQuery(
        loginDetails().user.id
    );
    const [updateUser] = useUpdateProfileMutation();

    const handleEmailUpdate = async (values) => {
        try {
            await updateUser({
                profile: { email: values.email },
                profileId: loginDetails()?.user.id,
            }).unwrap();
            toast.success("Email updated successfully!");
            await refetch();
        } catch (e) {
            let message = "Try again";
            if (typeof e.data.message === "string") {
                message = e.data.message;
            } else {
                message = e.data.message[0];
            }
            toast.error(`Something went wrong ${message}`);
        }
    };

    const handlePasswordUpdate = async (values) => {
        try {
            await updateUser({
                profile: {
                    oldPassword: values.oldPassword,
                    password: values.password
                },
                profileId: loginDetails()?.user.id,
            }).unwrap();
            toast.success("Password updated successfully!");
            passwordForm.resetFields();
            await refetch();
        } catch (e) {
            let message = "Try again";
            if (typeof e.data.message === "string") {
                message = e.data.message;
            } else {
                message = e.data.message[0];
            }
            toast.error(`Password update failed: ${message}`);
        }
    };

    return (
        <div className="mt-2 w-full">
            <Layout>
                <Content className="p-4 sm:p-6 max-w-3xl border border-gray-200 rounded-md bg-white shadow-sm">
                    <div className="py-2 space-y-6">
                        {/* Password Change Section */}
                        <div className="space-y-4">
                            <div className="sm:flex sm:justify-between">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-900">Change password</h2>
                                    <p className="pt-1 text-xs sm:text-sm text-gray-600">Update your account password</p>
                                </div>
                            </div>

                            <Form 
                                form={passwordForm} 
                                layout="vertical" 
                                className="space-y-4"
                                onFinish={handlePasswordUpdate}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Form.Item
                                        label="Current Password"
                                        name="oldPassword"
                                        rules={[{ required: true, message: 'Please input your current password!' }]}
                                        labelCol={{ className: "text-xs sm:text-sm font-medium text-gray-600" }}
                                        disabled
                                        // value={data?.data.email}
                                    >
                                        <Input.Password
                                            size="middle"
                                            className="text-sm sm:text-base rounded-md"
                                            placeholder="Current password"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="New Password"
                                        name="password"
                                        rules={[{ 
                                            required: true,
                                            message: 'Please input your new password!',
                                            min: 6,
                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                                        }]}
                                        labelCol={{ className: "text-xs sm:text-sm font-medium text-gray-600" }}
                                    >
                                        <Input.Password
                                            size="middle"
                                            className="text-sm sm:text-base rounded-md"
                                            placeholder="New password"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base rounded-md"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        </div>

                        {/* Email Change Section */}
                        <div className="space-y-4">
                            <div className="sm:flex sm:justify-between">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-900">Change email</h2>
                                    <p className="pt-1 text-xs sm:text-sm text-gray-600">Update your email address</p>
                                </div>
                            </div>

                            <Form
                                initialValues={{
                                    email: data?.data.email,
                                }}
                                form={emailForm}
                                layout="vertical"
                                className="space-y-4"
                                onFinish={handleEmailUpdate}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Form.Item
                                        label="Current Email"
                                        labelCol={{ className: "text-xs sm:text-sm font-medium text-gray-600" }}
                                    >
                                        <Input
                                            size="middle"
                                            className="text-sm sm:text-base rounded-md"
                                            placeholder="john@gmail.com"
                                            disabled
                                            value={data?.data.email}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="New Email"
                                        name="email"
                                        labelCol={{ className: "text-xs sm:text-sm font-medium text-gray-600" }}
                                    >
                                        <Input
                                            size="middle"
                                            className="text-sm sm:text-base rounded-md"
                                            placeholder="john@gmail.com"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base rounded-md"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        </div>

                        {/* Deactivate Section */}
                        <div className="space-y-4">
                            <div className="border-t border-gray-200 pt-4">
                                <Button
                                    size="middle"
                                    danger
                                    className="w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base rounded-md"
                                >
                                    Deactivate my account
                                </Button>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </div>
    )
};

export default ChangePasswordSettings;