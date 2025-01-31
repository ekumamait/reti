import { Form, Input, Button, Modal } from 'antd';
import 'antd/dist/reset.css';

const { TextArea } = Input;



const HelpandsupportForm = ({ onOk, onCancel, open, loading }) => {

    const [form] = Form.useForm();

    const handleSubmit = () => {
        form
            .validateFields() // Validate form fields
            .then((values) => {
                console.log('Form Values:', values); // Replace with actual submission logic
                onOk(); // close modal
            })
            .catch((info) => {
                console.log('Validation Failed:', info);
            });
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
                            label="Contact Email"
                            name="contactEmail"
                            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                        >
                            <Input placeholder="e.g. john@example.com" size='large' />
                        </Form.Item>

                        {/* Job Description */}
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please enter the kind of support need' }]}
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
