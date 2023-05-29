import JWT from "jsonwebtoken";
import { PROFILE_SERVICE_VERIFICATION_KEY } from "../config";

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

const generateProfileServiceToken = (data) => {
  return JWT.sign("REAL_PROFILE_SERVICE", PROFILE_SERVICE_VERIFICATION_KEY);
};

export default {
  verifyToken,
  generateProfileServiceToken
};
