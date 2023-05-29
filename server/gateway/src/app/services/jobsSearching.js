import { JOBS_SEARCHING_SERVICE_URL, PROFILE_SERVICE_URL } from "../config";
import CustomGraphQLError from "../libs/graphqlError";
import requests from "../libs/requests";

const search = async (data) => {
  try {
    const { data: results } = await requests.get(`${JOBS_SEARCHING_SERVICE_URL}/`, {
      keyword: data.keyword,
      tags: data.tags.join(","),
      salaryMin: data.salary.min,
      salaryMax: data.salary.max,
      district: data.location.district,
      province: data.location.province,
    });
    if (results.length > 0) {
      const companyIds = results.map((result) => result._source.companyId);
      const { data: companyData } = await requests.get(`${PROFILE_SERVICE_URL}/companies?ids=${companyIds}`);
      const formattedSearchedResults = results.map((result) => {
        const formattedSource = {
          ...result._source,
          company: companyData.companies.find((company) => company._id === result._source.companyId),
        };
        return {
          ...result,
          _source: formattedSource,
        };
      });
      return formattedSearchedResults;
    } else {
      return [];
    }
    return response.data;
  } catch (e) {
    throw new CustomGraphQLError(e);
  }
};

export default {
  search,
};
