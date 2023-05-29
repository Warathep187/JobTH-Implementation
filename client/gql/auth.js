import { gql } from "@apollo/client";

const JOB_SEEKER_REGISTER = gql`
  mutation JobSeekerRegister($input: JobSeekerRegisterInput!) {
    jobSeekerRegister(input: $input) {
      msg
    }
  }
`;

const COMPANY_REGISTER = gql`
  mutation CompanyRegister($input: CompanyRegisterInput!) {
    companyRegister(input: $input) {
      msg
    }
  }
`;

const JOB_SEEKER_LOGIN = gql`
  mutation JobSeekerLogin($input: LoginInput!) {
    jobSeekerLogin(input: $input) {
      id
      role
      token
    }
  }
`;

const COMPANY_LOGIN = gql`
  mutation CompanyLogin($input: LoginInput!) {
    companyLogin(input: $input) {
      id
      token
      role
    }
  }
`;

const JOB_SEEKER_VERIFY_ACCOUNT = gql`
  mutation JobSeekerVerifyAccount($input: VerifyAccountInput!) {
    jobSeekerVerifyAccount(input: $input) {
      msg
    }
  }
`;

const COMPANY_VERIFY_ACCOUNT = gql`
  mutation CompanyVerifyAccount($input: VerifyAccountInput!) {
    companyVerifyAccount(input: $input) {
      msg
    }
  }
`;

const JOB_SEEKER_SEND_EMAIL = gql`
  mutation JobSeekerSendEmailForResetPassword($input: ResetPasswordEmailSendingInput!) {
    jobSeekerSendEmailForResetPassword(input: $input) {
      msg
    }
  }
`;

const COMPANY_SEND_EMAIL = gql`
  mutation CompanySendEmailForResetPassword($input: ResetPasswordEmailSendingInput!) {
    companySendEmailForResetPassword(input: $input) {
      msg
    }
  }
`;

const JOB_SEEKER_RESET_PASSWORD = gql`
  mutation JobSeekerResetPassword($input: ResetPasswordInput!) {
    jobSeekerResetPassword(input: $input) {
      msg
    }
  }
`;

const COMPANY_RESET_PASSWORD = gql`
  mutation CompanyResetPassword($input: ResetPasswordInput!) {
    companyResetPassword(input: $input) {
      msg
    }
  }
`;

const JOB_SEEKER_CHANGE_PASSWORD = gql`
  mutation JobSeekerChangePassword($input: ChangePasswordInput!) {
    jobSeekerChangePassword(input: $input) {
      msg
    }
  }
`;

const COMPANY_CHANGE_PASSWORD = gql`
  mutation CompanyChangePassword($input: ChangePasswordInput!) {
    companyChangePassword(input: $input) {
      msg
    }
  }
`;

const GET_AUTHENTICATED_INFO = gql`
  query Query {
    getAuthenticationInfo {
      id
      role
    }
  }
`;

export default {
  JOB_SEEKER_REGISTER,
  COMPANY_REGISTER,
  JOB_SEEKER_LOGIN,
  COMPANY_LOGIN,
  JOB_SEEKER_VERIFY_ACCOUNT,
  COMPANY_VERIFY_ACCOUNT,
  JOB_SEEKER_SEND_EMAIL,
  COMPANY_SEND_EMAIL,
  JOB_SEEKER_RESET_PASSWORD,
  COMPANY_RESET_PASSWORD,
  JOB_SEEKER_CHANGE_PASSWORD,
  COMPANY_CHANGE_PASSWORD,
  GET_AUTHENTICATED_INFO
};
