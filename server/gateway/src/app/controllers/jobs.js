import authorization from "../libs/authorization";
import CustomGraphQLError from "../libs/graphqlError";
import rateLimit from "../libs/rateLimiter";
import jobsServices from "../services/jobs";

const getCompanyJobs = async (args) => {
  return jobsServices.getCompanyJobs(args.id);
};

const getJob = async (args) => jobsServices.getJob(args.id);

const getJobFavorites = async (parent) => jobsServices.getJobFavorites(parent._id);

const getFavoriteJobs = async (ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return jobsServices.getFavoriteJobs(userCtx);
};

const createNewJob = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  await rateLimit(ctx, 40, 10);
  return jobsServices.createNewJob(args.input, userCtx);
};

const updateJob = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return jobsServices.updateJob(args.input, userCtx);
};

const deleteJob = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyCompany(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return jobsServices.deleteJob(args.id, userCtx);
};

const likeJob = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return jobsServices.likeJob(args.id, userCtx);
};

const unlikeJob = async (args, ctx) => {
  const { userCtx, error } = await authorization.verifyJobSeeker(ctx);
  if (error) {
    throw new CustomGraphQLError(error);
  }
  return jobsServices.unlikeJob(args.id, userCtx);
};

const getTags = () => jobsServices.getTags();

const getJobsAmount = () => jobsServices.getJobsAmount();

const getPopularTags = async (ctx) => {
  await rateLimit(ctx, 50, 10);
  return jobsServices.getPopularTags();
};

const getTopCompanies = async (ctx) => {
  await rateLimit(ctx, 50, 10);
  return jobsServices.getTopCompanies();
};

export default {
  getCompanyJobs,
  getJob,
  getJobFavorites,
  getFavoriteJobs,
  createNewJob,
  updateJob,
  deleteJob,
  likeJob,
  unlikeJob,
  getTags,
  getJobsAmount,
  getPopularTags,
  getTopCompanies,
};
