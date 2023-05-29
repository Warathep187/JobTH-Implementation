import bcrypt from "bcryptjs";
import hashPassword from "../../src/app/libs/hashPassword";

jest.mock("bcryptjs");

describe("Hash password func", () => {
  beforeEach(() => {
    bcrypt.hash.mockRestore();
  });

  it("return hashed password", async () => {
    bcrypt.hash.mockResolvedValueOnce("HASHED_PASSWORD");

    const password = "1234";
    const hashedPassword = await hashPassword.hashPassword(password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
    expect(hashedPassword).toBe("HASHED_PASSWORD");
  });

  it("throw error because password is undefined", async () => {
    bcrypt.hash.mockImplementation((password) => {
      if (!password) {
        throw new Error("ERROR");
      }
    });
    try {
      await hashPassword.hashPassword();
    } catch (e) {
      expect(e.message).toBe("Error: ERROR");
    }
  });
});

describe("Compare password func", () => {
  beforeAll(() => {
    bcrypt.compare.mockRestore();
    bcrypt.compare.mockImplementation((password, storedPassword) => password === storedPassword);
  });

  it("password does not match", async () => {
    const password = "123456";
    const storedPassword = "12345";

    const isMatch = await hashPassword.comparePassword(password, storedPassword);
    expect(isMatch).toBeFalsy();
  });

  it("password match", async () => {
    const password = "123456";
    const storedPassword = "123456";

    const isMatch = await hashPassword.comparePassword(password, storedPassword);
    expect(isMatch).toBeTruthy();
  });
});
