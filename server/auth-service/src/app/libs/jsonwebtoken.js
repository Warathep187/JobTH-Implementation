import jwt from "jsonwebtoken";
import { AUTH_SERVICE_VERIFICATION_KEY, GATEWAY_VERIFICATION_KEY } from "../config";


const generateToken = (data, key, expiresIn) => {
  return jwt.sign(data, key, {
    expiresIn,
  });
};

const generateAuthServiceToken = () => {
  return jwt.sign("REAL_AUTH_SERVICE", AUTH_SERVICE_VERIFICATION_KEY);
};

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

const verifyTokenFromGateway = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, GATEWAY_VERIFICATION_KEY, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export default {
  generateToken,
  generateAuthServiceToken,
  verifyToken,
  verifyTokenFromGateway,
};
