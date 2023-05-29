import jobModel from "../models/job";

const verifyCompanyPermission = async (req, res, next) => {
  const { userId } = req.user;
  const id = req.body.id || req.params.id;

  try {
    const job = await jobModel.findOne({ _id: id }, { companyId: true });
    if (!job) {
      return res.status(409).send({
        msg: "ไม่พบงาน",
      });
    }
    if (job.companyId != userId) {
      return res.status(403).send({
        msg: "Access denied",
      });
    }
    next();
  } catch (e) {    
    res.status(403).send({
      msg: "Something went wrong",
    });
  }
};

export default {
  verifyCompanyPermission,
};
