import { validateRequests } from "../../src/app/requests/requests";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    errors: [],
  })),
}));

describe("validateRequests func", () => {
  it("this function returned array of errors", async () => {
    const validate = jest.fn();
    const requestValidator = [validate];
    const req = {};
    const res = {};

    const errors = await validateRequests(requestValidator)(req, res);
    expect(errors).toEqual([]);
  });
});
