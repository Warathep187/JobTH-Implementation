import axios from "axios";
import getJobsServiceVerificationToken from "./getServiceVerificationToken";

axios.defaults.headers.common["Authorization"] = getJobsServiceVerificationToken();

const requests = {
  post(url, data, params = {}, headers = {}) {
    return axios.post(url, data, {
      params,
      headers,
    });
  },
  put(url, data, params = {}, headers = {}) {
    return axios.put(url, data, {
      params,
      headers,
    });
  },
  delete(url) {
    return axios.delete(url);
  },
};

export default requests;
