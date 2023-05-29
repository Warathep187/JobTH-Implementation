import JWT from "./jsonwebtoken";

const verificationToken = JWT.generateJobsServiceToken();

const getJobsServiceVerificationToken = () => {
  return `Bearer ${verificationToken}`;
};

export default getJobsServiceVerificationToken;
