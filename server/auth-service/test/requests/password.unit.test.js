import { body } from "express-validator";
import password from "../../src/app/requests/password";

jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    isEmail: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
    isJWT: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
    isStrongPassword: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
  })),
}));

describe("Password management validator fields list", () => {
  it("send email validate fields list has 1 element", () => {
    expect(password.sendEmailValidateFieldsList.length).toBe(1);
  });

  it("send email validate fields list has specified elements", () => {
    const firstBodyCallWith = body.mock.calls[0][0];
    const firstBodyNestedFields = body.mock.results[0].value;

    expect(firstBodyCallWith).toBe("email");
    expect(firstBodyNestedFields.isEmail).toHaveBeenCalled();
    expect(firstBodyNestedFields.isEmail.mock.results[0].value.withMessage).toHaveBeenCalledWith("อีเมลไม่ถูกต้อง");
  });

  it("reset password validate fields list has 2 elements", () => {
    expect(password.resetPasswordValidateFieldsList.length).toBe(2);
  });

  it("reset password validate fields list has specified elements", () => {
    const secondBodyCallWith = body.mock.calls[1][0];
    const secondBodyNestedFields = body.mock.results[1].value;

    expect(secondBodyCallWith).toBe("token");
    expect(secondBodyNestedFields.isJWT).toHaveBeenCalled();
    expect(secondBodyNestedFields.isJWT.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "IDของการรีเซ็ตรหัสผ่านไม่ถูกต้อง"
    );

    const thirdBodyCallWith = body.mock.calls[2][0];
    const thirdBodyNestedFields = body.mock.results[2].value;

    expect(thirdBodyCallWith).toBe("password");
    expect(thirdBodyNestedFields.isStrongPassword).toHaveBeenCalled();
    expect(thirdBodyNestedFields.isStrongPassword.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "รหัสผ่านไม่ปลอดถัย"
    );
  });

  it("change password validate fields list has 2 elements", () => {
    expect(password.changePasswordValidateFieldsList.length).toBe(2);
  });

  it("change password validate fields list has specified elements", () => {
    const fourthBodyCallWith = body.mock.calls[3][0];
    const fourthBodyNestedFields = body.mock.results[3].value;

    expect(fourthBodyCallWith).toBe("oldPassword");
    expect(fourthBodyNestedFields.isStrongPassword).toHaveBeenCalled();
    expect(fourthBodyNestedFields.isStrongPassword.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "รหัสผ่านไม่ถูกต้อง"
    );

    const fifthBodyCallWith = body.mock.calls[4][0];
    const fifthBodyNestedFields = body.mock.results[4].value;

    expect(fifthBodyCallWith).toBe("newPassword");
    expect(fifthBodyNestedFields.isStrongPassword).toHaveBeenCalled();
    expect(fifthBodyNestedFields.isStrongPassword.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "รหัสผ่านใหม่ไม่ปลอดภัย"
    );
  });
});
