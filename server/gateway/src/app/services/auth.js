import requests from "../libs/requests";
import { AUTH_SERVICE_URL } from "../config";
import CustomGraphQLError from "../libs/graphqlError";

const jobSeekerRegister = async (data) => {
  try {
    const response = await requests.post(`${AUTH_SERVICE_URL}/resumes/register`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyRegister = async (data) => {
  try {
    const response = await requests.post(`${AUTH_SERVICE_URL}/companies/register`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const jobSeekerLogin = async (data) => {
  try {
    const response = await requests.post(`${AUTH_SERVICE_URL}/resumes/login`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyLogin = async (data) => {
  try {
    const response = await requests.post(`${AUTH_SERVICE_URL}/companies/login`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const jobSeekerVerifyAccount = async (data) => {
  try {
    const response = await requests.put(`${AUTH_SERVICE_URL}/resumes/verify`, {
      token: data.token,
    });
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyVerifyAccount = async (data) => {
  try {
    const response = await requests.put(`${AUTH_SERVICE_URL}/companies/verify`, {
      token: data.token,
    });
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const jobSeekerSendEmailForResetPassword = async (data) => {
  try {
    const response = await requests.post(`${AUTH_SERVICE_URL}/resumes/reset-password/send-email`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companySendEmailForResetPassword = async (data) => {
  try {
    const response = await requests.post(`${AUTH_SERVICE_URL}/companies/reset-password/send-email`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const jobSeekerResetPassword = async (data) => {
  try {
    const response = await requests.put(`${AUTH_SERVICE_URL}/resumes/reset-password/reset`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyResetPassword = async (data) => {
  try {
    const response = await requests.put(`${AUTH_SERVICE_URL}/companies/reset-password/reset`, data);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const jobSeekerChangePassword = async (data, userCtx) => {
  try {
    const response = await requests.put(`${AUTH_SERVICE_URL}/resumes/change-password`, data, {}, userCtx);

    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const companyChangePassword = async (data, userCtx) => {
  try {
    const response = await requests.put(`${AUTH_SERVICE_URL}/companies/change-password`, data, {}, userCtx);

    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getAuthenticationInfo = async (userCtx) => {
  try {
    const response = await requests.get(`${AUTH_SERVICE_URL}/authenticate`, {}, userCtx);

    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
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
