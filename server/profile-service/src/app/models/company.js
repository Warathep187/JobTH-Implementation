import CompanySeekerModel from "./schemas/company";

const create = (data) => CompanySeekerModel.create(data);

const findOne = (query, fields = {}, options = {}) => CompanySeekerModel.findOne(query, fields, options);

const findMany = (query, fields = {}, options = {}) => CompanySeekerModel.find(query, fields, options);

const findOneAndPopulateTags = (query, fields = {}, options = {}) =>
  CompanySeekerModel.findOne(query, fields, options).populate("tags", "_id name");

const updateOne = (filter, data) => CompanySeekerModel.updateOne(filter, data);

export default {
  create,
  findOne,
  findMany,
  findOneAndPopulateTags,
  updateOne,
};
