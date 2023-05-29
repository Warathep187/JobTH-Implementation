import jobsSearchingServices from "../services/jobsSearching";

const search = async (args) => jobsSearchingServices.search(args.input);

export default {
  search,
};
