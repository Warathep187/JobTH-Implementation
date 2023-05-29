import { body } from "express-validator";

const validateFieldsList = [
  body("email").isEmail().withMessage("อีเมลไม่ถูกต้อง"),
  body("password").isLength({ min: 8 }).withMessage("รหัสผ่านไม่ถูกต้อง"),
];

export default validateFieldsList;
