jest.useRealTimers();

import express from "express";
import mongoose from "mongoose";
import supertest from "supertest";
import authRouter from "../../src/app/routes";

import jobSeekerModel from "../../src/app/models/jobSeeker";
import companyModel from "../../src/app/models/company";
import { connectRabbitMQ } from "../../src/app/models/messageQueueModel";
import validateApiGateWayHeaders from "../../src/app/libs/validateApiGatewayHeaders";
import ROLE from "../../src/constants/role";

const MONGODB_URL = "mongodb://localhost:27017/IntegrationTest";
const RABBITMQ_URL = "amqp://rabbit:1234@localhost:5672/";
const GATEWAY_TOKEN = "eyJhbGciOiJIUzI1NiJ9.UkVBTF9HQVRFV0FZ.NxZ0USUWqwx6AyHTcmCGssE6hl4-2ImhEMOnyJU75b0";

describe("Auth routes /api/auth", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", validateApiGateWayHeaders, authRouter);

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URL);
    await connectRabbitMQ(RABBITMQ_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("GET /authenticate", () => {
    const URL = "/api/auth/authenticate";

    it("500 | request does not come from Gateway", () => {
      return supertest(app)
        .get(URL)
        .then((res) => {
          expect(res.status).toBe(403);
          expect(res.body.msg).toBe("Access denied");
        });
    });

    it("200 | job seeker authenticated", () => {
      return supertest(app)
        .get(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
          userid: "12345",
          role: ROLE.JOB_SEEKER,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual({
            id: "12345",
            role: ROLE.JOB_SEEKER,
          });
        });
    });

    it("200 | company authenticated", () => {
      return supertest(app)
        .get(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
          userid: "67890",
          role: ROLE.COMPANY,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual({
            id: "67890",
            role: ROLE.COMPANY,
          });
        });
    });
  });

  describe("POST /resumes/register", () => {
    const URL = "/api/auth/resumes/register";

    it("403 | request does not come from Gateway", () => {
      return supertest(app)
        .post(URL)
        .then((res) => {
          expect(res.status).toBe(403);
          expect(res.body.msg).toBe("Access denied");
        });
    });

    it("400 | invalid email format", () => {
      const DATA = {
        email: "xxx@mail",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toEqual("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | invalid email format", () => {
      const DATA = {
        email: "@mail.com",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toEqual("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | invalid email format", () => {
      const DATA = {
        email: "xxx@.com",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toEqual("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | password is not strong enough", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "1234567890",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ปลอดภัย");
        });
    });

    it("409 | email has already used", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .send(DATA)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .then((res) => {
          expect(res.status).toBe(409);
          expect(res.body.msg).toBe("อีเมลถูกใช้ไปแล้ว");
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });

    it("500 | email does not send, because email does not verified in SES sandbox", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };

      return supertest(app)
        .post(URL)
        .send(DATA)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe(`ไม่สามารถส่งอีเมลการยืนยันไปยัง ${DATA.email} ได้`);
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ email: DATA.email });
        });
    });

    it("201 | verification email has been sent", () => {
      const DATA = {
        email: "warathep187@gmail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };

      return supertest(app)
        .post(URL)
        .send(DATA)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body.msg).toBe(`ส่งอีเมลการยืนยันไปยัง ${DATA.email} แล้ว, อีเมลจะหมดอายุใน10นาที`);
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ email: DATA.email });
        });
    });
  });

  describe("POST /companies/register", () => {
    const URL = "/api/auth/companies/register";

    it("403 | request does not come from Gateway", () => {
      return supertest(app)
        .post(URL)
        .then((res) => {
          expect(res.status).toBe(403);
          expect(res.body.msg).toBe("Access denied");
        });
    });

    it("400 | invalid email format", () => {
      const DATA = {
        companyName: "Space X",
        email: "xxx@mail",
        password: "1234",
        companyName: "Space X",
        contact: {
          email: "xxx@mail.com",
          tel: "000-000-0000",
        },
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toEqual("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | password is not strong enough", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "1234567890",
        companyName: "Space X",
        contact: {
          email: "xxx@mail.com",
          tel: "000-000-0000",
        },
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ปลอดภัย");
        });
    });

    it("400 | company name does not provided", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
        companyName: "",
        contact: {
          email: "xxx@mail.com",
          tel: "000-000-0000",
        },
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("โปรดกรอกชื่อบริษัทให้ถูกต้อง");
        });
    });

    it("400 | email contact is invalid", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
        companyName: "Space X",
        contact: {
          email: "xxx@mail",
          tel: "000-000-0000",
        },
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลติดต่อไม่ถูกต้อง");
        });
    });

    it("400 | tel no. contact is invalid", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
        companyName: "Space X",
        contact: {
          email: "xxx@mail.com",
          tel: "xxx-000-yyyy-x",
        },
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("เบอร์โทรติดต่อไปถูกต้อง");
        });
    });

    it("409 | email has already used", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
        companyName: "Space X",
        contact: {
          email: "xxx@mail.com",
          tel: "000-000-0000",
        },
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        companyName: "Space X",
        isVerified: true,
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .send(DATA)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .then((res) => {
          expect(res.status).toBe(409);
          expect(res.body.msg).toBe("อีเมลถูกใช้ไปแล้ว");
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });

    it("500 | email does not send, because email does not verified in SES sandbox", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
        companyName: "Space X",
        contact: {
          email: "xxx@mail.com",
          tel: "000-000-0000",
        },
      };

      return supertest(app)
        .post(URL)
        .send(DATA)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe(`ไม่สามารถส่งอีเมลการยืนยันไปยัง ${DATA.email} ได้`);
        })
        .finally(async () => {
          await companyModel.deleteOne({ email: DATA.email });
        });
    });

    it("201 | verification email has been sent", () => {
      const DATA = {
        email: "warathep187@gmail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
        companyName: "Space X",
        contact: {
          email: "xxx@mail.com",
          tel: "000-000-0000",
        },
      };

      return supertest(app)
        .post(URL)
        .send(DATA)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body.msg).toBe(`ส่งอีเมลการยืนยันไปยัง ${DATA.email} แล้ว, อีเมลจะหมดอายุใน10นาที`);
        })
        .finally(async () => {
          await companyModel.deleteOne({ email: DATA.email });
        });
    });
  });

  describe("POST /resumes/login", () => {
    const URL = "/api/auth/resumes/login";

    it("400 | email is invalid", () => {
      const DATA = {
        email: "xxx@mail",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | password does not strong", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | account not found", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | password does not match", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });

    it("200 | Logged in!!", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.token).toBeDefined();
          expect(res.body.id).toBe(EXISTED_ACCOUNT._id);
          expect(res.body.role).toBe(ROLE.JOB_SEEKER);
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("POST /companies/login", () => {
    const URL = "/api/auth/companies/login";

    it("400 | email is invalid", () => {
      const DATA = {
        email: "xxx@mail",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | password does not strong", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "1234",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | account not found", () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | password does not match", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        companyName: "Space X",
        isVerified: true,
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });

    it("200 | Logged in!!", async () => {
      const DATA = {
        email: "xxx@mail.com",
        password: "D@IDSqm7ICfI%8Yw2eLa",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        companyName: "Space X",
        isVerified: true,
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.token).toBeDefined();
          expect(res.body.id).toBe(EXISTED_ACCOUNT._id);
          expect(res.body.role).toBe(ROLE.COMPANY);
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("PUT /resumes/verify", () => {
    const URL = "/api/auth/resumes/verify";

    it("400 | verification token is invalid", () => {
      const DATA = {
        token: "THIS_IS_TOKEN",
      };
      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDการยืนยันตัวตนไม่ถูกต้อง");
        });
    });

    it("500 | verify token error", () => {
      const DATA = {
        token: "eyJhbGciOiJIUzI1NiJ9.SEVMTE8.AKeM0lpvOn1J24YJPTM2l7z7iKZ1RcGn-PhXvtbGhP0",
      };
      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe("Something went wrong");
        });
    });

    it("400 | role is COMPANY", () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJDT01QQU5ZIiwiaWF0IjoxNjg0NTc4MTU3fQ.TT3vq4zNsz64NZ3aZQkrsXCKwNd2XWPWQrOHWPCDi1M",
      };
      // {
      //   "verificationId": "123",
      //   "type": "COMPANY"
      // }
      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDการยืนยันอีเมลไม่ถูกต้อง");
        });
    });

    it("400 | verification ID not found", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NTc4MzY0fQ.l2mOMb71E1QoQcKKeD_ogfw3tHaquOEs0ov2Woegtb4",
      };
      // {
      //   "verificationId": "123",
      //   "type": "JOB_SEEKER"
      // }

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDการยืนยันอีเมลไม่ถูกต้อง");
        });
    });

    it("500 | another service are downed", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NTc4MzY0fQ.l2mOMb71E1QoQcKKeD_ogfw3tHaquOEs0ov2Woegtb4",
      };
      // {
      //   "verificationId": "123",
      //   "type": "JOB_SEEKER"
      // }
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: false,
        security: {
          tempId: "123",
        },
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง");
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("PUT /companies/verify", () => {
    const URL = "/api/auth/companies/verify";

    it("400 | verification token is invalid", () => {
      const DATA = {
        token: "THIS_IS_TOKEN",
      };
      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDการยืนยันตัวตนไม่ถูกต้อง");
        });
    });

    it("500 | verify token error", () => {
      const DATA = {
        token: "eyJhbGciOiJIUzI1NiJ9.SEVMTE8.AKeM0lpvOn1J24YJPTM2l7z7iKZ1RcGn-PhXvtbGhP0",
      };
      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe("Something went wrong");
        });
    });

    it("400 | role is JOB_SEEKER", () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NjgxOTg3fQ.RgpDjh8g5P8VtQ-kZ7KZfh_nwQaP0vkOy0Kn-wS0C98",
      };
      // {
      //   "verificationId": "123",
      //   "type": "JOB_SEEKER"
      // }
      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDการยืนยันอีเมลไม่ถูกต้อง");
        });
    });

    it("400 | verification ID not found", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJDT01QQU5ZIiwiaWF0IjoxNjg0NjgyMDI0fQ.W4l7u_NBQ9CMawlPHzVu3vMV5HiOCAtyxiyIihO3hkg",
      };
      // {
      //   "verificationId": "123",
      //   "type": "COMPANY"
      // }

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDการยืนยันอีเมลไม่ถูกต้อง");
        });
    });

    it("500 | another service are downed", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJDT01QQU5ZIiwiaWF0IjoxNjg0NjgyMDI0fQ.W4l7u_NBQ9CMawlPHzVu3vMV5HiOCAtyxiyIihO3hkg",
      };
      // {
      //   "verificationId": "123",
      //   "type": "COMPANY"
      // }
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: false,
        companyName: "Space X",
        security: {
          tempId: "123",
        },
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe("เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้งภายหลัง");
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("POST /resumes/reset-password/send-email", () => {
    const URL = "/api/auth/resumes/reset-password/send-email";

    it("400 | email is invalid", () => {
      const DATA = {
        email: "xxx@mail",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | account not found", () => {
      const DATA = {
        email: "xxx@mail.com",
      };

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("ไม่พบผู้ใช้");
        });
    });

    it("500 | email does not send, because email does not verified in SES sandbox", async () => {
      const DATA = {
        email: "xxx@mail.com",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe(`ไม่สามารถส่งอีเมลการยืนยันไปยัง ${DATA.email} ได้`);
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });

    it("200 | reset password email has been sent", async () => {
      const DATA = {
        email: "warathep187@gmail.com",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "warathep187@gmail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.msg).toBe(`ส่งอีเมลไปยัง ${DATA.email} แล้ว, โปรดเปลี่ยนรหัสผ่านของคุณใน10นาที`);
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("POST /companies/reset-password/send-email", () => {
    const URL = "/api/auth/companies/reset-password/send-email";

    it("400 | email is invalid", () => {
      const DATA = {
        email: "xxx@mail",
      };
      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("อีเมลไม่ถูกต้อง");
        });
    });

    it("400 | account not found", () => {
      const DATA = {
        email: "xxx@mail.com",
      };

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("ไม่พบผู้ใช้");
        });
    });

    it("500 | email does not send, because email does not verified in SES sandbox", async () => {
      const DATA = {
        email: "xxx@mail.com",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "xxx@mail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        companyName: "Space X",
        isVerified: true,
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe(`ไม่สามารถส่งอีเมลการยืนยันไปยัง ${DATA.email} ได้`);
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });

    it("200 | reset password email has been sent", async () => {
      const DATA = {
        email: "warathep187@gmail.com",
      };
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "warathep187@gmail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        companyName: "Space X",
        isVerified: true,
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .post(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.msg).toBe(`ส่งอีเมลไปยัง ${DATA.email} แล้ว, โปรดเปลี่ยนรหัสผ่านของคุณใน10นาที`);
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("PUT /resumes/reset-password/reset", () => {
    const URL = "/api/auth/resumes/reset-password/reset";

    it("400 | token is invalid", () => {
      const DATA = {
        token: "THIS_IS_TOKEN",
        password: "1234",
      };

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDของการรีเซ็ตรหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | password is not strong", () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NTc4MzY0fQ.l2mOMb71E1QoQcKKeD_ogfw3tHaquOEs0ov2Woegtb4",
        password: "1234567890",
      };

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ปลอดถัย");
        });
    });

    it("500 | verify token failed", () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NTc4MzY0fQ.l2mOMb71E1QoQcKKeD_ogfw3tHaquOEs0ov2Woegtb4",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      // {
      //   "resetPasswordId": "123",
      //   "type": "COMPANY"
      // }

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe("Something went wrong");
        });
    });

    it("400 | reset password id not found", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNldFBhc3N3b3JkSWQiOiIxMjMiLCJ0eXBlIjoiSk9CX1NFRUtFUiIsImlhdCI6MTY4NDU4MDYxOH0.1E5L4fIQrT7RXuFNwyn_swK9tbn92i5-9WWu1s1EnUI",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      // {
      //   "resetPasswordId": "123",
      //   "type": "JOB_SEEKER"
      // }

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง");
        });
    });

    it("200 | password has been reset", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNldFBhc3N3b3JkSWQiOiIxMjMiLCJ0eXBlIjoiSk9CX1NFRUtFUiIsImlhdCI6MTY4NDU4MDYxOH0.1E5L4fIQrT7RXuFNwyn_swK9tbn92i5-9WWu1s1EnUI",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      // {
      //   "resetPasswordId": "123",
      //   "type": "JOB_SEEKER"
      // }
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "warathep187@gmail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
        security: {
          tempId: "123",
        },
      };
      await jobSeekerModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.msg).toBe("รหัสผ่านถูกเปลี่ยนเรียบร้อย");
        })
        .finally(async () => {
          await jobSeekerModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("PUT /companies/reset-password/reset", () => {
    const URL = "/api/auth/companies/reset-password/reset";

    it("400 | token is invalid", () => {
      const DATA = {
        token: "THIS_IS_TOKEN",
        password: "1234",
      };

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDของการรีเซ็ตรหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | password is not strong", () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NTc4MzY0fQ.l2mOMb71E1QoQcKKeD_ogfw3tHaquOEs0ov2Woegtb4",
        password: "1234567890",
      };

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ปลอดถัย");
        });
    });

    it("500 | verify token failed", () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJpZmljYXRpb25JZCI6IjEyMyIsInR5cGUiOiJKT0JfU0VFS0VSIiwiaWF0IjoxNjg0NTc4MzY0fQ.l2mOMb71E1QoQcKKeD_ogfw3tHaquOEs0ov2Woegtb4",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      // {
      //   "resetPasswordId": "123",
      //   "type": "JOB_SEEKER"
      // }

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.msg).toBe("Something went wrong");
        });
    });

    it("400 | reset password id not found", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNldFBhc3N3b3JkSWQiOiIxMjMiLCJ0eXBlIjoiQ09NUEFOWSIsImlhdCI6MTY4NDY4MjI1Mn0.QTUr0nLNprLk969fv9RQLrjU1NPn2uiVB_hOS9jWIAg",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      // {
      //   "resetPasswordId": "123",
      //   "type": "COMPANY"
      // }

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("IDสำหรับการเปลี่ยนรหัสผ่านไม่ถูกต้อง");
        });
    });

    it("200 | password has been reset", async () => {
      const DATA = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNldFBhc3N3b3JkSWQiOiIxMjMiLCJ0eXBlIjoiQ09NUEFOWSIsImlhdCI6MTY4NDY4MjI1Mn0.QTUr0nLNprLk969fv9RQLrjU1NPn2uiVB_hOS9jWIAg",
        password: "D@IDSqm7ICfI%8Yw2eLabc123",
      };
      // {
      //   "resetPasswordId": "123",
      //   "type": "COMPANY"
      // }
      const EXISTED_ACCOUNT = {
        _id: "6440da0084f65327d41dfc8e",
        email: "warathep187@gmail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
        companyName: "Space X",
        security: {
          tempId: "123",
        },
      };
      await companyModel.create(EXISTED_ACCOUNT);

      return supertest(app)
        .put(URL)
        .set({
          Authorization: GATEWAY_TOKEN,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.msg).toBe("รหัสผ่านถูกเปลี่ยนเรียบร้อย");
        })
        .finally(async () => {
          await companyModel.deleteOne({ _id: EXISTED_ACCOUNT._id });
        });
    });
  });

  describe("PUT /resumes/change-password", () => {
    const URL = "/api/auth/resumes/change-password";
    const loggedInHeaders = {
      Authorization: GATEWAY_TOKEN,
      userid: "6440da0084f65327d41dfc8e",
    };

    beforeAll(async () => {
      await jobSeekerModel.create({
        _id: "6440da0084f65327d41dfc8e",
        email: "warathep187@gmail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        isVerified: true,
      });
    });

    afterAll(async () => {
      await jobSeekerModel.deleteOne({ _id: "6440da0084f65327d41dfc8e" });
    });

    it("403 | role is COMPANY", () => {
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.COMPANY,
        })
        .then((res) => {
          expect(res.status).toBe(403);
          expect(res.body.msg).toBe("Access denied");
        });
    });

    it("400 | old password is not strong", () => {
      const DATA = {
        oldPassword: "12345",
        newPassword: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.JOB_SEEKER,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | old password is not strong", () => {
      const DATA = {
        oldPassword: "D@IDSqm7ICfI%8Yw2eLa",
        newPassword: "12345",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.JOB_SEEKER,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านใหม่ไม่ปลอดภัย");
        });
    });

    it("400 | password does not match", () => {
      const DATA = {
        oldPassword: "D@IDSqm7ICfI%8Yw2eLabcd",
        newPassword: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.JOB_SEEKER,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ถูกต้อง");
        });
    });

    it("200 | password has been changed", () => {
      const DATA = {
        oldPassword: "D@IDSqm7ICfI%8Yw2eLa",
        newPassword: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.JOB_SEEKER,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.msg).toBe("เปลี่ยนรหัสผ่านเรียบร้อย");
        });
    });
  });

  describe("PUT /companies/change-password", () => {
    const URL = "/api/auth/companies/change-password";
    const loggedInHeaders = {
      Authorization: GATEWAY_TOKEN,
      userid: "6440da0084f65327d41dfc8e",
    };

    beforeAll(async () => {
      await companyModel.create({
        _id: "6440da0084f65327d41dfc8e",
        email: "warathep187@gmail.com",
        password: "$2a$10$6y3jq4/oAtHGeQNWd0s9IuNnNIgmcftIFZOebK3T2MWDZgIJjHnJO",
        companyName: "Space X",
        isVerified: true,
      });
    });

    afterAll(async () => {
      await companyModel.deleteOne({ _id: "6440da0084f65327d41dfc8e" });
    });

    it("403 | role is JOB_SEEKER", () => {
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.JOB_SEEKER,
        })
        .then((res) => {
          expect(res.status).toBe(403);
          expect(res.body.msg).toBe("Access denied");
        });
    });

    it("400 | old password is not strong", () => {
      const DATA = {
        oldPassword: "12345",
        newPassword: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.COMPANY,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ถูกต้อง");
        });
    });

    it("400 | old password is not strong", () => {
      const DATA = {
        oldPassword: "D@IDSqm7ICfI%8Yw2eLa",
        newPassword: "12345",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.COMPANY,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านใหม่ไม่ปลอดภัย");
        });
    });

    it("400 | password does not match", () => {
      const DATA = {
        oldPassword: "D@IDSqm7ICfI%8Yw2eLabcd",
        newPassword: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.COMPANY,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("รหัสผ่านไม่ถูกต้อง");
        });
    });

    it("200 | password has been changed", () => {
      const DATA = {
        oldPassword: "D@IDSqm7ICfI%8Yw2eLa",
        newPassword: "D@IDSqm7ICfI%8Yw2eLa",
      };
      return supertest(app)
        .put(URL)
        .set({
          ...loggedInHeaders,
          role: ROLE.COMPANY,
        })
        .send(DATA)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.msg).toBe("เปลี่ยนรหัสผ่านเรียบร้อย");
        });
    });
  });
});
