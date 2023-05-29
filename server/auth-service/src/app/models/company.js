import CompanyModel from "./schemas/company";

const create = (data) => CompanyModel.create(data);

const findOne = (query, fields = {}, options = {}) => CompanyModel.findOne(query, fields, options);

const updateOne = (filter, data) => CompanyModel.updateOne(filter, data);

const deleteMany = (filter, options = {}) => CompanyModel.deleteMany(filter, options);

export default {
  create,
  findOne,
  updateOne,
  deleteMany
};
