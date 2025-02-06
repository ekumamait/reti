import { Form, Input, Modal, Button, Image } from 'antd';
import { useAddInspirationMutation, useUpdateInspirationMutation } from '../../../services/inspirations';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import React from 'react';
import { validateFile, uploadImage } from '../../../utils/uploadImage';

const { TextArea } = Input;

type FormProps =
    | {
        isEdit: true;
        initialData: { id: number; images: string; content: string };
        onOk: () => void;
        onCancel: () => void;
        open: boolean;
        loading: boolean;
    }
    | {
        isEdit?: false;
        initialData?: never;
        onOk: () => void;
        onCancel: () => void;
        open: boolean;
        loading: boolean;
    };

const AddInspirationsForm = ({ onOk, onCancel, open, loading, initialData, isEdit = false }: FormProps) => {
    const [form] = Form.useForm();
    const [addInspiration] = useAddInspirationMutation();
    const [updateInspiration] = useUpdateInspirationMutation();
    const [uploadedImages, setUploadedImages] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_IMAGES = 1;

    useEffect(() => {
        if (isEdit && open && initialData) {
            form.setFieldsValue({
                inspirationDescription: initialData.content,
                images: initialData.images || ''
            });
            setUploadedImages(initialData.images || '');
        } else {
            form.resetFields();
            setUploadedImages('');
        }
    }, [form, initialData, open, isEdit]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (uploadedImages) {
            toast.error(`You can only upload 1 image`);
            return;
        }
        if (!validateFile(file)) return;
        try {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                setUploadedImages(imageUrl);
                form.setFieldsValue({ images: imageUrl });
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    const handleRemoveImage = () => {
        setUploadedImages('');
        form.setFieldsValue({ images: '' });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                imageUrl: uploadedImages,
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
                    label="Inspiration Description"
                    name="inspirationDescription"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <TextArea rows={4} placeholder="Enter description" />
                </Form.Item>

                <Form.Item label="">
                    <div className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            {uploadedImages && (
                                <div className="relative">
                                    <Image
                                        src={uploadedImages}
                                        alt="Inspiration image"
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-lg"
                                    />
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        className="absolute top-0 right-0 text-red-500 bg-white rounded-full"
                                        onClick={handleRemoveImage}
                                    />
                                </div>
                            )}
                        </div>

                        {uploadedImages?.length < MAX_IMAGES && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    icon={<UploadOutlined />}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Add Image
                                </Button>
                            </>
                        )}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddInspirationsForm;
