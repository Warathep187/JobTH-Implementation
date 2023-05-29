import { GATEWAY_VERIFICATION_KEY } from "../../src/app/config";
import jsonwebtoken from "../../src/app/libs/jsonwebtoken";
import validateApiGateWayHeaders from "../../src/app/libs/validateApiGatewayHeaders";

jest.mock("../../src/app/config", () => ({
  GATEWAY_VERIFICATION_KEY: "GATEWAY_VERIFICATION_KEY",
}));
jest.mock("../../src/app/libs/jsonwebtoken");

describe("Validate API gateway headers func", () => {
  it("bearer token does not exists", async () => {
    const req = {
      headers: {},
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };
    await validateApiGateWayHeaders(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Access denied",
    });
  });

  it("catch error because req.headers is undefined", async () => {
    const req = {};
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    await validateApiGateWayHeaders(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Access denied",
    });
  });

  it("verify token failed", async () => {
    jsonwebtoken.verifyToken.mockRejectedValueOnce("ERROR");

    const token = "Bearer TOKEN";
    const req = {
      headers: {
        authorization: token,
      },
    };
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    await validateApiGateWayHeaders(req, res);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status.mock.results[0].value.send).toHaveBeenCalledWith({
      msg: "Access denied",
    });

    jsonwebtoken.verifyToken.mockRestore();
  });

  it("next() has been called", async () => {
    jsonwebtoken.verifyToken.mockResolvedValueOnce(true);

    const token = "Bearer TOKEN";
    const req = {
      headers: {
        authorization: token,
      },
    };
    const res = {};
    const next = jest.fn();

    await validateApiGateWayHeaders(req, res, next);
    expect(jsonwebtoken.verifyToken).toHaveBeenCalledWith("TOKEN", GATEWAY_VERIFICATION_KEY);
    expect(next).toHaveBeenCalled();
  });
});
