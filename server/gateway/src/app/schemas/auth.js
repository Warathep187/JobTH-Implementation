import authController from "../controllers/auth"

const typeDefs = `#graphql
  enum Role {
    JOB_SEEKER
    COMPANY
  }

  type AuthenticatedInfoPayload {
    id: String!
    role: String!
  }

  # Register
  input JobSeekerRegisterInput {
    email: String!
    password: String!
  }

  input ContactInput {
    email: String!
    tel: String!
  }

  input CompanyRegisterInput {
    email: String!
    password: String!
    companyName: String!
    contact: ContactInput!
  }

  # Login
  input LoginInput {
    email: String!
    password: String!
  }

  type LoggedInResponsePayload {
    token: String!
    role: Role!
    id: String!
  }

  # Verify
  input VerifyAccountInput {
    token: String!
  }

  # Reset password
  input ResetPasswordEmailSendingInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  # Change password
  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
  }
`

const queries = `#graphql
  getAuthenticationInfo: AuthenticatedInfoPayload!
`

const mutation = `#graphql
  jobSeekerRegister(input: JobSeekerRegisterInput!): ResponseMessage!
  companyRegister(input: CompanyRegisterInput!): ResponseMessage!

  jobSeekerLogin(input: LoginInput!): LoggedInResponsePayload!
  companyLogin(input: LoginInput!): LoggedInResponsePayload!

  jobSeekerVerifyAccount(input: VerifyAccountInput!): ResponseMessage!
  companyVerifyAccount(input: VerifyAccountInput!): ResponseMessage!

  jobSeekerSendEmailForResetPassword(input: ResetPasswordEmailSendingInput!): ResponseMessage!
  companySendEmailForResetPassword(input: ResetPasswordEmailSendingInput!): ResponseMessage!

  jobSeekerResetPassword(input: ResetPasswordInput!): ResponseMessage!
  companyResetPassword(input: ResetPasswordInput!): ResponseMessage!

  jobSeekerChangePassword(input: ChangePasswordInput!): ResponseMessage!
  companyChangePassword(input: ChangePasswordInput!): ResponseMessage!
`

const resolvers = {
  Query: {
    getAuthenticationInfo: (_, args, ctx) => authController.getAuthenticationInfo(ctx)
  },
  Mutation: {
    jobSeekerRegister: (_, args, ctx) => authController.jobSeekerRegister(args, ctx),
    companyRegister: (_, args, ctx) => authController.companyRegister(args, ctx),
    jobSeekerLogin: (_, args) => authController.jobSeekerLogin(args),
    companyLogin: (_, args) => authController.companyLogin(args),
    jobSeekerVerifyAccount: (_, args) => authController.jobSeekerVerifyAccount(args),
    companyVerifyAccount: (_, args) => authController.companyVerifyAccount(args),
    jobSeekerSendEmailForResetPassword: (_, args, ctx) => authController.jobSeekerSendEmailForResetPassword(args, ctx),
    companySendEmailForResetPassword: (_, args, ctx) => authController.companySendEmailForResetPassword(args, ctx),
    jobSeekerResetPassword: (_, args) => authController.jobSeekerResetPassword(args),
    companyResetPassword: (_, args) => authController.companyResetPassword(args),
    jobSeekerChangePassword: (_, args, ctx) => authController.jobSeekerChangePassword(args, ctx),
    companyChangePassword: (_, args, ctx) => authController.companyChangePassword(args, ctx)
  }
}

export {
  typeDefs,
  queries,
  mutation,
  resolvers
}