import JobSeekerModel from "./schemas/jobSeeker";

const create = (data) => JobSeekerModel.create(data);

const findOne = (query, fields={}, options={}) => JobSeekerModel.findOne(query, fields, options)

const updateOne = (filter, data) => JobSeekerModel.updateOne(filter, data);

export default {
  create,
  findOne,
  updateOne,
}