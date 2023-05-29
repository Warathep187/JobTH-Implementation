import { Router } from "express";
import validateApiGateWayHeaders from "./libs/validateApiGatewayHeaders";
import jobsController from "./controllers/jobs";
import serviceValidator from "./libs/validateServiceHeaders";

const router = Router();

router.post("/jobs/create", serviceValidator.validateJobsServiceHeaders, jobsController.createJobs);
router.put("/jobs/:id", serviceValidator.validateJobsServiceHeaders, jobsController.updateJob);
router.delete("/jobs/:id", serviceValidator.validateJobsServiceHeaders, jobsController.deleteJob);

router.get("/", validateApiGateWayHeaders, jobsController.searchJobs);

export default router;
