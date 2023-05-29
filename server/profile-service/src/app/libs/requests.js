import axios from "axios";
import getProfileServiceVerificationToken from "./getServiceVerificationToken";

axios.defaults.headers.common["Authorization"] = getProfileServiceVerificationToken();

const requests = {
  post(url, data, params = {}, headers = {}) {
    return axios.post(url, data, {
      params,
      headers,
    });
  },
};

export default requests;
