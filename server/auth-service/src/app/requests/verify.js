import { body } from "express-validator";

const validateFieldsList = [body("token").isJWT().withMessage("IDการยืนยันตัวตนไม่ถูกต้อง")];

export default validateFieldsList;
