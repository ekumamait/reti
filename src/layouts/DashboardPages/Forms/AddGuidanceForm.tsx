import { Form, Input, Modal, Button } from 'antd';
import { useAddInspirationMutation, useUpdateInspirationMutation } from '../../../services/inspirations';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const { TextArea } = Input;

const AddInspirationsForm = ({ onOk, onCancel, open, loading, initialData, isEdit = false }) => {
    const [form] = Form.useForm();
    const [addInspiration] = useAddInspirationMutation();
    const [updateInspiration] = useUpdateInspirationMutation();

    useEffect(() => {
        if (initialData && open && isEdit) {
            form.setFieldsValue({
                inspirationTitle: initialData.title,
                inspirationDescription: initialData.content,
            });
        } else {
            form.resetFields();
        }
    }, [form, initialData, open, isEdit]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                title: values.inspirationTitle,
                content: values.inspirationDescription,
            };

            if (isEdit) {
                await updateInspiration({ 
                    id: initialData.id, 
                    body: payload 
                }).unwrap();
                toast.success('Inspiration updated successfully');
            } else {
                await addInspiration(payload).unwrap();
                toast.success('Inspiration added successfully');
            }
            form.resetFields();
            onOk();
        } catch (error) {
            console.error('Operation failed:', error);
            toast.error(`Failed to ${isEdit ? 'update' : 'add'} inspiration`);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title={isEdit ? "Edit Inspiration" : "Create an Inspiration"}
            footer={[
                <Button key="back" onClick={onCancel}>Cancel</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    {isEdit ? 'Save Changes' : 'Submit'}
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Inspiration Title"
                    name="inspirationTitle"
                    rules={[{ required: true, message: 'Please enter the inspiration title' }]}
                >
                    <Input placeholder="Enter title" />
                </Form.Item>

                <Form.Item
                    label="Inspiration Description"
                    name="inspirationDescription"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <TextArea rows={4} placeholder="Enter description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddInspirationsForm;
