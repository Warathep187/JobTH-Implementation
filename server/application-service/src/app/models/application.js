import ApplicationModel from "./schemas/application";

const create = (data) => ApplicationModel.create(data);

const findOne = (query, fields = {}, options = {}) => ApplicationModel.findOne(query, fields, options);

const findMany = (query, fields = {}, options = {}) =>
  ApplicationModel.find(query, fields, options).sort({ createdAt: -1 });

const updateOne = (filter, data, options = {}) => ApplicationModel.updateOne(filter, data, options);

const deleteMany = (filter, options) => ApplicationModel.deleteMany(filter, options);

export default {
  create,
  findOne,
  findMany,
  updateOne,
  deleteMany
};
