import { body } from "express-validator";
import loginValidateFieldsList from "../../src/app/requests/login";

jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    isEmail: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
    isLength: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
  })),
}));

describe("Login validator fields list", () => {
  it("validateFieldsList has 2 elements", () => {
    expect(loginValidateFieldsList.length).toBe(2);
  });

  it("validateFieldsList has specified elements", () => {
    const bodyCalls = body.mock.calls;
    const firstBodyNestedFields = body.mock.results[0].value;
    const secondBodyNestedFields = body.mock.results[1].value;

    expect(body).toHaveBeenCalledTimes(2);
    expect(bodyCalls[0][0]).toBe("email");
    expect(bodyCalls[1][0]).toBe("password");

    expect(firstBodyNestedFields.isEmail).toHaveBeenCalled();
    expect(firstBodyNestedFields.isEmail.mock.results[0].value.withMessage).toHaveBeenCalledWith("อีเมลไม่ถูกต้อง");
    expect(secondBodyNestedFields.isLength).toHaveBeenCalledWith({ min: 8 });
    expect(secondBodyNestedFields.isLength.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "รหัสผ่านไม่ถูกต้อง"
    );
  });
});
