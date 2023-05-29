import jobSeekerModel from "../../src/app/models/jobSeeker";
import companyModel from "../../src/app/models/company";
import authControllers from "../../src/app/controllers/auth";
import { v4 } from "uuid";
import hashPassword from "../../src/app/libs/hashPassword";
import { JWT_EMAIL_VERIFICATION_KEY } from "../../src/app/config";
import ROLE from "../../src/constants/role";
import jsonwebtoken from "../../src/app/libs/jsonwebtoken";
import emailSending from "../../src/app/libs/emailSending";
import {
  requestToAnotherServicesAfterCompanyVerified,
  requestToAnotherServicesAfterJobSeekerVerified,
} from "../../src/app/libs/requestToAnotherServices";
import { publish } from "../../src/app/models/messageQueueModel";

jest.mock("../../src/app/models/jobSeeker", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
}));
jest.mock("../../src/app/models/company", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
}));
jest.mock("../../src/app/libs/hashPassword", () => ({
  hashPassword: jest.fn(() => "HASHED_PASSWORD"),
  comparePassword: jest.fn(),
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "UNIQUE_ID"),
}));
jest.mock("../../src/app/libs/jsonwebtoken", () => ({
  generateToken: jest.fn(() => "TOKEN"),
  generateAuthServiceToken: jest.fn(() => "TOKEN"),
  verifyToken: jest.fn(),
}));
jest.mock("../../src/app/config", () => ({
  CLIENT_URL: "CLIENT_URL",
  JWT_EMAIL_VERIFICATION_KEY: "JWT_EMAIL_VERIFICATION_KEY",
  JWT_AUTHENTICATION_KEY: "JWT_AUTHENTICATION_KEY",
  JWT_AUTHENTICATION_EXPIRES_IN: "JWT_AUTHENTICATION_EXPIRES_IN",
  JWT_RESET_PASSWORD_KEY: "JWT_RESET_PASSWORD_KEY",
  JWT_RESET_PASSWORD_EXPIRES_IN: "JWT_RESET_PASSWORD_EXPIRES_IN",
}));
jest.mock("../../src/constants/role", () => ({
  JOB_SEEKER: "JOB_SEEKER",
  COMPANY: "COMPANY",
}));
jest.mock("../../src/app/libs/emailSending", () => ({
  sendEmail: jest.fn(),
}));
jest.mock("../../src/app/libs/serviceTransaction", () => ({
  requestToAnotherServicesAfterCompanyVerified: jest.fn(),
  requestToAnotherServicesAfterJobSeekerVerified: jest.fn(),
}));
jest.mock("../../src/constants/queuesAndExchanges", () => ({
  Exchanges: {
    AUTH_ROLLED_BACK: "AUTH_ROLLED_BACK",
  },
  RoutingKeys: {
    AUTH_PROFILE_ROLLED_BACK: "AUTH_PROFILE_ROLLED_BACK",
    AUTH_APPLICATIONS_ROLLED_BACK: "AUTH_APPLICATIONS_ROLLED_BACK",
  },
  MessageTypes: {
    JOB_SEEKER_ROLLED_BACK: "JOB_SEEKER_ROLLED_BACK",
  },
}));
jest.mock("../../src/app/models/messageQueueModel", () => ({
  publish: jest.fn(),
}));

