import JWT from "jsonwebtoken";

const generateToken = (data, key) => {
  return JWT.sign(data, key);
};

const verifyToken = (token, key) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, key, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

export default {
  generateToken,
  verifyToken
};
