import cloudinary from "../libs/cloudinary";
import {
  requestToJobServiceForGetJobDetails,
  requestToProfileServiceForGetCompanyProfile,
} from "../libs/requestToAnotherServices";
import applicationModel from "../models/application";

// Delete applications after delete job
const deleteApplications = async (req, res) => {
  const { id: jobId } = req.params;
  try {
    const applications = await applicationModel.findMany({ "job._id": jobId }, { resume: true });
    for (const application of applications) {
      await cloudinary.deleteFile(application.resume.key);
    }
    await applicationModel.deleteMany({ "job._id": jobId });
    console.log("DELETED");
    res.status(200).send({
      deleted: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const createNewApplication = async (req, res) => {
  const { resume, contact, jobId } = req.body;
  const { userId } = req.user;
  try {
    const job = await requestToJobServiceForGetJobDetails(jobId);
    const companyProfile = await requestToProfileServiceForGetCompanyProfile(job.companyId);

    const uploadedImage = await cloudinary.uploadFile(resume);
    await applicationModel.create({
      jobSeekerId: userId,
      job: {
        _id: job._id,
        position: job.position,
        salary: job.salary,
        location: job.location,
        company: {
          _id: companyProfile._id,
          companyName: companyProfile.companyName,
          image: {
            url: companyProfile.image.url,
          },
        },
        createdAt: job.createdAt,
      },
      contact,
      resume: uploadedImage,
      createdAt: new Date(),
    });
    res.status(201).send({
      msg: "สมัครเรียบร้อย",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      msg: "มีบางอย่างผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  try {
    await applicationModel.updateOne({ _id: id }, { status: "RECEIVED" });
    res.send({
      msg: "เปลี่ยนสถานะเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getMyApplications = async (req, res) => {
  const { userId } = req.user;
  try {
    const applications = await applicationModel.findMany({ jobSeekerId: userId }, { contact: false, resume: false });
    res.send(applications);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getCompanyApplications = async (req, res) => {
  const { userId } = req.user;
  try {
    const applications = await applicationModel.findMany({ "job.company._id": userId }, { contact: false, resume: false });
    console.log(applications)
    res.send(applications);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getFullApplicationInformation = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await applicationModel.findOne({ _id: id });
    if (!application) {
      return res.status(404).send({
        msg: "ไม่พบการสมัครงาน",
      });
    }
    res.send(application);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

export default {
  deleteApplications,
  createNewApplication,
  updateApplicationStatus,
  getMyApplications,
  getCompanyApplications,
  getFullApplicationInformation,
};
