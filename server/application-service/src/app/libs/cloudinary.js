import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../config";

// Configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadFile = async (base64Image) => {
  const key = uuid();
  const response = await cloudinary.uploader.upload(base64Image, { public_id: key, folder: "resume-images" });
  return {
    key: response.public_id,
    url: response.url,
  };
};

const deleteFile = async (key) => {
  try {
    await cloudinary.uploader.destroy(key, {
      resource_type: "image",
    });
  } catch (e) {
    throw new Error(e);
  }
}

export default {
  uploadFile,
  deleteFile
};
