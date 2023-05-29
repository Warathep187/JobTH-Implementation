import mongoose from "mongoose";
import CompanyModel from "../../../src/app/models/schemas/company";

jest.mock("mongoose", () => ({
  Schema: jest.fn(),
  model: jest.fn(),
}));

describe("Company schema", () => {
  it("company schema has been set", () => {
    const schemaCalls = mongoose.Schema.mock.calls[0];

    expect(schemaCalls[0]).toHaveProperty("email");
    expect(schemaCalls[0]).toHaveProperty("password");
    expect(schemaCalls[0]).toHaveProperty("isVerified");
    expect(schemaCalls[0]).toHaveProperty("security");
    expect(schemaCalls[0].security).toHaveProperty("tempId");
    expect(schemaCalls[0]).toHaveProperty("companyName");
    expect(schemaCalls[0]).toHaveProperty("contact");
    expect(schemaCalls[0].contact).toHaveProperty("email");
    expect(schemaCalls[0].contact).toHaveProperty("tel");

    expect(schemaCalls[1]).toHaveProperty("versionKey", false);
    expect(schemaCalls[1]).toHaveProperty("timestamps", false);
  });
});
