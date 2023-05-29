import { body, check } from "express-validator";

const jobSeekerValidateFieldsList = [
  body("email").isEmail().withMessage("อีเมลไม่ถูกต้อง"),
  body("password").isStrongPassword().withMessage("รหัสผ่านไม่ปลอดภัย"),
];

const companyRegisterValidateFieldsList = [
  body("email").isEmail().withMessage("อีเมลไม่ถูกต้อง"),
  body("password").isStrongPassword().withMessage("รหัสผ่านไม่ปลอดภัย"),
  body("companyName").notEmpty().withMessage("โปรดกรอกชื่อบริษัทให้ถูกต้อง"),
  check("contact.email").isEmail().withMessage("อีเมลติดต่อไม่ถูกต้อง"),
  check("contact.tel")
    .matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("เบอร์โทรติดต่อไปถูกต้อง"),
];

export default {
  jobSeekerValidateFieldsList,
  companyRegisterValidateFieldsList
};
