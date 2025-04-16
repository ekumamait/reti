import { DatePicker, Form, Input, Select } from "antd";
import { userDetails, validateDOB } from "../../utils.ts";

const InformationPage = ({ form, setFormData }) => {
    
    const userDetailsData = userDetails();
    const user = userDetailsData?.user || {};

    return (
        <>
            <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                <p>General Information</p>
            </div>

            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: '100%' }}
                initialValues={{
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    phoneNumber: user?.phoneNumber,
                    prefix: "256",
                }}
                onValuesChange={(_, allValues) => {
                    setFormData(prev => ({ ...prev, ...allValues }));
                }}
            >
                <Form.Item className="my-24">
                    <Form.Item
                        style={{ display: 'inline-block', width: '50%', margin: '0' }}
                        label="First Name"
                        name="firstName"
                    >
                        <Input size="large" placeholder="Enter your first name" type="text" disabled />
                    </Form.Item>
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px' }}
                        label="Last name"
                        name="lastName"
                    >
                        <Input size="large" placeholder="Enter your Last name" type="text" disabled />
                    </Form.Item>
                </Form.Item>

                <Form.Item className="my-24">
                    <Form.Item
                        style={{ display: 'inline-block', width: '50%', margin: '0' }}
                        label="Date of birth"
                        name="dateOfBirth"
                        rules={[{
                            validator: (_, value) => validateDOB(_, value?.format('YYYY-MM-DD')), required: true }]}
                    >
                        <DatePicker size="large" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px' }}
                        label="Gender"
                        name="gender"
                        rules={[{ required: true }]}
                    >
                        <Select size="large" defaultValue="Select">
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                        </Select>
                    </Form.Item>
                </Form.Item>

                <Form.Item className="my-24">
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px' }}
                        label="Email address"
                        name="email"
                        rules={[{ required: true }]}
                    >
                        <Input size="large" placeholder="Enter your email" type="email" />
                    </Form.Item>
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px' }}
                        label="Phone number"
                        name="phoneNumber"
                    >
                        <Input size="large" disabled />
                    </Form.Item>
                </Form.Item>
            </Form>
        </>
    );
};

export default InformationPage;
