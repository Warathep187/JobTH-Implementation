import jobSeekerModel from "../models/jobSeeker";
import companyModel from "../models/company";
import passwordHashing from "../libs/hashPassword";
import { v4 as uuid } from "uuid";
import emailSending from "../libs/emailSending";
import {
  CLIENT_URL,
  JWT_AUTHENTICATION_EXPIRES_IN,
  JWT_AUTHENTICATION_KEY,
  JWT_EMAIL_VERIFICATION_KEY,
  JWT_RESET_PASSWORD_EXPIRES_IN,
  JWT_RESET_PASSWORD_KEY,
} from "../config";
import JWT from "../libs/jsonwebtoken";
import ROLE from "../../constants/role";
import {
  requestToAnotherServicesAfterJobSeekerVerified,
  requestToAnotherServicesAfterCompanyVerified,
  requestToProfileServiceForCheckCompanyNameExisting,
} from "../libs/requestToAnotherServices";
import { publish } from "../models/messageQueueModel";
import { Exchanges, MessageTypes, RoutingKeys } from "../../constants/queuesAndExchanges";

const jobSeekerRegister = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await jobSeekerModel.findOne({ email }, { email: true, isVerified: true });
    if (user && user.isVerified) {
      return res.status(409).send({
        msg: `อีเมลถูกใช้ไปแล้ว`,
      });
    }

    const hashedPassword = await passwordHashing.hashPassword(password);
    const tempRegisterId = uuid();
    const verificationToken = JWT.generateToken(
      {
        type: ROLE.JOB_SEEKER,
        verificationId: tempRegisterId,
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );

    if (!user) {
      const data = {
        email,
        password: hashedPassword,
        security: {
          tempId: tempRegisterId,
        },
      };
      await jobSeekerModel.create(data);
    } else if (!user.isVerified) {
      const data = {
        password: hashedPassword,
        security: {
          tempId: tempRegisterId,
        },
      };
      await jobSeekerModel.updateOne({ email }, data);
    }

    const emailContent = `
      <h2>โปรดคลิกลิ้งข้างล่างเพื่อยืนยันอีเมลของคุณ</h2>
      <a href="${CLIENT_URL}/auth/resumes/verify?verifyId=${verificationToken}" target="_blank">
        ${CLIENT_URL}/auth/resumes/verify?verifyId=${verificationToken}
      </a>
    `;
    try {
      await emailSending.sendEmail(email, "ยืนยันอีเมล, JobTH", emailContent);

      res.status(201).send({
        msg: `ส่งอีเมลการยืนยันไปยัง ${email} แล้ว, อีเมลจะหมดอายุใน10นาที`,
      });
    } catch (e) {
      res.status(500).send({
        msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${email} ได้`,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companyRegister = async (req, res) => {
  const { email, password, companyName, contact } = req.body;
  try {
    const company = await companyModel.findOne({ email }, { email: true, isVerified: true });
    if (company && company.isVerified) {
      return res.status(409).send({
        msg: `อีเมลถูกใช้ไปแล้ว`,
      });
    }

    const { error, exists } = await requestToProfileServiceForCheckCompanyNameExisting(companyName);
    if (error) {
      return res.status(500).send({
        msg: `มีบางอย่างผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง`,
      });
    } else {
      if (exists) {
        return res.status(409).send({
          msg: `ชื่อบริษัทถูกใช้ไปแล้ว`,
        });
      }
    }

    const hashedPassword = await passwordHashing.hashPassword(password);
    const tempRegisterId = uuid();
    const verificationToken = JWT.generateToken(
      {
        type: ROLE.COMPANY,
        verificationId: tempRegisterId,
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );

    if (company && !company.isVerified) {
      const data = {
        email,
        password: hashedPassword,
        security: {
          tempId: tempRegisterId,
        },
        companyName,
        contact,
      };
      await companyModel.updateOne({ email }, data);
    }

    const emailContent = `
      <h2>โปรดคลิกลิ้งข้างล่างเพื่อยืนยันอีเมลบริษัทของคุณ</h2>
      <a href="${CLIENT_URL}/auth/companies/verify?verifyId=${verificationToken}" target="_blank">
        ${CLIENT_URL}/auth/companies/verify?verifyId=${verificationToken}
      </a>
    `;
    try {
      await emailSending.sendEmail(email, "ยืนยันอีเมลบริษัท, JobTH", emailContent);
      if (!company) {
        await companyModel.create({
          email,
          password: hashedPassword,
          security: {
            tempId: tempRegisterId,
          },
          companyName,
          contact,
        });
      }
      res.status(201).send({
        msg: `ส่งอีเมลการยืนยันไปยัง ${email} แล้ว, อีเมลจะหมดอายุใน10นาที`,
      });
    } catch (e) {
      res.status(500).send({
        msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${email} ได้`,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const jobSeekerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await jobSeekerModel.findOne({ email, isVerified: true }, { password: true });

    if (!user) {
      return res.status(400).send({
        msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const passwordIsMatch = await passwordHashing.comparePassword(password, user.password);
    if (!passwordIsMatch) {
      return res.status(400).send({
        msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const tokenData = {
      id: user._id.toString(),
      role: ROLE.JOB_SEEKER,
    };
    const token = JWT.generateToken(tokenData, JWT_AUTHENTICATION_KEY, JWT_AUTHENTICATION_EXPIRES_IN);
    res.status(200).send({
      token,
      ...tokenData,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companyLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await companyModel.findOne({ email, isVerified: true }, { password: true });

    if (!company) {
      return res.status(400).send({
        msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const passwordIsMatch = await passwordHashing.comparePassword(password, company.password);
    if (!passwordIsMatch) {
      return res.status(400).send({
        msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const tokenData = {
      id: company._id.toString(),
      role: ROLE.COMPANY,
    };
    const token = JWT.generateToken(tokenData, JWT_AUTHENTICATION_KEY, JWT_AUTHENTICATION_EXPIRES_IN);
    res.status(200).send({
      token,
      ...tokenData,
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const verifyJobSeekerAccount = async (req, res) => {
  const { token } = req.body;
  try {
    const { type, verificationId } = await JWT.verifyToken(token, JWT_EMAIL_VERIFICATION_KEY);

    if (type !== ROLE.JOB_SEEKER) {
      return res.status(400).send({
        msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
      });
    }
    const user = await jobSeekerModel.findOne({ "security.tempId": verificationId });
    if (!user) {
      return res.status(400).send({
        msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
      });
    }
    try {
      const { successes, error } = await requestToAnotherServicesAfterJobSeekerVerified(user);
      if (error) {
        for (const service of successes) {
          if (service === "PROFILE") {
            await publish(Exchanges.AUTH, RoutingKeys.AUTH_PROFILE_ROLLED_BACK, {
              type: MessageTypes.JOB_SEEKER_ROLLED_BACK,
              _id: user._id,
            });
          }
        }
        return res.status(500).send({
          msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
        });
      }
      user.isVerified = true;
      user.security.tempId = null;
      user.verifiedAt = new Date();
      await user.save();
    } catch (e) {
      throw new Error(e);
    }
    res.status(200).send({
      msg: "ยืนยันอีเมลสำเร็จ",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const verifyCompanyAccount = async (req, res) => {
  const { token } = req.body;
  try {
    const { type, verificationId } = await JWT.verifyToken(token, JWT_EMAIL_VERIFICATION_KEY);
    if (type !== ROLE.COMPANY) {
      return res.status(400).send({
        msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
      });
    }
    const company = await companyModel.findOne({ "security.tempId": verificationId });
    if (!company) {
      return res.status(400).send({
        msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
      });
    }

    try {
      const { successes, error } = await requestToAnotherServicesAfterCompanyVerified(company);
      if (error) {
        for (const service of successes) {
          if (service === "PROFILE") {
            await publish(Exchanges.AUTH, RoutingKeys.AUTH_PROFILE_ROLLED_BACK, {
              type: MessageTypes.COMPANY_ROLLED_BACK,
              _id: company._id,
            });
          }
        }
        return res.status(500).send({
          msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
        });
      }

      company.isVerified = true;
      company.security.tempId = null;
      company.verifiedAt = new Date();
      await company.save();
      await companyModel.deleteMany({ companyName: company.companyName, isVerified: false });
    } catch (e) {
      throw new Error(e);
    }
    res.status(200).send({
      msg: "ยืนยันอีเมลสำเร็จ",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const jobSeekerSendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await jobSeekerModel.findOne({ email, isVerified: true }, { security: true });
    if (!user) {
      return res.status(400).send({
        msg: "ไม่พบผู้ใช้",
      });
    }
    const resetPasswordId = uuid();
    const token = JWT.generateToken(
      { resetPasswordId, type: ROLE.JOB_SEEKER },
      JWT_RESET_PASSWORD_KEY,
      JWT_RESET_PASSWORD_EXPIRES_IN
    );

    const emailContent = `
    <h2>โปรดคลิกลิ้งข้างล่างเพื่อเปลี่ยนรหัสผ่านของคุณ</h2>
    <a href="${CLIENT_URL}/auth/resumes/reset-password?resetPasswordId=${token}" target="_blank">
      ${CLIENT_URL}/auth/resumes/reset-password?resetPasswordId=${token}
    </a>
  `;
    try {
      await emailSending.sendEmail(email, "รีเซตรหัสผ่าน, JobTH", emailContent);

      user.security.tempId = resetPasswordId;
      await user.save();

      res.status(200).send({
        msg: `ส่งอีเมลไปยัง ${email} แล้ว, โปรดเปลี่ยนรหัสผ่านของคุณใน10นาที`,
      });
    } catch (e) {
      res.status(500).send({
        msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${email} ได้`,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companySendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const company = await companyModel.findOne({ email, isVerified: true }, { security: true });
    if (!company) {
      return res.status(400).send({
        msg: "ไม่พบผู้ใช้",
      });
    }
    const resetPasswordId = uuid();
    const token = JWT.generateToken(
      { resetPasswordId, type: ROLE.COMPANY },
      JWT_RESET_PASSWORD_KEY,
      JWT_RESET_PASSWORD_EXPIRES_IN
    );

    const emailContent = `
    <h2>โปรดคลิกลิ้งข้างล่างเพื่อเปลี่ยนรหัสผ่านของคุณ</h2>
    <a href="${CLIENT_URL}/auth/companies/reset-password?resetPasswordId=${token}" target="_blank">
      ${CLIENT_URL}/auth/companies/reset-password?resetPasswordId=${token}
    </a>
  `;
    try {
      await emailSending.sendEmail(email, "รีเซตรหัสผ่าน, JobTH", emailContent);

      company.security.tempId = resetPasswordId;
      await company.save();

      res.status(200).send({
        msg: `ส่งอีเมลไปยัง ${email} แล้ว, โปรดเปลี่ยนรหัสผ่านของคุณใน10นาที`,
      });
    } catch (e) {
      res.status(500).send({
        msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${email} ได้`,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const jobSeekerResetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const { resetPasswordId, type } = await JWT.verifyToken(token, JWT_RESET_PASSWORD_KEY);
    if (type !== ROLE.JOB_SEEKER) {
      return res.status(400).send({
        msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
      });
    }

    const user = await jobSeekerModel.findOne(
      { "security.tempId": resetPasswordId, isVerified: true },
      { security: true, password: true }
    );
    if (!user) {
      return res.status(400).send({
        msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
      });
    }

    const newHashedPassword = await passwordHashing.hashPassword(password);

    user.password = newHashedPassword;
    user.security.tempId = null;
    await user.save();

    res.status(200).send({
      msg: "รหัสผ่านถูกเปลี่ยนเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companyResetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const { resetPasswordId, type } = await JWT.verifyToken(token, JWT_RESET_PASSWORD_KEY);
    if (type !== ROLE.COMPANY) {
      return res.status(400).send({
        msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
      });
    }

    const company = await companyModel.findOne(
      { "security.tempId": resetPasswordId, isVerified: true },
      { security: true, password: true }
    );
    if (!company) {
      return res.status(400).send({
        msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
      });
    }

    const newHashedPassword = await passwordHashing.hashPassword(password);

    company.password = newHashedPassword;
    company.security.tempId = null;
    await company.save();

    res.status(200).send({
      msg: "รหัสผ่านถูกเปลี่ยนเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const jobSeekerChangePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await jobSeekerModel.findOne({ _id: userId }, { password: true });
    const isMatch = await passwordHashing.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({
        msg: "รหัสผ่านไม่ถูกต้อง",
      });
    }
    const newHashedPassword = await passwordHashing.hashPassword(newPassword);
    user.password = newHashedPassword;
    await user.save();

    res.status(200).send({
      msg: "เปลี่ยนรหัสผ่านเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const companyChangePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const company = await companyModel.findOne({ _id: userId }, { password: true });
    const isMatch = await passwordHashing.comparePassword(oldPassword, company.password);
    if (!isMatch) {
      return res.status(400).send({
        msg: "รหัสผ่านไม่ถูกต้อง",
      });
    }
    const newHashedPassword = await passwordHashing.hashPassword(newPassword);
    company.password = newHashedPassword;
    await company.save();

    res.status(200).send({
      msg: "เปลี่ยนรหัสผ่านเรียบร้อย",
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const getAuthenticatedInfo = (req, res) => {
  const { userId, role } = req.user;
  res.status(200).send({
    id: userId,
    role,
  });
};

export default {
  jobSeekerRegister,
  companyRegister,
  verifyJobSeekerAccount,
  verifyCompanyAccount,
  jobSeekerLogin,
  jobSeekerLogin,
  companyLogin,
  jobSeekerSendEmail,
  companySendEmail,
  jobSeekerResetPassword,
  companyResetPassword,
  jobSeekerChangePassword,
  companyChangePassword,
  getAuthenticatedInfo,
};
