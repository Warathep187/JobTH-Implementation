import JWT from "./jsonwebtoken";

const verificationToken = JWT.generateAuthServiceToken()

const getAuthServiceVerificationToken = () => {
  return `Bearer ${verificationToken}`
}

export default getAuthServiceVerificationToken;