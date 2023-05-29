import applicationsControllers from "../controllers/applications";

const typeDefs = `#graphql 
  type JobInformationInApplication {
    _id: String!
    position: String!
    salary: Salary!
    location: Location!
    company: CompanyInformationInApplication!
    createdAt: String!
  }

  enum ApplicationStatus {
    WAITING
    RECEIVED
  }

  type FullApplicationInformationPayload {
    _id: String!
    job: JobInformationInApplication!
    jobSeekerId: String!
    status: ApplicationStatus!
    createdAt: String!
    resume: Image!
    contact: Contact!
  }

  type CompanyInformationInApplication {
    _id: String!
    companyName: String!
    image: Image!
  }

  type JobInformationInApplicationWithCompanyDetails {
    _id: String!
    position: String!
    salary: Salary!
    location: Location!
    company: CompanyInformationInApplication!
    createdAt: String!
  }

  type JobSeekerApplicationItem {
    _id: String!
    jobSeeker: String!
    job: JobInformationInApplicationWithCompanyDetails!
    status: ApplicationStatus!
    createdAt: String!
  }

  type CompanyApplicationItem {
    _id: String!
    job: JobInformationInApplication!
    status: ApplicationStatus!
    createdAt: String!
  }

  input CreateApplicationInput {
    resume: String!
    jobId: String!
    contact: ContactInput!
  }
`;

const queries = `#graphql
  getMyApplications: [JobSeekerApplicationItem]!
  getCompanyApplications: [CompanyApplicationItem]!
  getFullApplicationInformation(id: String!): FullApplicationInformationPayload!
`;

const mutations = `#graphql
  createNewApplication(input: CreateApplicationInput!): ResponseMessage!
  updateApplicationStatus(id: String!): ResponseMessage!
`;

const resolvers = {
  Query: {
    getMyApplications: (_, _args, ctx) => applicationsControllers.getMyApplications(ctx),
    getCompanyApplications: (_, _args, ctx) => applicationsControllers.getCompanyApplications(ctx),
    getFullApplicationInformation: (_, args, ctx) => applicationsControllers.getFullApplicationInformation(args, ctx),
  },
  Mutation: {
    createNewApplication: (_, args, ctx) => applicationsControllers.createNewApplication(args, ctx),
    updateApplicationStatus: (_, args, ctx) => applicationsControllers.updateApplicationStatus(args, ctx),
  },
};

export { typeDefs, queries, mutations, resolvers };
