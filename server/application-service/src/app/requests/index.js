import executeValidator from "./requests";
import getByIdParam from "./getByIdParam";
import createApplication from "./create";

export default {
  getByIdParam: executeValidator(getByIdParam),
  createApplication: executeValidator(createApplication),
};