describe("Job seeker register func", () => {
  const req = {
    body: {
      email: "test@mail.com",
      password: "1234",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    jobSeekerModel.findOne.mockRestore();
    jobSeekerModel.updateOne.mockRestore();
    res.status.mockRestore();
    emailSending.sendEmail.mockRestore();
  });

  it("job seeker has been verified", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({
      isVerified: true,
    });

    await authControllers.jobSeekerRegister(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "อีเมลถูกใช้ไปแล้ว",
    });
  });

  it("job seeker does not verify and respond status 500", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({
      isVerified: false,
    });
    hashPassword.hashPassword.mockRejectedValueOnce("ERROR");

    await authControllers.jobSeekerRegister(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("job seeker does not exist and verification email has been sent", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce(null);
    emailSending.sendEmail.mockImplementation(() => jest.fn());

    await authControllers.jobSeekerRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.JOB_SEEKER,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(jobSeekerModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(jobSeekerModel.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ส่งอีเมลการยืนยันไปยัง ${req.body.email} แล้ว, อีเมลจะหมดอายุใน10นาที`,
    });
  });

  it("job seeker does not exist and verification email does not send", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce(null);
    emailSending.sendEmail.mockImplementation(() => {
      throw new Error();
    });

    await authControllers.jobSeekerRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.JOB_SEEKER,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(jobSeekerModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(jobSeekerModel.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${req.body.email} ได้`,
    });
  });

  it("job seeker is exists and verification email has been sent", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ email: req.body.email, isVerified: false });
    emailSending.sendEmail.mockImplementation(() => jest.fn());

    await authControllers.jobSeekerRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.JOB_SEEKER,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(jobSeekerModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(jobSeekerModel.updateOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ส่งอีเมลการยืนยันไปยัง ${req.body.email} แล้ว, อีเมลจะหมดอายุใน10นาที`,
    });
  });

  it("job seeker is exists and verification email does not send", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ email: req.body.email, isVerified: false });
    emailSending.sendEmail.mockImplementation(() => {
      throw new Error();
    });

    await authControllers.jobSeekerRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.JOB_SEEKER,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(jobSeekerModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(jobSeekerModel.updateOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${req.body.email} ได้`,
    });
  });
});

describe("Company register func", () => {
  const req = {
    body: {
      email: "test@mail.com",
      password: "1234",
      companyName: "test",
      contact: {
        email: "test@mail.com",
        tel: "000-000-0000",
      },
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    companyModel.findOne.mockRestore();
    res.status.mockRestore();
    emailSending.sendEmail.mockRestore();
  });

  it("company has been verified", async () => {
    companyModel.findOne.mockResolvedValueOnce({
      isVerified: true,
    });

    await authControllers.companyRegister(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "อีเมลถูกใช้ไปแล้ว",
    });
  });

  it("company name has already used", async () => {
    companyModel.findOne
      .mockResolvedValueOnce({
        isVerified: false,
      })
      .mockResolvedValueOnce({
        isVerified: true,
      });

    await authControllers.companyRegister(req, res);

    expect(companyModel.findOne).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "ชื่อบริษัทถูกใช้ไปแล้ว",
    });
  });

  it("company does not verify and respond status 500", async () => {
    companyModel.findOne.mockResolvedValueOnce({
      isVerified: false,
    });
    hashPassword.hashPassword.mockRejectedValueOnce("ERROR");

    await authControllers.companyRegister(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("company does not exist and verification email has been sent", async () => {
    companyModel.findOne.mockResolvedValueOnce(null);
    emailSending.sendEmail.mockImplementation(() => jest.fn());

    await authControllers.companyRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.COMPANY,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(companyModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(companyModel.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ส่งอีเมลการยืนยันไปยัง ${req.body.email} แล้ว, อีเมลจะหมดอายุใน10นาที`,
    });
  });

  it("company does not exist and verification email does not send", async () => {
    companyModel.findOne.mockResolvedValueOnce(null);
    emailSending.sendEmail.mockImplementation(() => {
      throw new Error();
    });

    await authControllers.companyRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.COMPANY,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(companyModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(companyModel.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${req.body.email} ได้`,
    });
  });

  it("company is exists and verification email has been sent", async () => {
    companyModel.findOne.mockResolvedValueOnce({ email: req.body.email, isVerified: false });
    emailSending.sendEmail.mockImplementation(() => jest.fn());

    await authControllers.companyRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.COMPANY,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(companyModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(companyModel.updateOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ส่งอีเมลการยืนยันไปยัง ${req.body.email} แล้ว, อีเมลจะหมดอายุใน10นาที`,
    });
  });

  it("company is exists and verification email does not send", async () => {
    companyModel.findOne.mockResolvedValueOnce({ email: req.body.email, isVerified: false });
    emailSending.sendEmail.mockImplementation(() => {
      throw new Error();
    });

    await authControllers.companyRegister(req, res);

    expect(jsonwebtoken.generateToken).toHaveBeenCalledWith(
      {
        type: ROLE.COMPANY,
        verificationId: v4(),
      },
      JWT_EMAIL_VERIFICATION_KEY,
      "10m"
    );
    expect(companyModel.findOne).toHaveBeenCalledWith({ email: req.body.email }, { email: true, isVerified: true });
    expect(companyModel.updateOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${req.body.email} ได้`,
    });
  });
});

describe("Job seeker login func", () => {
  const req = {
    body: {
      email: "test@mail.com",
      password: "1234",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    jobSeekerModel.findOne.mockRestore();
    hashPassword.comparePassword.mockRestore();
  });

  it("mongodb throw an error and respond status 500", async () => {
    jobSeekerModel.findOne.mockRejectedValueOnce();

    await authControllers.jobSeekerLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("job seeker not found", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce(null);

    await authControllers.jobSeekerLogin(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalledWith(
      { email: req.body.email, isVerified: true },
      { password: true }
    );
    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("password does not match", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ password: "12345" });
    hashPassword.comparePassword.mockResolvedValueOnce(false);

    await authControllers.jobSeekerLogin(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.password, "12345");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("job seeker logged in successfully", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, password: "12345" });
    hashPassword.comparePassword.mockResolvedValueOnce(true);

    await authControllers.jobSeekerLogin(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.password, "12345");
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      token: "TOKEN",
      id: "0",
      role: ROLE.JOB_SEEKER,
    });
  });
});

