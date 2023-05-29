import { Router } from "express";
import profileControllers from "./controllers/profile";
import authorization from "./libs/authorization";
import validator from "./requests";
import validateApiGateWayHeaders from "./libs/validateApiGatewayHeaders";
import serviceValidator from "./libs/validateServiceHeaders";

const router = Router();

router.post(
  "/auth/new-job-seeker",
  serviceValidator.validateAuthServiceHeaders,
  profileControllers.createNewJobSeekerProfile
);
router.post(
  "/auth/new-company",
  serviceValidator.validateAuthServiceHeaders,
  profileControllers.createNewCompanyProfile
);
router.post(
  "/auth/company-name-existing",
  serviceValidator.validateAuthServiceHeaders,
  profileControllers.checkIsCompanyNameExists
);

router.get("/companies", profileControllers.getCompanyByIds);

router
  .get("/resumes", validateApiGateWayHeaders, authorization.verifyJobSeeker, profileControllers.getMyProfile)
  .put(
    "/resumes/basic",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    validator.jobSeekerUpdateProfile,
    profileControllers.updateBasicProfile
  )
  .put(
    "/resumes/basic/image",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    validator.updateProfileImage,
    profileControllers.jobSeekerUpdateProfileImage
  )
  .put(
    "/resumes/education",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    profileControllers.updateEducations
  )
  .put(
    "/resumes/settings",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    validator.jobSeekerUpdateSetting,
    profileControllers.updateSettings
  )
  .get("/resumes/interested-tags", validateApiGateWayHeaders, profileControllers.getJobSeekerInterestedTags)
  .get(
    "/resumes/:id",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    profileControllers.getApplicationOwnerProfile
  );

router
  .put(
    "/companies",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    validator.companyUpdateProfile,
    profileControllers.companyUpdateProfile
  )
  .put(
    "/companies/image",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    validator.updateProfileImage,
    profileControllers.companyUpdateProfileImage
  )
  .get("/companies/:id", validateApiGateWayHeaders, validator.getByIdParam, profileControllers.getCompany);

export default router;
