import JobModel from "./schemas/job";

const create = (data) => JobModel.create(data);

const findOne = (query, fields = {}, options = {}) => JobModel.findOne(query, fields, options);

const findOneAndPopulateTags = (query, fields = {}, options = {}) =>
  JobModel.findOne(query, fields, options).populate("tags");

const findMany = (query, fields = {}, options = {}, sort = {}) => JobModel.find(query, fields, options).sort(sort);

const aggregatedByCountCompanyId = () =>
  JobModel.aggregate([{ $project: { _id: 1, companyId: 1 } }, { $group: { _id: "$companyId", count: { $count: {} } } }])
    .sort({ count: -1 })
    .limit(5);

const updateOne = (filter, data, options = {}) => JobModel.updateOne(filter, data, options);

const deleteOne = (filter, options = {}) => JobModel.deleteOne(filter, options);

const count = (filter = {}) => JobModel.count(filter);

export default {
  create,
  findOne,
  findOneAndPopulateTags,
  findMany,
  aggregatedByCountCompanyId,
  updateOne,
  deleteOne,
  count,
};
