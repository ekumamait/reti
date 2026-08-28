import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, Form, Checkbox } from "antd";
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
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const fullPhoneNumber = `+256${values.phoneNumber.replace(/^0/, '')}`;
            await registerUser(
                {
                    phoneNumber: fullPhoneNumber,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    acceptedTerms: !!values.consent
                } as RegisterUserDto).unwrap();
        } catch (e) {
            toast.error(e?.data?.message || "Unable to create account. Please try again.");
        }
    }
    const onFinishFailed = () => {
        toast.error("Please fill in all required fields correctly.");
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
                            pattern: /^7[0-9]{8}$/,
                            message: 'Enter a valid Uganda mobile number (9 digits, starting with 7)'
                        }
                    ]}>
                    <Input
                        size='large'
                        placeholder="Enter your phone number"
                        className="rounded-md border-gray-300"
                        prefix={<span>+256</span>}
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter a password!' },
                        { min: 8, message: 'Password must be at least 8 characters!' }
                    ]}
                    hasFeedback
                >
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
                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
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
                <Form.Item 
                    name="consent"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions to proceed')),
                        },
                    ]}
                >
                    <Checkbox 
                        className="text-sm text-gray-600"
                        onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    >
                        I agree to RETI's{' '}
                        <Link to="/terms" className="text-red-500 hover:text-red-700 hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-red-500 hover:text-red-700 hover:underline">
                            Privacy Policy
                        </Link>
                    </Checkbox>
                </Form.Item>
                <div>
                    <Button
                        block
                        htmlType="submit"
                        type="primary"
                        size='large'
                        loading={isLoading}
                        disabled={!isTermsAccepted}
                        style={{ 
                            backgroundColor: isTermsAccepted ? '#FF0000' : '#ccc',
                            cursor: isTermsAccepted ? 'pointer' : 'not-allowed'
                        }}
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