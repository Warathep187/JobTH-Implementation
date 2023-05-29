import jwt from "jsonwebtoken";
import jsonwebtoken from "../../src/app/libs/jsonwebtoken";
import { AUTH_SERVICE_VERIFICATION_KEY, GATEWAY_VERIFICATION_KEY } from "../../src/app/config";

jest.mock("jsonwebtoken");
jest.mock("../../src/app/config", () => ({
  AUTH_SERVICE_VERIFICATION_KEY: "AUTH_SERVICE_VERIFICATION_KEY",
  GATEWAY_VERIFICATION_KEY: "GATEWAY_VERIFICATION_KEY",
}));

jwt.sign.mockImplementation(() => "TOKEN");
jwt.verify.mockImplementation((token, secretKey, cb) => {
  if (!token || !secretKey) {
    cb("Error");
  } else {
    cb(null, "DECODED");
  }
});

describe("Generate token func", () => {
  it("token has been generated", () => {
    const data = {
      id: 0,
    };
    const expiresIn = "10d";
    const token = jsonwebtoken.generateToken(data, "KEY", expiresIn);
    expect(jwt.sign).toHaveBeenCalledWith(data, "KEY", { expiresIn });
    expect(token).toBe("TOKEN");
  });
});

describe("Generate auth service token", () => {
  it("auth service token has been generated", () => {
    const token = jsonwebtoken.generateAuthServiceToken();
    expect(jwt.sign).toHaveBeenCalledWith("REAL_AUTH_SERVICE", AUTH_SERVICE_VERIFICATION_KEY);
    expect(token).toBe("TOKEN");
  });
});

describe("Verify token func", () => {
  it("rejected", async () => {
    try {
      await jsonwebtoken.verifyToken(null, AUTH_SERVICE_VERIFICATION_KEY);
    } catch (e) {
      expect(e).toBe("Error");
    }
  });

  it("verified", async () => {
    const token = "123";
    const decoded = await jsonwebtoken.verifyToken(token, AUTH_SERVICE_VERIFICATION_KEY);
    expect(decoded).toBe("DECODED");
  });
});

describe("Verify gateway token", () => {
  it("rejected", async () => {
    try {
      await jsonwebtoken.verifyTokenFromGateway(null, AUTH_SERVICE_VERIFICATION_KEY);
    } catch (e) {
      expect(e).toBe("Error");
    }
  });

  it("verified", async () => {
    const token = "123";
    await jsonwebtoken.verifyTokenFromGateway(token, GATEWAY_VERIFICATION_KEY);
    expect(jwt.sign).toBeCalled();
  });
});
