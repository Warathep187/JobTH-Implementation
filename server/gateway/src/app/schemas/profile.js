import profileControllers from "../controllers/profile";

const typeDefs = `#graphql
  enum Gender {
    MALE
    FEMALE
    NONE
  }

  type ProfileImage {
    url: String
    key: String
  }

  type Settings {
    canViewEducation: Boolean!
  }

  input SettingInput {
    canViewEducation: Boolean!
  }

  type Tag {
    _id: String!
    name: String!
  }

  enum EducationLevel {
    FIRST
    SECOND
    THIRD
    EMPTY
  }

  type Education {
    level: EducationLevel!
    year: Int!
    isStudying: Boolean
    academy: String!
    major: String!
  }

  type JobSeekerFullProfile {
    _id: String!
    firstName: String
    lastName: String
    birthday: String
    gender: Gender
    address: String
    profileImage: ProfileImage
    interestedTags: [Tag]
    interestedPositions: [String]
    educations: [Education]
    settings: Settings
    verifiedAt: DateTime
  }

  # Update profile
  input EducationInput {
    level: EducationLevel
    year: Int
    isStudying: Boolean!
    academy: String
    major: String
  }

  input UpdateBasicProfileInput {
    firstName: String!
    lastName: String!
    gender: Gender
    birthday: Date
    address: String
    interestedTags: [String]!
    interestedPositions: [String]!
  }

  input UploadFileInput {
    image: String!
  }

  type UploadedFilePayload {
    url: String!
  }

  type Contact {
    email: String
    tel: String
  }

  type CompanyProfile {
    _id: String!
    companyName: String
    image: ProfileImage
    contact: Contact
    information: String
    tags: [Tag]
  }

  input UpdateCompanyInput {
    companyName: String!
    information: String!
    tags: [String]!
    contact: ContactInput!
  } 

  type AppliedJobSeekerFullProfilePayload {
    _id: String!
    firstName: String!
    lastName: String!
    birthday: String
    gender: Gender
    address: String
    interestedTags: [Tag]!
    interestedPositions: [String]!
    educations: [Education]
    settings: Settings!
    profileImage: Image!
  }
`;

const queries = `#graphql
  getMyProfile: JobSeekerFullProfile!
  getCompany(id: String!): CompanyProfile!
  getApplicationOwnerProfile(id: String!): AppliedJobSeekerFullProfilePayload!
`;

const mutations = `#graphql
  updateBasicProfile(input: UpdateBasicProfileInput!): ResponseMessage!
  jobSeekerUpdateProfileImage(input: UploadFileInput!): UploadedFilePayload!
  updateEducationHistory(input: [EducationInput]!): ResponseMessage!
  updateSetting(input: SettingInput!): ResponseMessage!
  companyUpdateProfile(input: UpdateCompanyInput!): ResponseMessage!
  companyUpdateProfileImage(input: UploadFileInput!): UploadedFilePayload!
`;

const resolvers = {
  Query: {
    getMyProfile: (_, args, ctx) => profileControllers.getMyProfile(ctx),
    getCompany: (_, args) => profileControllers.getCompany(args),
    getApplicationOwnerProfile: (_, args, ctx) => profileControllers.getApplicationOwnerProfile(args, ctx)
  },
  Mutation: {
    updateBasicProfile: (_, args, ctx) => profileControllers.updateBasicProfile(args, ctx),
    jobSeekerUpdateProfileImage: (_, args, ctx) => profileControllers.jobSeekerUpdateProfileImage(args, ctx),
    updateEducationHistory: (_, args, ctx) => profileControllers.updateEducationHistory(args, ctx),
    updateSetting: (_, args, ctx) => profileControllers.updateSetting(args, ctx),
    companyUpdateProfile: (_, args, ctx) => profileControllers.companyUpdateProfile(args, ctx),
    companyUpdateProfileImage: (_, args, ctx) => profileControllers.companyUpdateProfileImage(args, ctx),
  },
  JobSeekerFullProfile: {
    interestedTags: (parent) => profileControllers.getInterestedTag(parent),
  },
};

export { typeDefs, queries, mutations, resolvers };
