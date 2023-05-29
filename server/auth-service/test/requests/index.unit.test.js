import executeValidator from "../../src/app/requests/requests";
import login from "../../src/app/requests/login";
import register from "../../src/app/requests/register";
import verify from "../../src/app/requests/verify";
import password from "../../src/app/requests/password";
import requests from "../../src/app/requests";

jest.mock("../../src/app/requests/requests", () => jest.fn());
jest.mock("../../src/app/requests/login", () => ["LOGIN"]);
jest.mock("../../src/app/requests/register", () => ({
  jobSeekerValidateFieldsList: ["JOB_SEEKER_REGISTER"],
  companyRegisterValidateFieldsList: ["COMPANY_REGISTER"],
}));
jest.mock("../../src/app/requests/verify", () => ["VERIFY"]);
jest.mock("../../src/app/requests/password", () => ({
  sendEmailValidateFieldsList: ["SEND_EMAIL"],
  resetPasswordValidateFieldsList: ["RESET"],
  changePasswordValidateFieldsList: ["CHANGE"],
}));

describe("executeValidator func", () => {
  it("executeValidator has been called", () => {
    const executeValidatorCalls = executeValidator.mock.calls;

    expect(executeValidator).toHaveBeenCalledTimes(7);
    expect(executeValidatorCalls[0][0]).toEqual(["LOGIN"]);
    expect(executeValidatorCalls[1][0]).toEqual(["JOB_SEEKER_REGISTER"]);
    expect(executeValidatorCalls[2][0]).toEqual(["COMPANY_REGISTER"]);
    expect(executeValidatorCalls[3][0]).toEqual(["VERIFY"]);
    expect(executeValidatorCalls[4][0]).toEqual(["SEND_EMAIL"]);
    expect(executeValidatorCalls[5][0]).toEqual(["RESET"]);
    expect(executeValidatorCalls[6][0]).toEqual(["CHANGE"]);
  });
});
