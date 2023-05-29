import { Router } from "express";
import authorization from "./libs/authorization";
import validator from "./requests";
import companyControllers from "./controllers/company";
import jobsControllers from "./controllers/jobs.js";
import tagsController from "./controllers/tags";
import validateApiGateWayHeaders from "./libs/validateApiGatewayHeaders";
import verifyPermission from "./libs/verifyPermission";

const router = Router();

router
  .post(
    "/create",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    validator.createJob,
    jobsControllers.createJob
  )
  .put(
    "/:id",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    verifyPermission.verifyCompanyPermission,
    validator.updateJob,
    jobsControllers.updateJob
  )
  .delete(
    "/:id",
    validateApiGateWayHeaders,
    authorization.verifyCompany,
    verifyPermission.verifyCompanyPermission,
    validator.deleteJob,
    jobsControllers.deleteJob
  )
  .get("/companies/:id/jobs", validator.getByIdParam, validateApiGateWayHeaders, jobsControllers.getCompanyJobs)
  .get("/companies/top", validateApiGateWayHeaders, companyControllers.getTopCompanies)
  .get("/:id/favorites", validateApiGateWayHeaders, validator.getByIdParam, jobsControllers.getJobFavorites)
  .put(
    "/:id/like",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    validator.getByIdParam,
    jobsControllers.likeJob
  )
  .put(
    "/:id/unlike",
    validateApiGateWayHeaders,
    authorization.verifyJobSeeker,
    validator.getByIdParam,
    jobsControllers.unlikeJob
  )
  .get("/tags", validateApiGateWayHeaders, tagsController.getAllTags)
  .get("/tags/popular", validateApiGateWayHeaders, tagsController.getPopularTags)
  .get("/favorites", validateApiGateWayHeaders, authorization.verifyJobSeeker, jobsControllers.getFavoriteJobs)
  .get("/amount", validateApiGateWayHeaders, jobsControllers.getAllJobsAmount)
  .get("/:id", validator.getByIdParam, jobsControllers.getJob);

export default router;
