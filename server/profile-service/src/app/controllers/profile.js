import jobSeekerModel from "../models/jobSeeker";
import companyModel from "../models/company";
import defaultEducations from "../../constants/defaultEducations";
import cloudinary from "../libs/cloudinary";
import { Types } from "mongoose";

// New Job seeker
const createNewJobSeekerProfile = async (req, res) => {
  const { _id } = req.body;
  try {
    await jobSeekerModel.create({ _id, educations: defaultEducations });
    console.log("NEW JOB SEEKER CREATED");
    res.status(201).send({
      ok: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

// New company
const createNewCompanyProfile = async (req, res) => {
  const { _id, companyName, contact } = req.body;
  try {
    await companyModel.create({ _id, companyName, contact });
    console.log("NEW COMPANY CREATED");
    res.status(201).send({
      ok: true,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

// Check company name
const checkIsCompanyNameExists = async (req, res) => {
  const { companyName } = req.body;
  try {
    const company = await companyModel.findOne({ companyName }, { _id: true });
    res.status(200).send({
      exists: !!company,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

// Get company(s) by ID(s)
const getCompanyByIds = async (req, res) => {
  const { id, ids } = req.query;
  try {
    if (id) {
      const company = await companyModel.findOne(
        { _id: new Types.ObjectId(id) },
        { _id: true, companyName: true, image: true }
      );
      res.status(200).send({
        company,
      });
    } else if (ids) {
      const splittedIds = ids
        .split(",")
        .filter((id) => /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id))
        .map((id) => new Types.ObjectId(id));
      const companies = await companyModel.findMany(
        {
          _id: {
            $in: splittedIds,
          },
        },
        { _id: true, companyName: true, image: true }
      );
      res.status(200).send({
        companies,
      });
    } else {
      res.status(404).send({
        msg: "ไม่พบบริษัท",
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getMyProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await jobSeekerModel.findOne({ _id: userId }, { interestedList: false });
    if (!user) {
      return res.status(403).send({
        msg: "Access denied",
      });
    }
    res.send(user);
  } catch (e) {
    return res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getJobSeekerInterestedTags = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await jobSeekerModel.findOneAndPopulateTags({ _id: userId }, { interestedTags: true });
    res.send(user.interestedTags);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const updateBasicProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    await jobSeekerModel.updateOne({ _id: userId }, req.body);

    res.send({
      msg: "อัพเดทเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const jobSeekerUpdateProfileImage = async (req, res) => {
  const { userId } = req.user;
  const { image } = req.body;
  try {
    const user = await jobSeekerModel.findOne({ _id: userId }, { profileImage: true });
    if (user.profileImage.key) {
      await cloudinary.deleteFile(user.profileImage.key);
    }
    const uploadedImage = await cloudinary.uploadFile(image);
    user.profileImage = uploadedImage;
    await user.save();

    res.send({
      url: uploadedImage.url,
    });
  } catch (e) {
    console.log(e);

    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const updateEducations = async (req, res) => {
  const { userId } = req.user;
  const educations = req.body;

  try {
    await jobSeekerModel.updateOne({ _id: userId }, { educations });
    res.send({
      msg: "แก้ไขแล้ว",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const updateSettings = async (req, res) => {
  const { userId } = req.user;
  const { canViewEducation } = req.body;

  try {
    await jobSeekerModel.updateOne({ _id: userId }, { "settings.canViewEducation": canViewEducation });
    res.send({
      msg: "ตั้งค่าเสร็จเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await companyModel.findOneAndPopulateTags({ _id: id });
    if (!company) {
      return res.status(404).send({
        msg: "ไม่พบบริษัท",
      });
    }
    res.send(company);
  } catch (e) {
    console.log(e);

    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companyUpdateProfile = async (req, res) => {
  const { userId } = req.user;
  const { companyName, information, tags, contact } = req.body;
  try {
    const company = await companyModel.findOne({ companyName }, { _id: true });
    if (company && company._id.toString() !== userId) {
      return res.status(409).send({
        msg: "ชื่อบริษัทนี้ถูกใช้ไปแล้ว",
      });
    }

    await companyModel.updateOne({ _id: userId }, { companyName, information, tags, contact });

    res.send({
      msg: "แก้ไขเรียบร้อย",
    });
  } catch (e) {
    req.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companyUpdateProfileImage = async (req, res) => {
  const { userId } = req.user;
  const { image } = req.body;
  try {
    const company = await companyModel.findOne({ _id: userId }, { image: true });

    if (company.image.key) {
      await cloudinary.deleteFile(company.image.key);
    }
    const uploadedImage = await cloudinary.uploadFile(image);
    company.image = uploadedImage;
    await company.save();

    res.send({
      url: uploadedImage.url,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getApplicationOwnerProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const jobSeeker = await jobSeekerModel.findOneAndPopulateTags({ _id: id });
    if (!jobSeeker) {
      return res.status(404).send({
        msg: "ไม่พบผู้สมัครงาน",
      });
    }
    if (!jobSeeker.settings.canViewEducation) {
      jobSeeker.educations = undefined;
    }
    res.send(jobSeeker);
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

export default {
  createNewJobSeekerProfile,
  createNewCompanyProfile,
  checkIsCompanyNameExists,
  getCompanyByIds,
  getMyProfile,
  getJobSeekerInterestedTags,
  updateBasicProfile,
  jobSeekerUpdateProfileImage,
  updateEducations,
  updateSettings,
  getCompany,
  companyUpdateProfile,
  companyUpdateProfileImage,
  getApplicationOwnerProfile,
};
