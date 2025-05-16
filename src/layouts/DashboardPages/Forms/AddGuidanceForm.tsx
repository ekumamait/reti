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
      initialData: { id: number; imageUrl?: string; content: string } | null;
      onOk: () => void;
      onCancel: () => void;
      open: boolean;
      loading: boolean;
    }
  | {
      isEdit?: false;
      initialData?: undefined;
      onOk: () => void;
      onCancel: () => void;
      open: boolean;
      loading: boolean;
    };

const AddInspirationsForm = (props: FormProps) => {
    const [form] = Form.useForm();
    const [addInspiration] = useAddInspirationMutation();
    const [updateInspiration] = useUpdateInspirationMutation();
    const [imageUrl, setImageUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.isEdit && props.initialData) {
            form.setFieldsValue({
                content: props.initialData.content,
                imageUrl: props.initialData.imageUrl || "",
            });
            setImageUrl(props.initialData.imageUrl || "");
        } else {
            form.resetFields();
            setImageUrl("");
        }
    }, [props.isEdit, props.initialData, form]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (imageUrl) {
            toast.error(`You can only upload 1 image`);
            return;
        }
        if (!validateFile(file)) return;
        try {
            const uploadedImageUrl = await uploadImage(file);
            if (uploadedImageUrl) {
                setImageUrl(uploadedImageUrl);
                form.setFieldsValue({ imageUrl: uploadedImageUrl });
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
        form.setFieldsValue({ imageUrl: '' });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                imageUrl: imageUrl,
            };

            if (props.isEdit && props.initialData) {
                await updateInspiration({
                    ...payload,
                    id: props.initialData.id,
                }).unwrap();
                toast.success('Inspiration updated successfully');
            } else {
                await addInspiration(payload).unwrap();
                toast.success('Inspiration added successfully');
            }

            props.onOk();
            form.resetFields();
            setImageUrl("");
        } catch (error) {
            console.error('Operation failed:', error);
            toast.error(`Failed to ${props.isEdit ? 'update' : 'add'} inspiration`);
        }
    };

    return (
        <Modal
            open={props.open}
            onCancel={props.onCancel}
            title={props.isEdit ? "Edit Inspiration" : "Create an Inspiration"}
            footer={[
                <Button key="back" onClick={props.onCancel}>Cancel</Button>,
                <Button key="submit" type="primary" loading={props.loading} onClick={handleSubmit}>
                    {props.isEdit ? 'Save Changes' : 'Submit'}
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Inspiration Description"
                    name="content"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <TextArea rows={4} placeholder="Enter description" />
                </Form.Item>

                <Form.Item label="">
                    <div className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            {imageUrl && (
                                <div className="relative">
                                    <Image
                                        src={imageUrl}
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

                        {!imageUrl && (
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