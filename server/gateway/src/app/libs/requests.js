import axios from "axios";
import getGatewayRequestHeaders from "./getGatewayVerificationToken";

axios.defaults.headers.common["Authorization"] = getGatewayRequestHeaders()

const requests = {
  get: (url, params = {}, headers = {}) => {
    return axios.get(url, {
      params,
      headers,
    });
  },

  post: (url, body, params = {}, headers = {}) => {
    return axios.post(url, body, {
      params,
      headers,
    });
  },

  put: (url, body, params = {}, headers = {}) => {
    return axios.put(url, body, {
      params,
      headers,
    });
  },

  delete: (url, params = {}, headers = {}) => {
    return axios.delete(url, {
      params,
      headers,
    });
  },
};

export default requests