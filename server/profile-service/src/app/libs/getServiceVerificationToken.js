import JWT from "./jsonwebtoken";

const verificationToken = JWT.generateProfileServiceToken()

const getProfileServiceVerificationToken = () => {
  return `Bearer ${verificationToken}`
}

export default getProfileServiceVerificationToken;