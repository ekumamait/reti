import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, Form } from "antd";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "../../services/users.ts";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RegisterUserDto } from "../../services/types.ts";

const RegisterForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [registerUser, { isLoading, isSuccess, data }] = useRegisterMutation()
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const fullPhoneNumber = `+256${values.phoneNumber.replace(/^0/, '')}`;
            await registerUser(
                {
                    phoneNumber: fullPhoneNumber,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName
                } as RegisterUserDto).unwrap();
        } catch (e) {
            if (e) {
                toast.error('Something went wrong');
            }
        }
    }
    const onFinishFailed = (error: any) => {
        toast.error("Something went wrong", error)
    };

    useEffect(() => {
        if (isSuccess) {
            const results = JSON.stringify(data)
            localStorage.setItem('userDetails', results)
            toast.success('Account created successfully')
            navigate("/login");
        }
    }, [isSuccess, data]);

    return (
        <>
            <Form
                layout="vertical"
                form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Form.Item>
                    <Form.Item
                        style={{ display: 'inline-block', width: '50%', margin: '0' }}
                        label="First Name" name="firstName">
                        <Input
                            size="large"
                            placeholder="Enter your first name"
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px' }}
                        label="Last name" name="lastName">
                        <Input size="large" placeholder="Enter your Last name" type="text" />
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        { required: true, message: 'Please enter your phone number!' },
                        {
                            pattern: /^[0-9]{9}$/,
                            message: 'Phone number must be exactly 9 digits!'
                        }
                    ]}>
                    <Input
                        size='large'
                        placeholder="Enter your phone number"
                        className="rounded-md border-gray-300"
                        prefix={<span>+256</span>}
                    />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input
                        size='large'
                        placeholder="Enter password"
                        type={passwordVisible ? "text" : "password"}
                        suffix={
                            passwordVisible ? (
                                <EyeOutlined className='text-gray-400'
                                    onClick={() => setPasswordVisible(false)} />
                            ) : (
                                <EyeInvisibleOutlined className='text-gray-400'
                                    onClick={() => setPasswordVisible(true)} />
                            )
                        }
                    />
                </Form.Item>
                <Form.Item label="Confirm password">
                    <Input
                        size='large'
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
                        block
                        htmlType="submit"
                        type="primary"
                        size='large'
                        loading={isLoading}
                        style={{ backgroundColor: '#FF0000' }}
                    >
                        Sign up
                    </Button>
                </div>
            </Form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account? {' '}
                <Link className="text-red-500 hover:text-red-700 hover:underline" to="/login">Sign
                    in</Link>
            </p>
        </>
    )
}

export default RegisterForm;