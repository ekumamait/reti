import { Form, Button, Input } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../../services/users.ts";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
    const [form] = Form.useForm();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { email: string }) => {
        try {
            await forgotPassword({ email: values.email }).unwrap();
            setSubmitted(true);
            navigate("/reset-password-link");
        } catch (error) {
            toast.error(error?.data?.message || "Unable to send reset link. Please try again.");
        }
    };

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email address" },
                            { type: "email", message: "Please enter a valid email address" },
                        ]}
                    >
                        <Input placeholder="Enter your email" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isLoading}
                            disabled={submitted}
                            className="flex w-full justify-center px-3 py-4 text-sm/6 font-semibold text-white"
                        >
                            Reset your password
                        </Button>
                    </Form.Item>
                </Form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remembered your password? {''}
                    <a href="/login" className=" text-[#5B9BD5] hover:text-[#5B9BD5] hover:underline">Log in</a>
                </p>
            </div>
        </>
    )
}

export default ResetPasswordForm;
