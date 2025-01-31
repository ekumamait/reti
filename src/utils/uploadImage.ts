import axios from "axios";
import { toast } from "react-toastify";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const validateFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isSizeValid = file.size / 1024 / 1024 < 5;

    if (!isImage) {
        toast.error('Please upload only image files.');
        return false;
    }

    if (!isSizeValid) {
        toast.error('Image size should be less than 5MB.');
        return false;
    }

    return true;
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reti_frontend");

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};
