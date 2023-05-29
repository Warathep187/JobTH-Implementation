import JobSeekerModel from "./schemas/jobSeeker";

const create = (data) => JobSeekerModel.create(data);

const findOne = (query, fields={}, options={}) => JobSeekerModel.findOne(query, fields, options)

const findOneAndPopulateTags = (query, fields = {}, options = {}) =>
  JobSeekerModel.findOne(query, fields, options).populate("interestedTags");

const updateOne = (query, data) => JobSeekerModel.updateOne(query, data);

export default {
  create,
  findOne,
  findOneAndPopulateTags,
  updateOne,
}