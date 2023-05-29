import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  MESSAGE_BROKER_URL,
  ELASTICSEARCH_URL,
  CLIENT_URL,
  GATEWAY_VERIFICATION_KEY,
  JOBS_SERVICE_VERIFICATION_KEY
} = process.env;
