import { useState } from 'react';
import { Button, Input } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const ForgotPasswordForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Password</label>
                        <div className="mt-2">
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
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Confirm password</label>
                        <div className="mt-2">
                            <Input
                                placeholder="Confirm password"
                                type={confirmPasswordVisible ? "text" : "password"}
                                suffix={
                                    confirmPasswordVisible ? (
                                        <EyeOutlined className='text-gray-400'
                                        onClick={() => setConfirmPasswordVisible(false)} />
                                    ) : (
                                        <EyeInvisibleOutlined className='text-gray-400' onClick={() => setConfirmPasswordVisible(true)} />
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="primary" className="flex w-full justify-center px-3 py-4 text-sm/6 font-semibold text-white">Change password</Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ForgotPasswordForm;