describe("Company login func", () => {
  const req = {
    body: {
      email: "test@mail.com",
      password: "1234",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    companyModel.findOne.mockRestore();
    hashPassword.comparePassword.mockRestore();
  });

  it("mongodb throw an error and respond status 500", async () => {
    companyModel.findOne.mockRejectedValueOnce();

    await authControllers.companyLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("company not found", async () => {
    companyModel.findOne.mockResolvedValueOnce(null);

    await authControllers.companyLogin(req, res);

    expect(companyModel.findOne).toHaveBeenCalledWith({ email: req.body.email, isVerified: true }, { password: true });
    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("password does not match", async () => {
    companyModel.findOne.mockResolvedValueOnce({ password: "12345" });
    hashPassword.comparePassword.mockResolvedValueOnce(false);

    await authControllers.companyLogin(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.password, "12345");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("company logged in successfully", async () => {
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, password: "12345" });
    hashPassword.comparePassword.mockResolvedValueOnce(true);

    await authControllers.companyLogin(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.password, "12345");
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      token: "TOKEN",
      id: "0",
      role: ROLE.COMPANY,
    });
  });
});

describe("Verify job seeker account func", () => {
  const req = {
    body: {
      token: "TOKEN",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    jsonwebtoken.verifyToken.mockRestore();
    jobSeekerModel.findOne.mockRestore();
    jobSeekerModel.deleteOne.mockRestore();
    requestToAnotherServicesAfterJobSeekerVerified.mockRestore();
    publish.mockRestore();
  });

  it("token is invalid and send status 500", async () => {
    jsonwebtoken.verifyToken.mockRejectedValueOnce();

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("invalid role", async () => {
    await jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
    });
  });

  it("valid role but verification ID does not exists", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.JOB_SEEKER,
      verificationId: 0,
    });
    jobSeekerModel.findOne.mockResolvedValueOnce(null);

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
    });
  });

  it("token is valid and requestToAnotherServicesAfterJobSeekerVerified() throw an error", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.JOB_SEEKER,
      verificationId: 0,
    });
    requestToAnotherServicesAfterJobSeekerVerified.mockRejectedValueOnce();
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0 });

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("requestToAnotherServicesAfterJobSeekerVerified() does not return errors", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.JOB_SEEKER,
      verificationId: 0,
    });
    requestToAnotherServicesAfterJobSeekerVerified.mockResolvedValueOnce({
      successes: ["PROFILE", "APPLICATIONS"],
      error: false,
    });
    const saveFn = jest.fn().mockResolvedValueOnce();
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, security: {}, save: saveFn });

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(saveFn).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "ยืนยันอีเมลสำเร็จ",
    });
  });

  it("requestToAnotherServicesAfterJobSeekerVerified() return errors ['PROFILE']", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.JOB_SEEKER,
      verificationId: 0,
    });
    requestToAnotherServicesAfterJobSeekerVerified.mockResolvedValueOnce({
      successes: ["PROFILE"],
      error: true,
    });
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0 });
    publish.mockResolvedValueOnce();

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(publish).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
    });
  });

  it("requestToAnotherServicesAfterJobSeekerVerified() return errors ['PROFILE', 'APPLICATIONS']", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.JOB_SEEKER,
      verificationId: 0,
    });
    requestToAnotherServicesAfterJobSeekerVerified.mockResolvedValueOnce({
      successes: ["PROFILE", "APPLICATIONS"],
      error: true,
    });
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0 });
    publish.mockResolvedValueOnce();

    await authControllers.verifyJobSeekerAccount(req, res);

    expect(publish).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
    });
  });
});

