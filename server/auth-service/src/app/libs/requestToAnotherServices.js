import requests from "./requests";

import { PROFILE_SERVICE_URL } from "../config";

export const requestToAnotherServicesAfterJobSeekerVerified = async (createdUser) => {
  const successes = [];
  try {
    await requests.post(`${PROFILE_SERVICE_URL}/auth/new-job-seeker`, { _id: createdUser._id });
    successes.push("PROFILE");
  } catch (e) {
    return {
      successes,
      error: true,
    };
  }
  return {
    successes,
    error: false,
  };
};

export const requestToAnotherServicesAfterCompanyVerified = async (createdCompany) => {
  const successes = [];
  try {
    await requests.post(`${PROFILE_SERVICE_URL}/auth/new-company`, {
      _id: createdCompany._id,
      companyName: createdCompany.companyName,
      contact: createdCompany.contact,
    });
    successes.push("PROFILE");
  } catch (e) {
    return {
      successes,
      error: true,
    };
  }
  return {
    successes,
    error: false,
  };
};

export const requestToProfileServiceForCheckCompanyNameExisting = async (companyName) => {
  try {
    const response = await requests.post(`${PROFILE_SERVICE_URL}/auth/company-name-existing`, {
      companyName,
    });
    return {
      error: false,
      exists: response.data.exists,
    };
  } catch (e) {
    return {
      error: true,
      exists: true,
    };
  }
};
