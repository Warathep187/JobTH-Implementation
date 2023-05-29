import esModel from "../models/elasticsearch";
import searchCondition from "../libs/searchCondition";

const createJobs = async (req, res) => {
  try {
    const jobData = {
      position: req.body.position,
      salary: req.body.salary,
      location: req.body.location,
      companyId: req.body.companyId,
      tags: req.body.tags,
      createdAt: req.body.createdAt,
    };
    await esModel.create(req.body._id, jobData);
    console.log("JOB CREATED", req.body);
    res.status(200).send({
      created: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobData = {
      position: req.body.position,
      salary: req.body.salary,
      location: req.body.location,
      companyId: req.body.companyId,
      tags: req.body.tags,
      createdAt: req.body.createdAt,
    };
    await esModel.update(req.params.id, jobData);
    console.log("JOB UPDATED", req.body);
    res.status(200).send({
      updated: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    await esModel.deleteOne(req.params.id);
    console.log("JOB DELETED", req.params);
    res.status(200).send({
      deleted: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const searchJobs = async (req, res) => {
  try {
    const conditionQuery = searchCondition.getSearchConditionQuery(req.query);

    const result = await esModel.search(conditionQuery);
    res.send(result.hits.hits);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

export default { searchJobs, updateJob, deleteJob, createJobs };
