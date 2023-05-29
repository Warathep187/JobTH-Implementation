import { GATEWAY_VERIFICATION_KEY } from "../config";
import JWT from "./jsonwebtoken";

const verificationToken = JWT.generateToken("REAL_GATEWAY", GATEWAY_VERIFICATION_KEY);

const getGatewayVerificationToken = () => {
  return `Bearer ${verificationToken}`
}

export default getGatewayVerificationToken;