import JWT from "jsonwebtoken";

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

export default {
  verifyToken,
};
