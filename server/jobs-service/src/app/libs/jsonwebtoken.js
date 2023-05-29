import JWT from "jsonwebtoken";
import { JOBS_SERVICE_VERIFICATION_KEY } from "../config";

const verifyToken = (token, key) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, key, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const generateJobsServiceToken = () => {
  return JWT.sign("REAL_AUTH_SERVICE", JOBS_SERVICE_VERIFICATION_KEY);
};
export default {
  verifyToken,
  generateJobsServiceToken,
};
