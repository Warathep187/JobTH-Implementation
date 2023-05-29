import { Client } from "@elastic/elasticsearch";
import { ELASTICSEARCH_URL } from "../config";
import { jobMapping, jobSettings } from "./schemas/job";

const esClient = new Client({
  node: ELASTICSEARCH_URL,
});

const checkESClusterHealth = async () => {
  try {
    const health = await esClient.cluster.health();
    await createIndex();
    console.log(`Elasticsearch health status is ${health.status}🥳`);
  } catch (e) {
    throw new Error(e);
  }
};

const createIndex = async () => {
  try {
    // await esClient.indices.delete({index: "jobs"})
    const indexExists = await isIndexExists("jobs");
    if (!indexExists) {
      await esClient.indices.create({
        index: "jobs",
        body: {
          mappings: jobMapping,
          settings: jobSettings,
        },
      });
    }
  } catch (e) {
    throw new Error(e);
  }
};

const isIndexExists = async (index) => {
  return esClient.indices.exists({ index });
};

const create = (id, data) => esClient.create({ index: "jobs", id, document: data });

const search = (query, from = 0, size = 15) => esClient.search({ index: "jobs", query, size, from });

const findById = (id) => esClient.get({ index: "jobs", id });

const update = (id, data) => esClient.update({ index: "jobs", id, doc: data });

// const updateCompanyNameByQuery = (companyId, data) =>
//   esClient.updateByQuery({
//     index: "jobs",
//     query: {
//       match: {
//         "company._id": companyId,
//       },
//     },
//     script: {
//       lang: "painless",
//       source: `ctx._source.company.companyName = "${data.company.companyName}"`,
//     },
//   });

// const updateCompanyProfileImageByQuery = (companyId, data) =>
//   esClient.updateByQuery({
//     index: "jobs",
//     query: {
//       match: {
//         "company._id": companyId,
//       },
//     },
//     script: {
//       lang: "painless",
//       source: `ctx._source.company.image.url = "${data.company.image.url}"`,
//     },
//   });

const deleteOne = (id) => esClient.delete({ index: "jobs", id });

const count = () => esClient.count({ index: "jobs" });

export default {
  esClient,
  checkESClusterHealth,
  create,
  search,
  findById,
  update,
  deleteOne,
  count,
};
