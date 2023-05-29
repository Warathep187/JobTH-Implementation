import { APPLICATIONS_SERVICE_URL, JOBS_SEARCHING_SERVICE_URL } from "../config";
import requests from "./requests";

export const requestToJobsSearchingServiceAndSendCreatedJob = async (data) => {
  try {
    await requests.post(`${JOBS_SEARCHING_SERVICE_URL}/jobs/create`, data);
  } catch (e) {
    throw new Error(e);
  }
};

export const requestToJobsSearchingServiceAndSendUpdatedJob = async (data) => {
  try {
    await requests.put(`${JOBS_SEARCHING_SERVICE_URL}/jobs/${data._id}`, data);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const requestToJobsSearchingServiceAndSendDeletedJobId = async (jobId) => {
  try {
    await requests.delete(`${APPLICATIONS_SERVICE_URL}/jobs/${jobId}`);
    await requests.delete(`${JOBS_SEARCHING_SERVICE_URL}/jobs/${jobId}`);
  } catch (e) {
    throw new Error(e);
  }
};
