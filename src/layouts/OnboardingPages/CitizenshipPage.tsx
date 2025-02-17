import { Form, Radio, Select, Input } from 'antd';

const CitizenshipPage = ({ formData, setFormData }) => {
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={formData.citizenshipData || {}}
            onValuesChange={(_, allValues) => {
                setFormData((prev) => ({ ...prev, citizenshipData: allValues }));
            }}
        >
            <Form.Item
                name="citizenshipStatus"
                label="Are You a Ugandan Citizen or a Refugee?"
                rules={[{ required: true, message: 'Please select your citizenship status' }]}
            >
                <Radio.Group>
                    <Radio value="ugandan">Ugandan Citizen</Radio>
                    <Radio value="refugee">Refugee</Radio>
                </Radio.Group>
            </Form.Item>

            {form.getFieldValue('citizenshipStatus') === 'refugee' && (
                <>
                    <Form.Item
                        name="nationalityCategory"
                        label="Nationality Category"
                        rules={[{ required: true, message: 'Please select your nationality category' }]}
                    >
                        <Select placeholder="Select your nationality">
                            <Select.Option value="south_sudan">Refugee - South Sudan</Select.Option>
                            <Select.Option value="congolese">Refugee - Congolese</Select.Option>
                            <Select.Option value="rwandese">Refugee - Rwandese</Select.Option>
                            <Select.Option value="burundian">Refugee - Burundian</Select.Option>
                            <Select.Option value="somali">Refugee - Somali</Select.Option>
                            <Select.Option value="sudanese">Refugee - Sudanese</Select.Option>
                            <Select.Option value="others">Refugee - Others</Select.Option>
                            <Select.Option value="ugandan">National/Ugandan</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="uniqueIdNo"
                        label="Unique Identification No."
                        rules={[{ required: true, message: 'Please enter your Unique Identification Number' }]}
                    >
                        <Input placeholder="Enter your Unique Identification Number" />
                    </Form.Item>
                </>
            )}

            {form.getFieldValue('citizenshipStatus') === 'ugandan' && (
                <Form.Item
                    name="nin"
                    label="National Identification Number (NIN)"
                    rules={[{ required: true, message: 'Please enter your NIN' }]}
                >
                    <Input placeholder="Enter your NIN" />
                </Form.Item>
            )}
        </Form>
    );
};

export default CitizenshipPage; 