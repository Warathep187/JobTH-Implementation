import jobsSearchingControllers from "../controllers/jobsSearching";

const typeDefs = `#graphql
  type JobSearchingCompanyProfile {
    _id: String!
    companyName: String!
    image: Image!
  }

  type JobSourcePayload {
    position: String!
    salary: Salary!
    location: Location!
    company: JobSearchingCompanyProfile!
    tags: [String]!
    createdAt: String!
  }

  type JobSearchResult {
    _index: String!
    _id: String!
    _score: Float!
    _source: JobSourcePayload!
  }

  input SearchSalaryInput {
    min: Int
    max: Int
  }

  input SearchLocationInput {
    district: String
    province: String
  }

  input SearchInput {
    keyword: String
    tags: [String]!
    salary: SearchSalaryInput!
    location: SearchLocationInput!
  }
`;

const queries = `#graphql
  search(input: SearchInput): [JobSearchResult]!
`;

const resolvers = {
  Query: {
    search: (_, args) => jobsSearchingControllers.search(args),
  },
};

export { typeDefs, queries, resolvers };