describe("Verify company account func", () => {
  const req = {
    body: {
      token: "TOKEN",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    jsonwebtoken.verifyToken.mockRestore();
    companyModel.findOne.mockRestore();
    companyModel.deleteOne.mockRestore();
    companyModel.deleteMany.mockRestore();
    requestToAnotherServicesAfterCompanyVerified.mockRestore();
    publish.mockRestore();
  });

  it("token is invalid and send status 500", async () => {
    jsonwebtoken.verifyToken.mockRejectedValueOnce();

    await authControllers.verifyCompanyAccount(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("invalid role", async () => {
    await jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.JOB_SEEKER,
      verificationId: 0,
    });

    await authControllers.verifyCompanyAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
    });
  });

  it("valid role but verification ID does not exists", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });
    companyModel.findOne.mockResolvedValueOnce(null);

    await authControllers.verifyCompanyAccount(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDการยืนยันอีเมลไม่ถูกต้อง",
    });
  });

  it("token is valid and requestToAnotherServicesAfterCompanyVerified() throw an error", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });
    requestToAnotherServicesAfterCompanyVerified.mockRejectedValueOnce();
    companyModel.findOne.mockResolvedValueOnce({ _id: 0 });

    await authControllers.verifyCompanyAccount(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("requestToAnotherServicesAfterCompanyVerified() does not return errors", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });
    requestToAnotherServicesAfterCompanyVerified.mockResolvedValueOnce({
      successes: ["PROFILE", "APPLICATIONS"],
      error: false,
    });
    const saveFn = jest.fn().mockResolvedValueOnce();
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, security: {}, save: saveFn });

    await authControllers.verifyCompanyAccount(req, res);

    expect(saveFn).toHaveBeenCalled();
    expect(companyModel.deleteMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "ยืนยันอีเมลสำเร็จ",
    });
  });

  it("requestToAnotherServicesAfterCompanyVerified() return errors ['PROFILE']", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });
    requestToAnotherServicesAfterCompanyVerified.mockResolvedValueOnce({
      successes: ["PROFILE"],
      error: true,
    });
    companyModel.findOne.mockResolvedValueOnce({ _id: 0 });
    publish.mockResolvedValueOnce();

    await authControllers.verifyCompanyAccount(req, res);

    expect(publish).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
    });
  });

  it("requestToAnotherServicesAfterCompanyVerified() return errors ['PROFILE', 'JOBS']", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });
    requestToAnotherServicesAfterCompanyVerified.mockResolvedValueOnce({
      successes: ["PROFILE", "JOBS"],
      error: true,
    });
    companyModel.findOne.mockResolvedValueOnce({ _id: 0 });
    publish.mockResolvedValueOnce();

    await authControllers.verifyCompanyAccount(req, res);

    expect(publish).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
    });
  });

  it("requestToAnotherServicesAfterCompanyVerified() return errors ['PROFILE', 'JOBS', 'APPLICATIONS']", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      type: ROLE.COMPANY,
      verificationId: 0,
    });
    requestToAnotherServicesAfterCompanyVerified.mockResolvedValueOnce({
      successes: ["PROFILE", "JOBS", "APPLICATIONS"],
      error: true,
    });
    companyModel.findOne.mockResolvedValueOnce({ _id: 0 });
    publish.mockResolvedValueOnce();

    await authControllers.verifyCompanyAccount(req, res);

    expect(publish).toHaveBeenCalledTimes(3);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง",
    });
  });
});

