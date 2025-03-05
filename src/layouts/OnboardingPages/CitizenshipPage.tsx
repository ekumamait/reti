import { Form, Select, Input } from 'antd';

const CitizenshipPage = ({ formData, setFormData }) => {
    const [form] = Form.useForm();

    return (
        <div>
            <h1 className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9 mb-6">
                Are you a citizen or Refugee?
            </h1>
            <Form
                form={form}
                layout="vertical"
                initialValues={formData.citizenshipData || {}}
                onValuesChange={(_, allValues) => {
                    setFormData((prev) => ({ ...prev, citizenshipData: allValues }));
                }}
            >
                <Form.Item
                    name="nationality"
                    label="Nationality"
                    rules={[{ required: true, message: 'Please select your nationality' }]}
                    className="my-24"
                >
                    <Select placeholder="Select your nationality" size="large">
                        <Select.Option value="ugandan">National - Ugandan</Select.Option>
                        <Select.Option value="south_sudan">Refugee - South Sudan</Select.Option>
                        <Select.Option value="congolese">Refugee - Congolese</Select.Option>
                        <Select.Option value="rwandese">Refugee - Rwandese</Select.Option>
                        <Select.Option value="burundian">Refugee - Burundian</Select.Option>
                        <Select.Option value="somali">Refugee - Somali</Select.Option>
                        <Select.Option value="sudanese">Refugee - Sudanese</Select.Option>
                        <Select.Option value="others">Refugee - Others</Select.Option>
                    </Select>
                </Form.Item>

                {form.getFieldValue('nationality') === 'ugandan' && (
                    <Form.Item
                        name="nin"
                        label="National Identification Number (NIN)"
                        rules={[{ required: true, message: 'Please enter your NIN' }]}
                        className="my-24"
                    >
                        <Input size="large" placeholder="Enter your NIN" />
                    </Form.Item>
                )}

                {form.getFieldValue('nationality') !== 'ugandan' && (
                    <>
                        <Form.Item
                            name="groupNumber"
                            label="Group Number"
                            rules={[{ required: true, message: 'Please enter your Group Number' }]}
                            className="my-20"
                        >
                            <Input size="large" placeholder="Enter your Group Number" />
                        </Form.Item>
                        <Form.Item
                            name="individualNumber"
                            label="Individual Number"
                            rules={[{ required: true, message: 'Please enter your Individual Number' }]}
                            className="my-20"
                        >
                            <Input size="large" placeholder="Enter your Individual Number" />
                        </Form.Item>
                    </>
                )}
            </Form>
        </div>
    );
};

export default CitizenshipPage;