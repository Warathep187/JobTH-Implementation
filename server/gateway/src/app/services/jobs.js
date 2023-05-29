import { JOBS_SERVICE_URL, PROFILE_SERVICE_URL } from "../config";
import CustomGraphQLError from "../libs/graphqlError";
import requests from "../libs/requests";

const getCompanyJobs = async (id) => {
  try {
    const response = await requests.get(`${JOBS_SERVICE_URL}/companies/${id}/jobs`);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getJob = async (id) => {
  try {
    const { data: jobData } = await requests.get(`${JOBS_SERVICE_URL}/${id}`);
    const { data: companyData } = await requests.get(`${PROFILE_SERVICE_URL}/companies?id=${jobData.companyId}`);
    return {
      ...jobData,
      ...companyData,
    };
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getJobFavorites = async (id) => {
  try {
    const { data: favJobs } = await requests.get(`${JOBS_SERVICE_URL}/${id}/favorites`);

    return favJobs;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getFavoriteJobs = async (userCtx) => {
  try {
    const { data: favJobs } = await requests.get(`${JOBS_SERVICE_URL}/favorites`, {}, userCtx);
    const companyIds = favJobs.map((fav) => fav.jobId.companyId);
    if (favJobs.length > 0) {
      const { data: companyData } = await requests.get(`${PROFILE_SERVICE_URL}/companies?ids=${companyIds.join(",")}`);
      const formattedJobs = favJobs.map((fav) => {
        const jobFormatted = {
          ...fav.jobId,
          company: companyData.companies.find((company) => company._id === fav.jobId.companyId),
        };
        return {
          ...fav,
          jobId: jobFormatted,
        };
      });
      return formattedJobs;
    } else {
      return [];
    }
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const createNewJob = async (data, userCtx) => {
  try {
    const response = await requests.post(`${JOBS_SERVICE_URL}/create`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const updateJob = async (data, userCtx) => {
  try {
    const response = await requests.put(`${JOBS_SERVICE_URL}/${data._id}`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const deleteJob = async (id, userCtx) => {
  try {
    const response = await requests.delete(`${JOBS_SERVICE_URL}/${id}`, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const likeJob = async (id, userCtx) => {
  try {
    const response = await requests.put(`${JOBS_SERVICE_URL}/${id}/like`, {}, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const unlikeJob = async (id, userCtx) => {
  try {
    const response = await requests.put(`${JOBS_SERVICE_URL}/${id}/unlike`, {}, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getTags = async () => {
  try {
    const response = await requests.get(`${JOBS_SERVICE_URL}/tags`);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getJobsAmount = async () => {
  try {
    const response = await requests.get(`${JOBS_SERVICE_URL}/amount`);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getPopularTags = async () => {
  try {
    const response = await requests.get(`${JOBS_SERVICE_URL}/tags/popular`);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getTopCompanies = async () => {
  try {
    const { data: topCompanies } = await requests.get(`${JOBS_SERVICE_URL}/companies/top`);
    if (topCompanies.length > 0) {
      const companyIds = topCompanies.map((company) => company._id);
      const { data: companyData } = await requests.get(`${PROFILE_SERVICE_URL}/companies?ids=${companyIds.join(",")}`);
      const topCompaniesFormatted = topCompanies.map((company) => ({
        _id: company._id,
        count: company.count,
        companyName: companyData.companies.find((c) => c._id === company._id).companyName,
        image: companyData.companies.find((c) => c._id === company._id).image,
      }));
      return topCompaniesFormatted;
    } else {
      return [];
    }
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
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
