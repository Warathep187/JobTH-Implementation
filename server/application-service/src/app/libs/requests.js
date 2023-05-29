import axios from "axios";

const requests = {
  get: (url) => axios.get(url),
};

export default requests;