describe("Job seeker send email func", () => {
  const req = {
    body: {
      email: "test@mail.com",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    jobSeekerModel.findOne.mockRestore();
    jsonwebtoken.generateToken.mockRestore();
    emailSending.sendEmail.mockRestore();
  });

  it("account not found", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce(null);

    await authControllers.jobSeekerSendEmail(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "ไม่พบผู้ใช้",
    });
  });

  it("mongodb throw an error and respond status 500", async () => {
    jobSeekerModel.findOne.mockRejectedValueOnce();

    await authControllers.jobSeekerSendEmail(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("cannot send email", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, security: {} });
    emailSending.sendEmail.mockRejectedValueOnce();

    await authControllers.jobSeekerSendEmail(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(jsonwebtoken.generateToken).toHaveBeenCalled();
    expect(emailSending.sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${req.body.email} ได้`,
    });
  });

  it("email has been sent", async () => {
    const saveFn = jest.fn();
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, security: {}, save: saveFn });
    emailSending.sendEmail.mockResolvedValueOnce();

    await authControllers.jobSeekerSendEmail(req, res);

    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(jsonwebtoken.generateToken).toHaveBeenCalled();
    expect(saveFn).toHaveBeenCalled();
    expect(emailSending.sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ส่งอีเมลไปยัง ${req.body.email} แล้ว, โปรดเปลี่ยนรหัสผ่านของคุณใน10นาที`,
    });
  });
});

