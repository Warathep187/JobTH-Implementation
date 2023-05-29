import authorization from "../libs/authorization";
import CustomGraphQLError from "../libs/graphqlError";
import rateLimit from "../libs/rateLimiter";
import applicationsServices from "../services/applications";

const getMyApplications = async (ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return applicationsServices.getMyApplications(userCtx);
};

const getCompanyApplications = async (ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return applicationsServices.getCompanyApplications(userCtx);
};

const getFullApplicationInformation = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return applicationsServices.getFullApplicationInformation(args.id, userCtx);
};

const createNewApplication = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  await rateLimit(ctx, 30, 60);
  return applicationsServices.createNewApplication(args.input, userCtx);
};

const updateApplicationStatus = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return applicationsServices.updateApplicationStatus(args.id, userCtx);
};

export default {
  getMyApplications,
  getCompanyApplications,
  getFullApplicationInformation,
  createNewApplication,
  updateApplicationStatus,
};
