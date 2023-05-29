import axios from "axios";
import getAuthServiceVerificationToken from "./getServiceVerificationToken";

axios.defaults.headers.common["Authorization"] = getAuthServiceVerificationToken();

const requests = {
  post(url, data, params = {}, headers = {}) {
    return axios.post(url, data, {
      params,
      headers,
    });
  },
};

export default requests;
