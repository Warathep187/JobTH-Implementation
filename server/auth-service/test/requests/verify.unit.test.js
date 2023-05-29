import { body } from "express-validator";
import verify from "../../src/app/requests/verify";

jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    isJWT: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
  })),
}));

describe("Verify validator fields list", () => {
  it("verify validate fields list has 1 element", () => {
    expect(verify.length).toBe(1);
  });

  it("verify validate fields list has specified elements", () => {
    const bodyCalledWith = body.mock.calls[0][0];
    const bodyNestedFields = body.mock.results[0].value;

    expect(bodyCalledWith).toBe("token");
    expect(bodyNestedFields.isJWT).toHaveBeenCalled();
    expect(bodyNestedFields.isJWT.mock.results[0].value.withMessage).toHaveBeenCalledWith("IDการยืนยันตัวตนไม่ถูกต้อง");
  });
});
