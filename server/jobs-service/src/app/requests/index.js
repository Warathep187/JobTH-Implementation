import executeValidator from "./requests";
import getByIdParam from "./getByIdParam";
import createJob from "./create";
import updateJob from "./update";
import deleteJob from "./delete";

export default {
  getByIdParam: executeValidator(getByIdParam),
  createJob: executeValidator(createJob),
  updateJob: executeValidator(updateJob),
  deleteJob: executeValidator(deleteJob),
};
