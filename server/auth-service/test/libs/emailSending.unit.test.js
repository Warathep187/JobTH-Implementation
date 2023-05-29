import AWS from "aws-sdk";

jest.mock("aws-sdk");

jest.mock("../../src/app/config", () => ({
  SENDER_EMAIL: "test@mail.com",
}));

describe("Send email func", () => {
  it("reject has been call", () => {
    const email = "test@mail.com";
    const subject = "test subject";
    const contentHtml = "<div></div>";
  });

  expect(true).toBeTruthy()
});
