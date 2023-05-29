import JobSeekerModel from "../../src/app/models/schemas/jobSeeker";
import jobSeekerModel from "../../src/app/models/jobSeeker";

jest.mock("../../src/app/models/schemas/jobSeeker", () => ({
  create: jest.fn(() => "CREATED"),
  findOne: jest.fn(() => "FOUND"),
  updateOne: jest.fn(() => "UPDATED"),
  deleteOne: jest.fn(() => "DELETED"),
}));

const query = {};
const filter = {};
const data = {};

describe("Create job seeker func", () => {
  it("created job seeker func", async () => {
    const created = await jobSeekerModel.create(data);

    expect(created).toBe("CREATED");
    expect(JobSeekerModel.create).toHaveBeenCalledWith(data);
  });
});

describe("FindOne job seeker func", () => {
  it("found job seeker", async () => {
    const found = await jobSeekerModel.findOne(query);

    expect(found).toBe("FOUND");
    expect(JobSeekerModel.findOne).toHaveBeenCalledWith(query, {}, {});
  });
});

describe("UpdateOne job seeker func", () => {
  it("updated job seeker", async () => {
    const updated = await jobSeekerModel.updateOne(filter, data);

    expect(updated).toBe("UPDATED");
    expect(JobSeekerModel.updateOne).toHaveBeenCalledWith(filter, data);
  });
});

describe("DeletedOne job seeker func", () => {
  it("deleted job seeker", async () => {
    const deleted = await jobSeekerModel.deleteOne(filter);

    expect(deleted).toBe("DELETED");
    expect(JobSeekerModel.deleteOne).toHaveBeenCalledWith(filter, {});
  });
});
