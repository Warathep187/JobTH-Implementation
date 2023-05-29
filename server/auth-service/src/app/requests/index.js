import executeValidator from "./requests";
import login from "./login";
import register from "./register";
import verify from "./verify";
import password from "./password"

export default {
  login: executeValidator(login),
  jobSeekerRegister: executeValidator(register.jobSeekerValidateFieldsList),
  companyRegister: executeValidator(register.companyRegisterValidateFieldsList),
  verify: executeValidator(verify),
  sendEmail: executeValidator(password.sendEmailValidateFieldsList),
  resetPassword: executeValidator(password.resetPasswordValidateFieldsList),
  changePassword: executeValidator(password.changePasswordValidateFieldsList)
};
