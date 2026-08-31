import { useState } from 'react';
import { Form, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../../services/users.ts';

const ForgotPasswordForm = () => {
    const [form] = Form.useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const onFinish = async (values: { password: string }) => {
        if (!token) {
            toast.error('This reset link is missing its token. Please request a new one.');
            return;
        }
        try {
            const response = await resetPassword({ token, newPassword: values.password }).unwrap();
            toast.success(response.message || 'Password reset successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error?.data?.message || 'Unable to reset password. The link may have expired.');
        }
    };

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                {!token && (
                    <p className="mb-4 text-center text-sm text-red-500">
                        This link is missing a reset token. Please request a new password reset link.
                    </p>
                )}
                <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter a new password' },
                            { min: 8, message: 'Password must be at least 8 characters!' },
                        ]}
                        hasFeedback
                    >
                        <Input
                            placeholder="Enter password"
                            type={passwordVisible ? "text" : "password"}
                            suffix={
                                passwordVisible ? (
                                    <EyeOutlined className='text-gray-400' onClick={() => setPasswordVisible(false)} />
                                ) : (
                                    <EyeInvisibleOutlined className='text-gray-400' onClick={() => setPasswordVisible(true)} />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm password"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input
                            placeholder="Confirm password"
                            type={confirmPasswordVisible ? "text" : "password"}
                            suffix={
                                confirmPasswordVisible ? (
                                    <EyeOutlined className='text-gray-400'
                                        onClick={() => setConfirmPasswordVisible(false)} />
                                ) : (
                                    <EyeInvisibleOutlined className='text-gray-400'
                                        onClick={() => setConfirmPasswordVisible(true)} />
                                )
                            }
                        />
                    </Form.Item>

                    <div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={!token}
                            className="flex w-full justify-center px-3 py-4 text-sm/6 font-semibold text-white"
                        >
                            Change password
                        </Button>
                    </div>
                </Form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    <Link to="/login" className="text-[#5B9BD5] hover:underline">Back to login</Link>
                </p>
            </div>
        </>
    )
}

export default ForgotPasswordForm;
