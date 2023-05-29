import requests from "../../src/app/libs/requests";
import { PROFILE_SERVICE_URL, JOBS_SERVICE_URL, APPLICATIONS_SERVICE_URL } from "../../src/app/config";
import {
  requestToAnotherServicesAfterJobSeekerVerified,
  requestToAnotherServicesAfterCompanyVerified,
} from "../../src/app/libs/requestToAnotherServices";

jest.mock("../../src/app/config", () => ({
  PROFILE_SERVICE_URL: "PROFILE_SERVICE_URL",
  JOBS_SERVICE_URL: "JOBS_SERVICE_URL",
  APPLICATIONS_SERVICE_URL: "APPLICATIONS_SERVICE_URL",
}));
jest.mock("../../src/app/libs/requests", () => ({
  post: jest.fn(),
}));

beforeAll(() => {
  requests.post.mockRestore();
});

describe("Requested by job seeker", () => {
  const createdUser = {
    _id: 0,
  };

  beforeEach(() => {
    requests.post.mockRestore();
  });

  it("profile service does not success", async () => {
    requests.post.mockImplementation((url) => {
      if (url === `${PROFILE_SERVICE_URL}/auth/new-job-seeker`) {
        throw new Error();
      }
    });
    const result = await requestToAnotherServicesAfterJobSeekerVerified(createdUser);
    expect(result.error).toBeTruthy();
    expect(result.successes).toEqual([]);
    expect(requests.post).toHaveBeenCalledTimes(1);
  });

  it("application service does not success", async () => {
    requests.post.mockImplementation((url) => {
      if (url === `${APPLICATIONS_SERVICE_URL}/auth/new-job-seeker`) {
        throw new Error();
      }
    });
    const result = await requestToAnotherServicesAfterJobSeekerVerified(createdUser);
    expect(result.error).toBeTruthy();
    expect(result.successes).toEqual(["PROFILE"]);
    expect(requests.post).toHaveBeenCalledTimes(2);
  });

  it("success", async () => {
    requests.post.mockImplementation(() => jest.fn());
    const result = await requestToAnotherServicesAfterJobSeekerVerified(createdUser);
    expect(result.error).toBeFalsy();
    expect(result.successes).toEqual(["PROFILE", "APPLICATIONS"]);
    expect(requests.post).toHaveBeenCalledTimes(2);
  });
});

describe("Requested by company", () => {
  const createdCompany = {
    _id: 0,
    companyName: "Space x",
    contact: {
      email: "",
      tel: "",
    },
  };

  beforeEach(() => {
    requests.post.mockRestore();
  });

  it("profile service does not success", async () => {
    requests.post.mockImplementation((url) => {
      if (url === `${PROFILE_SERVICE_URL}/auth/new-company`) {
        throw new Error();
      }
    });
    const result = await requestToAnotherServicesAfterCompanyVerified(createdCompany);
    expect(result.error).toBeTruthy();
    expect(result.successes).toEqual([]);
    expect(requests.post).toHaveBeenCalledTimes(1);
  });

  it("jobs service does not success", async () => {
    requests.post.mockImplementation((url) => {
      if (url === `${JOBS_SERVICE_URL}/auth/new-company`) {
        throw new Error();
      }
    });
    const result = await requestToAnotherServicesAfterCompanyVerified(createdCompany);
    expect(result.error).toBeTruthy();
    expect(result.successes).toEqual(["PROFILE"]);
    expect(requests.post).toHaveBeenCalledTimes(2);
  });

  it("application service does not success", async () => {
    requests.post.mockImplementation((url) => {
      if (url === `${APPLICATIONS_SERVICE_URL}/auth/new-company`) {
        throw new Error();
      }
    });
    const result = await requestToAnotherServicesAfterCompanyVerified(createdCompany);
    expect(result.error).toBeTruthy();
    expect(result.successes).toEqual(["PROFILE", "JOBS"]);
    expect(requests.post).toHaveBeenCalledTimes(3);
  });

  it("success", async () => {
    requests.post.mockImplementation(() => jest.fn());
    const result = await requestToAnotherServicesAfterCompanyVerified(createdCompany);
    expect(result.error).toBeFalsy();
    expect(result.successes).toEqual(["PROFILE", "JOBS", "APPLICATIONS"]);
    expect(requests.post).toHaveBeenCalledTimes(3);
  });
});
