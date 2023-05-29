import FavoriteJob from "./schemas/favoriteJob";

const create = (data) => FavoriteJob.create(data);

const findOne = (query, fields, options) => FavoriteJob.findOne(query, fields, options);

const findMany = (query, fields = {}, options = {}) => FavoriteJob.find(query, fields, options);

const findManyAndPopulate = (query, fields = {}, options = {}, sort={}) =>
  FavoriteJob.find(query, fields, options).populate("jobId").sort(sort);

const deleteOne = (filter, options = {}) => FavoriteJob.deleteOne(filter, options);

const deleteMany = (filter, options = {}) => FavoriteJob.deleteMany(filter, options);

export default {
  create,
  findOne,
  findMany,
  findManyAndPopulate,
  deleteOne,
  deleteMany,
};
