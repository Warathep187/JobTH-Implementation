import { Router } from "express";
import authController from "./controllers/auth";
import validator from "./requests";
import authorization from "./libs/authorization";

const router = Router();

router.get("/authenticate", authorization.verifyAllRole, authController.getAuthenticatedInfo)

router
  .post("/resumes/register", validator.jobSeekerRegister, authController.jobSeekerRegister)
  .post("/resumes/login", validator.login, authController.jobSeekerLogin)
  .put("/resumes/verify", validator.verify, authController.verifyJobSeekerAccount)
  .post("/resumes/reset-password/send-email", validator.sendEmail, authController.jobSeekerSendEmail)
  .put("/resumes/reset-password/reset", validator.resetPassword, authController.jobSeekerResetPassword)
  .put(
    "/resumes/change-password",
    authorization.verifyJobSeeker,
    validator.changePassword,
    authController.jobSeekerChangePassword
  );

router
  .post("/companies/register", validator.companyRegister, authController.companyRegister)
  .post("/companies/login", validator.login, authController.companyLogin)
  .put("/companies/verify", validator.verify, authController.verifyCompanyAccount)
  .post("/companies/reset-password/send-email", validator.sendEmail, authController.companySendEmail)
  .put(
    "/companies/reset-password/reset",
    validator.resetPassword,
    authController.companyResetPassword
  )
  .put(
    "/companies/change-password",
    authorization.verifyCompany,
    validator.changePassword,
    authController.companyChangePassword
  );

export default router;
