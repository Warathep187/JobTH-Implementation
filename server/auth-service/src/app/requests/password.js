import { body } from "express-validator";

const sendEmailValidateFieldsList = [
  body("email").isEmail().withMessage("อีเมลไม่ถูกต้อง")
]

const resetPasswordValidateFieldsList = [
  body("token").isJWT().withMessage("IDของการรีเซ็ตรหัสผ่านไม่ถูกต้อง"),
  body("password").isStrongPassword().withMessage("รหัสผ่านไม่ปลอดถัย")
]

const changePasswordValidateFieldsList = [
  body("oldPassword").isStrongPassword().withMessage("รหัสผ่านไม่ถูกต้อง"),
  body("newPassword").isStrongPassword().withMessage("รหัสผ่านใหม่ไม่ปลอดภัย")
]

export default {
  sendEmailValidateFieldsList,
  resetPasswordValidateFieldsList,
  changePasswordValidateFieldsList
};