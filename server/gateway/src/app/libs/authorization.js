import ROLES from "../../constants/roles";
import { JWT_AUTHENTICATION_KEY } from "../config";
import JWT from "./jsonwebtoken";

const generateAccessDeniedError = () => {
  return {
    error: {
      response: {
        data: {
          msg: "Access denied",
        },
      },
    },
  };
};

const verifyJobSeeker = async ({ token }) => {
  try {
    const decoded = await JWT.verifyToken(token, JWT_AUTHENTICATION_KEY);
    if (decoded.role !== ROLES.JOB_SEEKER) {
      return generateAccessDeniedError();
    }
    return { userCtx: { userid: decoded.id, role: decoded.role } };
  } catch (e) {
    return generateAccessDeniedError();
  }
};

const verifyCompany = async ({ token }) => {
  try {
    const decoded = await JWT.verifyToken(token, JWT_AUTHENTICATION_KEY);
    if (decoded.role !== ROLES.COMPANY) {
      return generateAccessDeniedError();
    }
    return { userCtx: { userid: decoded.id, role: decoded.role } };
  } catch (e) {
    return generateAccessDeniedError();
  }
};

const verifyAllRole = async ({token}) => {
  try {
    const decoded = await JWT.verifyToken(token, JWT_AUTHENTICATION_KEY);
    return { userCtx: { userid: decoded.id, role: decoded.role } };
  } catch (e) {
    return generateAccessDeniedError();
  }
}

export default { verifyJobSeeker, verifyCompany, verifyAllRole };
