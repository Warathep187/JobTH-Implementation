import jobsControllers from "../controllers/jobs";

const typeDefs = `#graphql
  type Salary {
    min: Int!
    max: Int!
  }

  type Location {
    district: String!
    province: String!
  }

  type Image {
    url: String
  }

  type JobCompanyInformation {
    _id: String
    companyName: String
    image: Image
  }

  type FavoriteItem {
    jobSeekerId: String!
  }

  type JobFullInformation {
    _id: String!
    position: String!
    details: [String]
    qualifications: [String]
    benefits: [String]
    salary: Salary
    location: Location
    company: JobCompanyInformation
    tags: [Tag]
    favorites: [FavoriteItem]
    createdAt: String
  }

  type CompanyJobItem {
    _id: String!
    position: String!
    salary: Salary
    location: Location
    company: JobFullInformation
    createdAt: String
  }

  type CompanyInformationInJobService {
    _id: String!
    companyName: String!
    image: Image!
  }

  type FavoriteJobJobInfo {
    _id: String!
    position: String!
    salary: Salary!
    location: Location!
    company: CompanyInformationInJobService!
    createdAt: String!
  }

  type FavoriteJob {
    _id: String!
    jobSeekerId: String!
    jobId: FavoriteJobJobInfo!
  }

  input SalaryInput {
    min: Int!
    max: Int!
  }

  input LocationInput {
    district: String!
    province: String!
  }

  input CreateJobInput {
    position: String!
    details: [String]!
    qualifications: [String]!
    benefits: [String]!
    salary: SalaryInput!
    location: LocationInput!
    tags: [String]!
  }

  input UpdateJobInput {
    _id: String!
    position: String!
    details: [String]!
    qualifications: [String]!
    benefits: [String]!
    salary: SalaryInput!
    location: LocationInput!
    tags: [String]!
  }

  type JobsAmountPayload {
    amount: Int!
  }

  type PopularTag {
    _id: String!
    name: String!
    count: Int!
  }

  type TopCompanyPayload {
    _id: String!
    companyName: String!
    image: Image!
    count: Int!
  }
`;

const queries = `#graphql
  getCompanyJobs(id: String!): [CompanyJobItem]!
  getJob(id: String!): JobFullInformation!
  getTags: [Tag]!
  getFavoriteJobs: [FavoriteJob]!
  getJobsAmount: JobsAmountPayload!
  getPopularTags: [PopularTag]!
  getTopCompanies: [TopCompanyPayload]!
`;

const mutations = `#graphql
  createNewJob(input: CreateJobInput!): ResponseMessage!
  updateJob(input: UpdateJobInput!): ResponseMessage!
  deleteJob(id: String!): ResponseMessage!
  likeJob(id: String!): ResponseMessage!
  unlikeJob(id: String!): ResponseMessage!
`;

const resolvers = {
  Query: {
    getCompanyJobs: (_, args) => jobsControllers.getCompanyJobs(args),
    getJob: (_, args) => jobsControllers.getJob(args),
    getTags: () => jobsControllers.getTags(),
    getFavoriteJobs: (_, _args, ctx) => jobsControllers.getFavoriteJobs(ctx),
    getJobsAmount: () => jobsControllers.getJobsAmount(),
    getPopularTags: (_, _args, ctx) => jobsControllers.getPopularTags(ctx),
    getTopCompanies: (_, _args, ctx) => jobsControllers.getTopCompanies(ctx),
  },
  Mutation: {
    createNewJob: (_, args, ctx) => jobsControllers.createNewJob(args, ctx),
    updateJob: (_, args, ctx) => jobsControllers.updateJob(args, ctx),
    deleteJob: (_, args, ctx) => jobsControllers.deleteJob(args, ctx),
    likeJob: (_, args, ctx) => jobsControllers.likeJob(args, ctx),
    unlikeJob: (_, args, ctx) => jobsControllers.unlikeJob(args, ctx),
  },
  JobFullInformation: {
    favorites: (parent) => jobsControllers.getJobFavorites(parent),
  },
};

export { typeDefs, queries, mutations, resolvers };
