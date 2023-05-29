import CompanyModel from "../../src/app/models/schemas/company";
import companyModel from "../../src/app/models/company";

jest.mock("../../src/app/models/schemas/company", () => ({
  create: jest.fn(() => "CREATED"),
  findOne: jest.fn(() => "FOUND"),
  updateOne: jest.fn(() => "UPDATED"),
  deleteOne: jest.fn(() => "DELETED"),
}));

const query = {};
const filter = {};
const data = {};

describe("Create company func", () => {
  it("created company func", async () => {
    const created = await companyModel.create(data);

    expect(created).toBe("CREATED");
    expect(CompanyModel.create).toHaveBeenCalledWith(data);
  });
});

describe("FindOne company func", () => {
  it("found company", async () => {
    const found = await companyModel.findOne(query);

    expect(found).toBe("FOUND");
    expect(CompanyModel.findOne).toHaveBeenCalledWith(query, {}, {});
  });
});

describe("UpdateOne company func", () => {
  it("updated company", async () => {
    const updated = await companyModel.updateOne(filter, data);

    expect(updated).toBe("UPDATED");
    expect(CompanyModel.updateOne).toHaveBeenCalledWith(filter, data);
  });
});

describe("DeletedOne company func", () => {
  it("deleted company", async () => {
    const deleted = await companyModel.deleteOne(filter);

    expect(deleted).toBe("DELETED");
    expect(CompanyModel.deleteOne).toHaveBeenCalledWith(filter, {});
  });
});
