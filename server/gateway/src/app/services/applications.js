import { APPLICATIONS_SERVICE_URL } from "../config";
import CustomGraphQLError from "../libs/graphqlError";
import requests from "../libs/requests";

const getMyApplications = async (userCtx) => {
  try {
    const response = await requests.get(`${APPLICATIONS_SERVICE_URL}/`, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getCompanyApplications = async (userCtx) => {
  try {
    const response = await requests.get(`${APPLICATIONS_SERVICE_URL}/inbox`, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const getFullApplicationInformation = async (id, userCtx) => {
  try {
    const response = await requests.get(`${APPLICATIONS_SERVICE_URL}/inbox/${id}`, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const createNewApplication = async (data, userCtx) => {
  try {
    const response = await requests.post(`${APPLICATIONS_SERVICE_URL}/create`, data, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

const updateApplicationStatus = async (id, userCtx) => {
  try {
    const response = await requests.put(`${APPLICATIONS_SERVICE_URL}/${id}`, {}, {}, userCtx);
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

export default {
  getMyApplications,
  getCompanyApplications,
  getFullApplicationInformation,
  createNewApplication,
  updateApplicationStatus,
};
