import { gql } from "@apollo/client";

const GET_FULL_PROFILE = gql`
  query GetMyProfile {
    getMyProfile {
      _id
      address
      birthday
      educations {
        academy
        isStudying
        level
        major
        year
      }
      firstName
      gender
      interestedPositions
      lastName
      profileImage {
        url
      }
      interestedTags {
        _id
        name
      }
    }
  }
`;

const GET_BASIC_PROFILE = gql`
  query GetMyProfile {
    getMyProfile {
      _id
      address
      birthday
      firstName
      gender
      interestedPositions
      lastName
      profileImage {
        url
      }
      interestedTags {
        _id
        name
      }
    }
  }
`;

const UPDATE_BASIC_PROFILE = gql`
  mutation UpdateBasicProfile($input: UpdateBasicProfileInput!) {
    updateBasicProfile(input: $input) {
      msg
    }
  }
`;

const GET_EDUCATION_HISTORY = gql`
  query GetMyProfile {
    getMyProfile {
      _id
      educations {
        level
        year
        isStudying
        academy
        major
      }
    }
  }
`;

const UPDATE_EDUCATION_HISTORY = gql`
  mutation UpdateEducationHistory($input: [EducationInput]!) {
    updateEducationHistory(input: $input) {
      msg
    }
  }
`;

const GET_SETTINGS = gql`
  query GetMyProfile {
    getMyProfile {
      _id
      settings {
        canViewEducation
      }
    }
  }
`;

const UPDATE_SETTING = gql`
  mutation UpdateSetting($input: SettingInput!) {
    updateSetting(input: $input) {
      msg
    }
  }
`;

const JOB_SEEKER_UPDATE_PROFILE_IMAGE = gql`
  mutation JobSeekerUpdateProfileImage($input: UploadFileInput!) {
    jobSeekerUpdateProfileImage(input: $input) {
      url
    }
  }
`;

const COMPANY_UPDATE_PROFILE_IMAGE = gql`
  mutation CompanyUpdateProfileImage($input: UploadFileInput!) {
    companyUpdateProfileImage(input: $input) {
      url
    }
  }
`;

const GET_COMPANY_PROFILE = gql`
  query GetCompany($getCompanyId: String!) {
    getCompany(id: $getCompanyId) {
      companyName
      contact {
        email
        tel
      }
      image {
        url
      }
      information
      tags {
        _id
        name
      }
      _id
    }
  }
`;

const COMPANY_UPDATE_PROFILE = gql`
  mutation CompanyUpdateProfile($input: UpdateCompanyInput!) {
    companyUpdateProfile(input: $input) {
      msg
    }
  }
`;

const GET_APPLICATION_OWNER_PROFILE = gql`
  query GetApplicationOwnerProfile($getApplicationOwnerProfileId: String!) {
    getApplicationOwnerProfile(id: $getApplicationOwnerProfileId) {
      _id
      address
      birthday
      educations {
        academy
        isStudying
        level
        major
        year
      }
      firstName
      gender
      interestedPositions
      interestedTags {
        _id
        name
      }
      lastName
      profileImage {
        url
      }
      settings {
        canViewEducation
      }
    }
  }
`;

export default {
  GET_FULL_PROFILE,
  GET_BASIC_PROFILE,
  UPDATE_BASIC_PROFILE,
  GET_EDUCATION_HISTORY,
  UPDATE_EDUCATION_HISTORY,
  GET_SETTINGS,
  UPDATE_SETTING,
  JOB_SEEKER_UPDATE_PROFILE_IMAGE,
  COMPANY_UPDATE_PROFILE_IMAGE,
  GET_COMPANY_PROFILE,
  COMPANY_UPDATE_PROFILE,
  GET_APPLICATION_OWNER_PROFILE,
};
