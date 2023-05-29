import authServices from "../services/auth";
import authorization from "../libs/authorization";
import CustomGraphQLError from "../libs/graphqlError";
import rateLimit from "../libs/rateLimiter";

const jobSeekerRegister = async (args, ctx) => {
  await rateLimit(ctx, 30, 15);
  return authServices.jobSeekerRegister(args.input);
};

const companyRegister = async (args, ctx) => {
  await rateLimit(ctx, 30, 15);
  return authServices.companyRegister(args.input);
};

const jobSeekerLogin = async (args) => {
  return authServices.jobSeekerLogin(args.input);
};

const companyLogin = async (args) => {
  return authServices.companyLogin(args.input);
};

const jobSeekerVerifyAccount = async (args) => {
  return authServices.jobSeekerVerifyAccount(args.input);
};

const companyVerifyAccount = async (args) => {
  return authServices.companyVerifyAccount(args.input);
};

const jobSeekerSendEmailForResetPassword = async (args, ctx) => {
  await rateLimit(ctx, 30, 15)
  return authServices.jobSeekerSendEmailForResetPassword(args.input);
};

const companySendEmailForResetPassword = async (args, ctx) => {
  await rateLimit(ctx, 30, 15)
  return authServices.companySendEmailForResetPassword(args.input);
};

const jobSeekerResetPassword = (args) => {
  return authServices.jobSeekerResetPassword(args.input);
};

const companyResetPassword = (args) => {
  return authServices.companyResetPassword(args.input);
};

const jobSeekerChangePassword = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return authServices.jobSeekerChangePassword(args.input, userCtx);
};

const companyChangePassword = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return authServices.companyChangePassword(args.input, userCtx);
};

const getAuthenticationInfo = async (ctx) => {
  const { userCtx, error } = await authorization.verifyAllRole(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return authServices.getAuthenticationInfo(userCtx);
};

export default {
  jobSeekerRegister,
  companyRegister,
  jobSeekerLogin,
  companyLogin,
  jobSeekerVerifyAccount,
  companyVerifyAccount,
  jobSeekerSendEmailForResetPassword,
  companySendEmailForResetPassword,
  jobSeekerResetPassword,
  companyResetPassword,
  jobSeekerChangePassword,
  companyChangePassword,
  getAuthenticationInfo,
};
