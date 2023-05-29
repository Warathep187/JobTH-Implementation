import applicationModel from "../models/application";

const verifyCompanyPermission = async (req, res, next) => {
  const { userId } = req.user;
  const id = req.body.id || req.params.id;

  try {
    const application = await applicationModel.findOne({ _id: id }, { job: true });

    if (!application) {
      return res.status(409).send({
        msg: "ไม่พบการสมัครที่เลือก",
      });
    }
    
    if (application.job.company._id.toString() != userId) {
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
