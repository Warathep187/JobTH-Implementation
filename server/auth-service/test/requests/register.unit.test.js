import { body, check } from "express-validator";
import register from "../../src/app/requests/register";

jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    isEmail: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
    isStrongPassword: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
    notEmpty: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
  })),
  check: jest.fn(() => ({
    isEmail: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
    matches: jest.fn(() => ({
      withMessage: jest.fn(),
    })),
  })),
}));

describe("Register validator fields list", () => {
  it("job seeker validate fields list has 2 elements", () => {
    expect(register.jobSeekerValidateFieldsList.length).toBe(2);
  });

  it("job seeker validate fields list has specified elements", () => {
    const firstBodyCalledWith = body.mock.calls[0][0];
    const firstBodyNestedFields = body.mock.results[0].value;

    expect(firstBodyCalledWith).toBe("email");
    expect(firstBodyNestedFields.isEmail).toHaveBeenCalled();
    expect(firstBodyNestedFields.isEmail.mock.results[0].value.withMessage).toHaveBeenCalledWith("อีเมลไม่ถูกต้อง");

    const secondBodyCalledWith = body.mock.calls[1][0];
    const secondBodyNestedFields = body.mock.results[1].value;

    expect(secondBodyCalledWith).toBe("password");
    expect(secondBodyNestedFields.isStrongPassword).toHaveBeenCalled();
    expect(secondBodyNestedFields.isStrongPassword.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "รหัสผ่านไม่ปลอดภัย"
    );
  });

  it("company validate fields list has 5 elements", () => {
    expect(register.companyRegisterValidateFieldsList.length).toBe(5);
  });

  it("company validate fields list has specified elements", () => {
    const thirdBodyCalledWith = body.mock.calls[2][0];
    const thirdBodyNestedFields = body.mock.results[2].value;

    expect(thirdBodyCalledWith).toBe("email");
    expect(thirdBodyNestedFields.isEmail).toHaveBeenCalled();
    expect(thirdBodyNestedFields.isEmail.mock.results[0].value.withMessage).toHaveBeenCalledWith("อีเมลไม่ถูกต้อง");

    const fourthBodyCalledWith = body.mock.calls[3][0];
    const fourthBodyNestedFields = body.mock.results[3].value;

    expect(fourthBodyCalledWith).toBe("password");
    expect(fourthBodyNestedFields.isStrongPassword).toHaveBeenCalled();
    expect(fourthBodyNestedFields.isStrongPassword.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "รหัสผ่านไม่ปลอดภัย"
    );

    const fifthBodyCalledWith = body.mock.calls[4][0];
    const fifthBodyNestedFields = body.mock.results[4].value;

    expect(fifthBodyCalledWith).toBe("companyName");
    expect(fifthBodyNestedFields.notEmpty).toHaveBeenCalled();
    expect(fifthBodyNestedFields.notEmpty.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "โปรดกรอกชื่อบริษัทให้ถูกต้อง"
    );

    const firstCheckCalledWith = check.mock.calls[0][0];
    const firstCheckNestedFields = check.mock.results[0].value;

    expect(firstCheckCalledWith).toBe("contact.email");
    expect(firstCheckNestedFields.isEmail).toHaveBeenCalled();
    expect(firstCheckNestedFields.isEmail.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "อีเมลติดต่อไม่ถูกต้อง"
    );

    const secondCheckCalledWith = check.mock.calls[1][0];
    const secondCheckNestedFields = check.mock.results[1].value;

    expect(secondCheckCalledWith).toBe("contact.tel");
    expect(secondCheckNestedFields.matches).toHaveBeenCalledWith(
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    );
    expect(secondCheckNestedFields.matches.mock.results[0].value.withMessage).toHaveBeenCalledWith(
      "เบอร์โทรติดต่อไปถูกต้อง"
    );
  });
});
