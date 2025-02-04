import { Form, Input, Button, Modal, message } from 'antd';
import 'antd/dist/reset.css';
import { useSendSupportRequestMutation } from "../../../services/support"
import { toast } from 'react-toastify';

const { TextArea } = Input;

const HelpandsupportForm = ({ onOk, onCancel, open, loading }) => {
    const [form] = Form.useForm();
    const [sendSupportRequest] = useSendSupportRequestMutation();
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const response = await sendSupportRequest({
                contact: values.contact,
                description: values.description
            }).unwrap();
            console.log(response);
            toast.success(response.message);
            onOk();
        } catch (err) {
            toast.error('Support request failed:', err);
        }
    };

    return (
        <div className="space-y-4">
            <Modal
                open={open}
                onOk={onOk}
                onCancel={onCancel}
                style={{ backdropFilter: 'blur(10px)' }}
                title={
                    <div>
                        <h2 className="text-lg font-semibold">Help & Support</h2>
                        <p className="text-sm font-normal text-gray-500">
                            Contact us at support@example.com <br />
                        </p>
                    </div>
                }
                footer={[
                    <Button key="back" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                        Submit
                    </Button>
                ]}
            >
                <div className="mt-4 p-2">
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Contact"
                            name="contact"
                            rules={[{ required: true, message: 'Please enter a valid contact' }]}
                        >
                            <Input placeholder="e.g. 0705999239" size='large' />
                        </Form.Item>

                        {/* Job Description */}
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please describe your issue' }]}
                        >
                            <TextArea rows={4} placeholder="Describe the assistance you need" />
                        </Form.Item>

                    </Form>
                </div>
            </Modal>
        </div>
    )
}

export default HelpandsupportForm;
