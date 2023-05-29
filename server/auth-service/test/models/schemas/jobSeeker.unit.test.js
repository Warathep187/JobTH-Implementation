import mongoose from "mongoose";
import JobSeekerModel from "../../../src/app/models/schemas/jobSeeker";

jest.mock("mongoose", () => ({
  Schema: jest.fn(),
  model: jest.fn(),
}));

describe("Job seeker schema", () => {
  it("schema has been set", () => {
    const schemaCalls = mongoose.Schema.mock.calls[0];

    expect(schemaCalls[0]).toHaveProperty("email");
    expect(schemaCalls[0]).toHaveProperty("password");
    expect(schemaCalls[0]).toHaveProperty("isVerified");
    expect(schemaCalls[0]).toHaveProperty("security");
    expect(schemaCalls[0].security).toHaveProperty("tempId");
    expect(schemaCalls[0]).toHaveProperty("verifiedAt");

    expect(schemaCalls[1]).toHaveProperty("versionKey", false);
    expect(schemaCalls[1]).toHaveProperty("timestamps", false);
  });

  it("model has been created", () => {
    expect(mongoose.model).toHaveBeenCalledWith("JobSeeker", new Object());
  });
});