describe("Company send email func", () => {
  const req = {
    body: {
      email: "test@mail.com",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    companyModel.findOne.mockRestore();
    jsonwebtoken.generateToken.mockRestore();
    emailSending.sendEmail.mockRestore();
  });

  it("account not found", async () => {
    companyModel.findOne.mockResolvedValueOnce(null);

    await authControllers.companySendEmail(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "ไม่พบผู้ใช้",
    });
  });

  it("mongodb throw an error and respond status 500", async () => {
    companyModel.findOne.mockRejectedValueOnce();

    await authControllers.companySendEmail(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("cannot send email", async () => {
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, security: {} });
    emailSending.sendEmail.mockRejectedValueOnce();

    await authControllers.companySendEmail(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(jsonwebtoken.generateToken).toHaveBeenCalled();
    expect(emailSending.sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ไม่สามารถส่งอีเมลการยืนยันไปยัง ${req.body.email} ได้`,
    });
  });

  it("email has been sent", async () => {
    const saveFn = jest.fn();
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, security: {}, save: saveFn });
    emailSending.sendEmail.mockResolvedValueOnce();

    await authControllers.companySendEmail(req, res);

    expect(companyModel.findOne).toHaveBeenCalled();
    expect(jsonwebtoken.generateToken).toHaveBeenCalled();
    expect(saveFn).toHaveBeenCalled();
    expect(emailSending.sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: `ส่งอีเมลไปยัง ${req.body.email} แล้ว, โปรดเปลี่ยนรหัสผ่านของคุณใน10นาที`,
    });
  });
});

describe("Job seeker reset password func", () => {
  const req = {
    body: {
      token: "TOKEN",
      password: "1234",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    jobSeekerModel.findOne.mockRestore();
    jsonwebtoken.verifyToken.mockRestore();
  });

  it("role is invalid", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      resetPasswordId: 0,
      type: ROLE.COMPANY,
    });

    await authControllers.jobSeekerResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("jsonwebtoken throw an error and return status 500", async () => {
    jsonwebtoken.verifyToken.mockRejectedValueOnce();

    await authControllers.jobSeekerResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("account not found", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      resetPasswordId: 0,
      type: ROLE.JOB_SEEKER,
    });
    jobSeekerModel.findOne.mockResolvedValueOnce(null);

    await authControllers.jobSeekerResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("password has been changed", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      resetPasswordId: 0,
      type: ROLE.JOB_SEEKER,
    });
    const saveFn = jest.fn();
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, security: {}, save: saveFn });

    await authControllers.jobSeekerResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(jobSeekerModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "รหัสผ่านถูกเปลี่ยนเรียบร้อย",
    });
  });
});

describe("Company reset password func", () => {
  const req = {
    body: {
      token: "TOKEN",
      password: "1234",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    companyModel.findOne.mockRestore();
    jsonwebtoken.verifyToken.mockRestore();
  });

  it("role is invalid", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      resetPasswordId: 0,
      type: ROLE.JOB_SEEKER,
    });

    await authControllers.companyResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("jsonwebtoken throw an error and return status 500", async () => {
    jsonwebtoken.verifyToken.mockRejectedValueOnce();

    await authControllers.companyResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("account not found", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      resetPasswordId: 0,
      type: ROLE.COMPANY,
    });
    companyModel.findOne.mockResolvedValueOnce(null);

    await authControllers.companyResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง",
    });
  });

  it("password has been changed", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce({
      resetPasswordId: 0,
      type: ROLE.COMPANY,
    });
    const saveFn = jest.fn();
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, security: {}, save: saveFn });

    await authControllers.companyResetPassword(req, res);

    expect(jsonwebtoken.verifyToken).toHaveBeenCalled();
    expect(companyModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "รหัสผ่านถูกเปลี่ยนเรียบร้อย",
    });
  });
});

describe("Job seeker change password", () => {
  const req = {
    user: {
      userId: 0,
    },
    body: {
      oldPassword: "12345",
      newPassword: "12345",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    jobSeekerModel.findOne.mockRestore();
    hashPassword.comparePassword.mockRestore();
  });

  it("password does not match", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, password: "1234" });
    hashPassword.comparePassword.mockResolvedValueOnce(false);

    await authControllers.jobSeekerChangePassword(req, res);

    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.oldPassword, "1234");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "รหัสผ่านไม่ถูกต้อง",
    });
  });

  it("bcrypt throw an error and respond status 500", async () => {
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, password: "1234" });
    hashPassword.comparePassword.mockRejectedValueOnce();

    await authControllers.jobSeekerChangePassword(req, res);

    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.oldPassword, "1234");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("password has been changed", async () => {
    const saveFn = jest.fn();
    jobSeekerModel.findOne.mockResolvedValueOnce({ _id: 0, password: "12345", save: saveFn });
    hashPassword.comparePassword.mockResolvedValueOnce(true);

    await authControllers.jobSeekerChangePassword(req, res);

    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.oldPassword, "12345");
    expect(saveFn).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เปลี่ยนรหัสผ่านเรียบร้อย",
    });
  });
});

describe("Company change password", () => {
  const req = {
    user: {
      userId: 0,
    },
    body: {
      oldPassword: "12345",
      newPassword: "12345",
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  beforeEach(() => {
    res.status = jest.fn(() => ({
      send: jest.fn(),
    }));
  });

  afterEach(() => {
    res.status.mockRestore();
    companyModel.findOne.mockRestore();
    hashPassword.comparePassword.mockRestore();
  });

  it("password does not match", async () => {
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, password: "1234" });
    hashPassword.comparePassword.mockResolvedValueOnce(false);

    await authControllers.companyChangePassword(req, res);

    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.oldPassword, "1234");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "รหัสผ่านไม่ถูกต้อง",
    });
  });

  it("bcrypt throw an error and respond status 500", async () => {
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, password: "1234" });
    hashPassword.comparePassword.mockRejectedValueOnce();

    await authControllers.companyChangePassword(req, res);

    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.oldPassword, "1234");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("password has been changed", async () => {
    const saveFn = jest.fn();
    companyModel.findOne.mockResolvedValueOnce({ _id: 0, password: "12345", save: saveFn });
    hashPassword.comparePassword.mockResolvedValueOnce(true);

    await authControllers.companyChangePassword(req, res);

    expect(hashPassword.comparePassword).toHaveBeenCalledWith(req.body.oldPassword, "12345");
    expect(saveFn).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "เปลี่ยนรหัสผ่านเรียบร้อย",
    });
  });
});

describe("Get authenticated information func", () => {
  const req = {
    user: {
      userId: 1,
      role: ROLE.COMPANY,
    },
  };
  const res = {
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
  };

  it("received data", async () => {
    authControllers.getAuthenticatedInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      id: req.user.userId,
      role: req.user.role,
    });
  });
});
