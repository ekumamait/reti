import { EditOutlined, InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Spin, Form, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from "../../../services/profiles.ts";
import { loginDetails } from "../../../utils.ts";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Dragger from "antd/es/upload/Dragger";
import { uploadImage, validateFile } from "../../../utils/uploadImage.ts";
import { toast } from "react-toastify";

const PersonalDetailsSettings = () => {
  const { data, isLoading, isError, error, refetch } = useGetUserProfileQuery(
    loginDetails().user.id
  );
  const [updateUser, { isSuccess }] = useUpdateProfileMutation();
  const [form] = Form.useForm();

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isError, error]);

  const handleFinish = async (values) => {
    try {
      await updateUser({
        data: { ...values, profileImage: avatarUrl },
        profileId: loginDetails()?.user.id,
      }).unwrap();

      // Update local storage
      const currentUser = loginDetails();
      if (currentUser) {
        currentUser.profileImage = avatarUrl;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }

      // Force refetch of user profile data to update sidebar
      await refetch();

      notification.success({
        message: "Success",
        description: "Profile updated successfully!",
      });
    } catch (e) {
      let message = "Try again";
      if (typeof e.data.message === "string") {
        message = e.data.message;
      } else {
        message = e.data.message[0];
      }
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (data?.data.user.profilePicture) {
      setAvatarUrl(data.data.user.profilePicture);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully");
    }
  }, [isSuccess]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setUploadedImages((prev) => [...prev, imageUrl]);
        setAvatarUrl(imageUrl);
        form.setFieldsValue({ profilePicture: imageUrl });
        notification.success({
          message: "Success",
          description: "Image uploaded successfully!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    }
  };

  return (
    <Content className="p-6 max-w-3xl border border-gray-200 rounded-md bg-white shadow-sm">
      <div className="py-2">
        {!isLoading && (
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              firstName: data?.data.user.firstName,
              lastName: data?.data.user.lastName,
              email: data?.data.email,
              phoneNumber: data?.data.user.phoneNumber,
              gender: data?.data.gender,
              bio: data?.data.bio,
              dateOfBirth: moment(data?.data.dateOfBirth),
              prefix: "256",
            }}
            onFinish={handleFinish}
            className="space-y-6"
          >
            {/* Bio Data Section */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-medium text-gray-700">Bio Data</h2>
              </div>
              
              <div className="flex items-start gap-4">
                <div>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={
                      avatarUrl ||
                      data?.data.profileImage ||
                      "https://via.placeholder.com/80"
                    }
                  />
                  <p className="text-md font-semibold mt-2">
                    {data &&
                      `${data?.data.user.firstName} ${data?.data.user.lastName}`}
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  className="text-blue-500 mt-2"
                  onClick={handleAvatarClick}
                >
                  Change avatar
                </Button>

                {isLoading && (
                  <div className="w-auto text-center">
                    <Spin size="large" />
                  </div>
                )}

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      className="mb-0"
                      labelCol={{ className: "text-sm font-medium text-gray-600" }}
                    >
                      <Input bordered size="large" className="rounded-md" />
                    </Form.Item>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      className="mb-0"
                      labelCol={{ className: "text-sm font-medium text-gray-600" }}
                    >
                      <Input bordered size="large" className="rounded-md" />
                    </Form.Item>
                  </div>
                  
                  <Form.Item 
                    label="Phone number" 
                    name="phoneNumber"
                    labelCol={{ className: "text-sm font-medium text-gray-600" }}
                  >
                    <Input bordered size="large" className="rounded-md" />
                  </Form.Item>

                  <Form.Item 
                    label="Role"
                    labelCol={{ className: "text-sm font-medium text-gray-600" }}
                  >
                    <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
                      Tailor
                    </div>
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-medium text-gray-700">Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Form.Item
                  label="Street"
                  name="street"
                  labelCol={{ className: "text-sm font-medium text-gray-600" }}
                >
                  <Input bordered size="large" className="rounded-md" />
                </Form.Item>
                <Form.Item
                  label="Plot Number"
                  name="plotNumber"
                  labelCol={{ className: "text-sm font-medium text-gray-600" }}
                >
                  <Input bordered size="large" className="rounded-md" />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  labelCol={{ className: "text-sm font-medium text-gray-600" }}
                >
                  <Input bordered size="large" className="rounded-md" />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country"
                  labelCol={{ className: "text-sm font-medium text-gray-600" }}
                >
                  <Input bordered size="large" className="rounded-md" />
                </Form.Item>
              </div>
            </div>

            {/* id */}

            <div>
              <div className="sm:flex sm:justify-between">
                <div>
                  <h2 className="text-md font-semibold text-gray-900">
                    Identification
                  </h2>
                </div>
              </div>

              {/* profile picture and inputs */}
              <div className="sm:flex gap-10 py-4">
                {isLoading && (
                  <div className="w-auto text-center">
                    <Spin size="large" />
                  </div>
                )}

                <div className="w-full">
                  <Form.Item>
                    <Dragger>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Drag and drop or click to upload
                      </p>
                      <p className="ant-upload-hint">
                        PNG, JPG accepted. Max 5MB
                      </p>
                    </Dragger>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Button 
                type="primary" 
                htmlType="submit"
                className="h-10 px-6 rounded-md font-medium transition-colors"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Content>
  );
};

export default PersonalDetailsSettings;
