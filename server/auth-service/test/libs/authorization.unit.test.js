import authorization from "../../src/app/libs/authorization";

jest.mock("../../src/constants/role", () => ({
  COMPANY: "COMPANY",
  JOB_SEEKER: "JOB_SEEKER",
}));

describe("Verify company func", () => {
  it("role is not COMPANY", () => {
    const req = {
      headers: {
        role: "JOB_SEEKER",
      },
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    authorization.verifyCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Access denied",
    });
  });

  it("role is COMPANY but next is undefined", () => {
    const req = {
      headers: {
        userid: "USER_ID",
        role: "COMPANY",
      },
      user: null,
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    authorization.verifyCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("role is COMPANY", () => {
    const req = {
      headers: {
        userid: "USER_ID",
        role: "COMPANY",
      },
      user: null,
    };
    const res = {};
    const next = jest.fn();
    authorization.verifyCompany(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({
      userId: "USER_ID",
      role: "COMPANY",
    });
  });
});

describe("Verify job seeker func", () => {
  it("role is not JOB_SEEKER", () => {
    const req = {
      headers: {
        role: "COMPANY",
      },
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    authorization.verifyJobSeeker(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Access denied",
    });
  });

  it("role is JOB_SEEKER but next is undefined", () => {
    const req = {
      headers: {
        role: "JOB_SEEKER",
        userid: "USER_ID",
      },
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    authorization.verifyJobSeeker(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });
});

describe("Verify all role func", () => {
  it("next is undefined", () => {
    const req = {
      headers: {
        userid: "USER_ID",
        role: "SOMETHING",
      },
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    authorization.verifyAllRole(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Something went wrong",
    });
  });

  it("next function has been call", () => {
    const req = {
      headers: {
        userid: "USER_ID",
        role: "SOMETHING",
      },
    };
    const res = {};
    const next = jest.fn();

    authorization.verifyAllRole(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
