import executeValidator from "./requests";
import getByIdParam from "./getByIdParam";

export default {
  getByIdParam: executeValidator(getByIdParam),
};
