import { Input, Form, Button, Avatar } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { uploadImage, validateFile } from "../../utils/uploadImage";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const AdditionalInformationPage = ({ formData, setFormData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [avatarUrl, setAvatarUrl] = useState<string>(formData.profilePicture || "");

    useEffect(() => {
        form.setFieldsValue({
            profilePicture: formData.profilePicture || "",
            bio: formData.bio || "",
        });
    }, [formData]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validateFile(file)) return;

        try {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                setAvatarUrl(imageUrl);
                setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
                form.setFieldsValue({ profilePicture: imageUrl });
            }
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    return (
        <div className="space-y-1">
            <div className="mt-1">
                <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                    <p>Additional Information</p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={{ profilePicture: formData.profilePicture, bio: formData.bio }}
                onValuesChange={(allValues) => {
                    setFormData((prev) => ({ ...prev, ...allValues }));
                }}
            >
                <div className="flex items-start gap-4">
                    <div className="relative mr-10">
                        <Avatar
                            size={80}
                            icon={<UserOutlined />}
                            src={avatarUrl || "https://via.placeholder.com/80"}
                        />
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-500 absolute bottom-0 right-0 translate-y-1/4 bg-white/80 backdrop-blur-sm border-none shadow-sm"
                            onClick={handleAvatarClick}
                        />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                </div>
                <Form.Item label="About me" className="my-14" name="bio">
                    <TextArea placeholder="Write something about yourself" allowClear />
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdditionalInformationPage;
