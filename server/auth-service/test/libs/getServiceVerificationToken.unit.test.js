import JWT from "../../src/app/libs/jsonwebtoken";
import getAuthServiceVerificationToken from "../../src/app/libs/getServiceVerificationToken";

jest.mock("../../src/app/libs/jsonwebtoken", () => ({
  generateAuthServiceToken: jest.fn(() => "SOME_TOKEN"),
}));

describe("Get service verification token func", () => {
  it("received header token", () => {
    const headersToken = getAuthServiceVerificationToken();

    expect(JWT.generateAuthServiceToken).toHaveBeenCalled();
    expect(JWT.generateAuthServiceToken.mock.results[0].value).toBe("SOME_TOKEN");
    expect(headersToken).toBe(`Bearer SOME_TOKEN`);
  });
});
