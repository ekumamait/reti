import { Button, Col, Form, Input, Layout, Row } from "antd";

import { Content } from "antd/es/layout/layout";


const ChangePasswordSettings = () => {
    const [form] = Form.useForm();
    const handleFinish = (values) => {
        console.log(values, 'values')
    }

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

                            <Form form={form} layout="vertical" className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Form.Item
                                        label="Current Password"
                                        name="oldPassword"
                                        labelCol={{ className: "text-xs sm:text-sm font-medium text-gray-600" }}
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

                            <Form form={form} layout="vertical" className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        labelCol={{ className: "text-xs sm:text-sm font-medium text-gray-600" }}
                                    >
                                        <Input.Password 
                                            size="middle"
                                            className="text-sm sm:text-base rounded-md"
                                            placeholder="Current password"
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