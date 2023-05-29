import jobModel from "../models/job";
import favoriteJobModel from "../models/favoriteJob";
import {
  requestToJobsSearchingServiceAndSendCreatedJob,
  requestToJobsSearchingServiceAndSendDeletedJobId,
  requestToJobsSearchingServiceAndSendUpdatedJob,
} from "../libs/requestToAnotherServices";

const createJob = async (req, res) => {
  const { userId } = req.user;
  try {
    const data = { ...req.body, companyId: userId, createdAt: new Date() };
    const createdJob = await jobModel.create(data);

    try {
      await requestToJobsSearchingServiceAndSendCreatedJob(createdJob);
      res.status(201).send({
        msg: "งานถูกเพิ่มแล้ว",
      });
    } catch (e) {
      await jobModel.deleteOne({ _id: createdJob._id });
      return res.status(500).send({
        msg: "มีบางอย่างผิดพลาด โปรดลองใหม่ภายหลัง",
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    try {
      await requestToJobsSearchingServiceAndSendUpdatedJob({
        _id: id,
        ...req.body,
        companyId: userId,
      });
    } catch (e) {
      return res.status(500).send({
        msg: "มีบางอย่างผิดพลาด โปรดลองใหม่ภายหลัง",
      });
    }

    await jobModel.updateOne({ _id: id }, req.body);

    res.send({
      msg: "แก้ไขแล้ว",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    try {
      await requestToJobsSearchingServiceAndSendDeletedJobId(id);
    } catch (e) {
      return res.status(500).send({
        msg: "มีบางอย่างผิดพลาด โปรดลองใหม่ภายหลัง",
      });
    }

    await jobModel.deleteOne({ _id: id });

    res.send({
      msg: "งานถูกลบแล้ว",
    });
    await favoriteJobModel.deleteMany({ job: id });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getCompanyJobs = async (req, res) => {
  const companyId = req.params.id;
  try {
    const jobs = await jobModel.findMany({ companyId }, {}, {}, { createdAt: -1 });
    res.send(jobs);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel.findOneAndPopulateTags({ _id: id });
    if(!job) {
      return res.status(404).send({
        msg: "ไม่พบงาน"
      })
    }
    res.send(job);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getJobFavorites = async (req, res) => {
  const { id } = req.params;
  try {
    const favorites = await favoriteJobModel.findMany({ jobId: id }, { _id: false, jobSeekerId: true });
    res.send(favorites);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getFavoriteJobs = async (req, res) => {
  const { userId } = req.user;
  try {
    const favoritesJobs = await favoriteJobModel.findManyAndPopulate({ jobSeekerId: userId }, {}, {}, { _id: -1 });
    res.send(favoritesJobs);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const likeJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const like = await favoriteJobModel.findOne({ jobId: id, jobSeekerId: userId }, { _id: true });
    if (like) {
      return res.status(409).send({
        msg: "คุณกดไลค์งานนี้ไปแล้ว",
      });
    }
    await favoriteJobModel.create({ jobId: id, jobSeekerId: userId });
    res.send({
      msg: "Liked",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const unlikeJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const like = await favoriteJobModel.findOne({ jobId: id, jobSeekerId: userId }, { _id: true });
    if (!like) {
      return res.status(409).send({
        msg: "คุณไม่เคยกดไลค์งานนี้",
      });
    }
    await favoriteJobModel.deleteOne({ _id: like._id });
    res.send({
      msg: "UnLiked",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getAllJobsAmount = async (req, res) => {
  try {
    const count = await jobModel.count();
    res.status(200).send({
      amount: count,
    });
  } catch (e) {
    res.status(500).send({
      amount: 0,
    });
  }
};

export default {
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs,
  getJob,
  getJobFavorites,
  getFavoriteJobs,
  likeJob,
  unlikeJob,
  getAllJobsAmount,
};
