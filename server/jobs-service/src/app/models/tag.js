import JobModel from "./schemas/job";
import TagModel from "./schemas/tag";

const findMany = (query, fields = {}, options = {}, sort = {}) => TagModel.find(query, fields, options).sort(sort);

const aggregatedByJobsAmount = () =>
  JobModel.aggregate([
    { $project: { _id: 1, tags: 1 } },
    { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tagObjects" } },
    { $unwind: "$tagObjects" },
    { $group: { _id: "$tagObjects._id", name: { $first: "$tagObjects.name" }, count: { $count: {} } } },
  ])
    .sort({ count: -1 })
    .limit(8);

export default {
  findMany,
  aggregatedByJobsAmount,
};
