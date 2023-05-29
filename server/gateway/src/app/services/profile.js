import { PROFILE_SERVICE_URL } from "../config";
import CustomGraphQLError from "../libs/graphqlError";
import requests from "../libs/requests";

const getMyProfile = async (userCtx) => {
  try {
    const response = await requests.get(`${PROFILE_SERVICE_URL}/resumes`, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getInterestedTag = async (parent) => {
  try {
    const response = await requests.get(`${PROFILE_SERVICE_URL}/resumes/interested-tags?userId=${parent._id}`);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getCompany = async (id) => {
  try {
    const response = await requests.get(`${PROFILE_SERVICE_URL}/companies/${id}`);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const updateBasicProfile = async (data, userCtx) => {
  try {
    const response = await requests.put(`${PROFILE_SERVICE_URL}/resumes/basic`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const jobSeekerUpdateProfileImage = async (data, userCtx) => {
  try {
    const response = await requests.put(`${PROFILE_SERVICE_URL}/resumes/basic/image`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const updateEducationHistory = async (data, userCtx) => {
  try {
    const response = await requests.put(`${PROFILE_SERVICE_URL}/resumes/education`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const updateSetting = async (data, userCtx) => {
  try {
    const response = await requests.put(`${PROFILE_SERVICE_URL}/resumes/settings`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyUpdateProfile = async (data, userCtx) => {
  try {
    const response = await requests.put(`${PROFILE_SERVICE_URL}/companies`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyUpdateProfileImage = async (data, userCtx) => {
  try {
    const response = await requests.put(`${PROFILE_SERVICE_URL}/companies/image`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getApplicationOwnerProfile = async (id, userCtx) => {
  try {
    const response = await requests.get(`${PROFILE_SERVICE_URL}/resumes/${id}`, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
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
