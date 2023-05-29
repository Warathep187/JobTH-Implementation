import { JOBS_SERVICE_VERIFICATION_KEY } from "../config";
import JWT from "./jsonwebtoken";

const validateJobsServiceHeaders = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(403).send({
        msg: "Access denied",
      });
    }
    const token = bearerToken.replace("Bearer ", "");
    await JWT.verifyToken(token, JOBS_SERVICE_VERIFICATION_KEY);
    next();
  } catch (e) {
    res.status(403).send({
      msg: "Access denied",
    });
  }
};

export default {
  validateJobsServiceHeaders,
};
