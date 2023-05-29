import { validationResult } from "express-validator";

export const validateRequests = (requestValidator) => async (req, res) => {
  await Promise.all(requestValidator.map((validate) => validate(req, res, () => {})));

  return validationResult(req).errors;
};

const executeValidator = (requestValidator) => async (req, res, next) => {
  const errors = await validateRequests(requestValidator)(req, res);
  if (!errors.length) {
    return next();
  }
  return res.status(400).json(errors[0]);
};

export default executeValidator;
