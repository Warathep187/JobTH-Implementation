import { Router } from "express";
import authorization from "./libs/authorization";
import validator from "./requests";
import validateApiGateWayHeaders from "./libs/validateApiGatewayHeaders";
import serviceValidator from "./libs/validateServiceHeaders";
import verifyPermission from "./libs/verifyPermission";
import applicationControllers from "./controllers/application";

const router = Router();

router.delete("/jobs/:id", serviceValidator.validateJobsServiceHeaders, applicationControllers.deleteApplications);

router
  .post(
    "/create",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    validator.createApplication,
    applicationControllers.createNewApplication
  )
  .put(
    "/:id",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    validator.getByIdParam,
    verifyPermission.verifyCompanyPermission,
    applicationControllers.updateApplicationStatus
  )
  .get("/", validateApiGateWayHeaders, authorization.verifyJobSeeker, applicationControllers.getMyApplications)
  .get("/inbox", validateApiGateWayHeaders, authorization.verifyCompany, applicationControllers.getCompanyApplications)
  .get(
    "/inbox/:id",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    verifyPermission.verifyCompanyPermission,
    applicationControllers.getFullApplicationInformation
  );

export default router;
