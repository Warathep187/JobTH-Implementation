import authorization from "../libs/authorization";
import CustomGraphQLError from "../libs/graphqlError";
import rateLimit from "../libs/rateLimiter";
import profileServices from "../services/profile";

const getMyProfile = async (ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return profileServices.getMyProfile(userCtx);
};

const getInterestedTag = async (parent) => {
  return profileServices.getInterestedTag(parent);
};

const getCompany = async (args) => {
  return profileServices.getCompany(args.id);
};

const updateBasicProfile = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return profileServices.updateBasicProfile(args.input, userCtx);
};

const jobSeekerUpdateProfileImage = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  await rateLimit(ctx, 15, 10);
  return profileServices.jobSeekerUpdateProfileImage(args.input, userCtx);
};

const updateEducationHistory = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return profileServices.updateEducationHistory(args.input, userCtx);
};

const updateSetting = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return profileServices.updateSetting(args.input, userCtx);
};

const companyUpdateProfile = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return profileServices.companyUpdateProfile(args.input, userCtx);
};

const companyUpdateProfileImage = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  await rateLimit(ctx, 15, 10);
  return profileServices.companyUpdateProfileImage(args.input, userCtx);
};

const getApplicationOwnerProfile = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return profileServices.getApplicationOwnerProfile(args.id, userCtx);
};

export default {
  getMyProfile,
  getInterestedTag,
  getCompany,
  updateBasicProfile,
  jobSeekerUpdateProfileImage,
  updateEducationHistory,
  updateSetting,
  companyUpdateProfile,
  companyUpdateProfileImage,
  getApplicationOwnerProfile,
};
