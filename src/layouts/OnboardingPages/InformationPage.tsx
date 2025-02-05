import {Button, DatePicker, Form, Input, Select} from "antd";
import {userDetails, validateDOB} from "../../utils.ts";
import moment from "moment";

const InformationPage = ({setInformData}) => {
    const [form] = Form.useForm();
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
                style={{maxWidth: '100%'}}
                initialValues={{
                    "firstName": user?.firstName,
                    "lastName": user?.lastName,
                    "phoneNumber": user?.phoneNumber,
                    "prefix": "256",
                }}
            >
                <Form.Item className="my-24">
                    <Form.Item
                        style={{display: 'inline-block', width: '50%', margin: '0'}}
                        label="First Name" name="firstName">
                        <Input
                            size="large"
                            placeholder="Enter your first name"
                            type="text"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        style={{display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px'}}
                        label="Last name" name="lastName">
                        <Input size="large" placeholder="Enter your Last name" type="text" disabled/>
                    </Form.Item>
                </Form.Item>

                <Form.Item className="my-24">
                    <Form.Item
                        style={{display: 'inline-block', width: '50%', margin: '0'}}
                        label="Date of birth" name="dateOfBirth" rules={[{ validator: validateDOB }]}>
                        <DatePicker size="large" className="w-full"/>
                    </Form.Item>

                    <Form.Item
                        style={{display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px'}}
                        label="Gender" name="gender">
                        <Select size="large" defaultValue="other">
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                        </Select>
                    </Form.Item>
                </Form.Item>
                <Form.Item className="my-24">
                    <Form.Item
                        style={{display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px'}}
                        label="Email address" name="email">
                        <Input
                            size="large"
                            placeholder="Enter your email"
                            type="email"
                        />
                    </Form.Item>
                    <Form.Item
                        style={{display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0 0 8px'}}
                        label="Phone number" name="phoneNumber">
                        <Input size="large" disabled/>
                    </Form.Item>
                </Form.Item>
                <Form.Item className="my-24">
                    <Button type="default" block onClick={() => {
                        const values = form.getFieldsValue();
                        setInformData({
                            "dateOfBirth": values.dateOfBirth,
                            "age": moment().diff(moment(values.dateOfBirth), 'years'),
                            "gender": values.gender,
                            "phoneNumber": `${values.prefix}${values.phoneNumber}`,
                            values});
                    }}>Next</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default InformationPage;
