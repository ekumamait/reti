import React, { useRef, useState } from "react";
import { Button, Image, Spin } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  useGetWelcomeImagesQuery,
  useAddWelcomeImageMutation,
  useUpdateWelcomeImageMutation,
  useDeleteWelcomeImageMutation,
} from "../../../services/welcomeImages";
import { uploadImage, validateFile } from "../../../utils/uploadImage";
import { getApiErrorMessage } from "../../../utils/apiError";

const MAX_IMAGES = 5;

const WelcomeImagesSettings = () => {
  const { data, isLoading } = useGetWelcomeImagesQuery();
  const [addWelcomeImage] = useAddWelcomeImageMutation();
  const [updateWelcomeImage] = useUpdateWelcomeImageMutation();
  const [deleteWelcomeImage] = useDeleteWelcomeImageMutation();

  const [uploadingNew, setUploadingNew] = useState(false);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const images = data?.data || [];

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (images.length >= MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    if (!validateFile(file)) return;

    setUploadingNew(true);
    try {
      const imageUrl = await uploadImage(file);
      await addWelcomeImage({ imageUrl, order: images.length }).unwrap();
      toast.success("Welcome image added successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add welcome image"));
    } finally {
      setUploadingNew(false);
    }
  };

  const handleReplaceImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const id = replacingId;
    event.target.value = "";
    setReplacingId(null);
    if (!file || id === null) return;

    if (!validateFile(file)) return;

    try {
      const imageUrl = await uploadImage(file);
      await updateWelcomeImage({ id, data: { imageUrl } }).unwrap();
      toast.success("Welcome image updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update welcome image"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWelcomeImage(id).unwrap();
      toast.success("Welcome image deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete welcome image"));
    }
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Manage the images shown to new users on the onboarding welcome page.
      </p>

      <div className="flex gap-4 flex-wrap">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <Image
              src={image.imageUrl}
              alt="Welcome page"
              width={120}
              height={120}
              className="object-cover rounded-lg"
            />
            <Button
              type="text"
              icon={<UploadOutlined />}
              className="absolute top-0 left-0 text-blue-500 bg-white rounded-full"
              onClick={() => {
                setReplacingId(image.id);
                replaceFileInputRef.current?.click();
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="absolute top-0 right-0 text-red-500 bg-white rounded-full"
              onClick={() => handleDelete(image.id)}
            />
          </div>
        ))}
      </div>

      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleReplaceImage}
        accept="image/*"
        style={{ display: "none" }}
      />

      {images.length < MAX_IMAGES && (
        <>
          <input
            type="file"
            ref={addFileInputRef}
            onChange={handleAddImage}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Button
            icon={<UploadOutlined />}
            loading={uploadingNew}
            onClick={() => addFileInputRef.current?.click()}
          >
            Add Image ({images.length}/{MAX_IMAGES})
          </Button>
        </>
      )}
    </div>
  );
};

export default WelcomeImagesSettings;
