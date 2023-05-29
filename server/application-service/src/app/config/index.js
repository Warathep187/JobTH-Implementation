import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  MONGODB_URL,
  MESSAGE_BROKER_URL,
  PROFILE_SERVICE_URL,
  JOBS_SERVICE_URL,
  CLIENT_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  GATEWAY_VERIFICATION_KEY,
  AUTH_SERVICE_VERIFICATION_KEY,
  JOBS_SERVICE_VERIFICATION_KEY
} = process.env;
