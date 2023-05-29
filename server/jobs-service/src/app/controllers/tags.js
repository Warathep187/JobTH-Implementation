import tagModel from "../models/tag"

const getAllTags = async (req, res) => {
  try {
    const tags = await tagModel.findMany({}, {}, {}, { name: 1 });
    res.send(tags);
  }catch(e) {
    res.status(500).send({
      msg: "Something went wrong"
    })
  }
};

const getPopularTags = async (req, res) => {
  try {
    const tags = await tagModel.aggregatedByJobsAmount();
    res.send(tags)
  }catch(e) {
    res.status(500).send({
      msg: "Something went wrong"
    })
  }
}

export default {
  getAllTags,
  getPopularTags
};
