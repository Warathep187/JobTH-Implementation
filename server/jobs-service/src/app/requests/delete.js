import { param } from "express-validator";

const validateFieldsList = [
  param("id")
    .matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
    .withMessage("ไม่พบงาน"),
];

export default validateFieldsList;
