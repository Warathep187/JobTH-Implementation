import jobModel from "../models/job";

const getTopCompanies = async (req, res) => {
  try {
    const jobsCount = await jobModel.aggregatedByCountCompanyId();
    res.send(jobsCount);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

export default { getTopCompanies };
