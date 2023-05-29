import { JOBS_SERVICE_URL, PROFILE_SERVICE_URL } from "../config";
import requests from "./requests";

export const requestToJobServiceForGetJobDetails = async (id) => {
  try {
    const { data } = await requests.get(`${JOBS_SERVICE_URL}/${id}`);
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

export const requestToProfileServiceForGetCompanyProfile = async (id) => {
  try {
    const { data } = await requests.get(`${PROFILE_SERVICE_URL}/companies?id=${id}`);
    return data.company;
  } catch (e) {
    throw new Error(e);
  }
};
