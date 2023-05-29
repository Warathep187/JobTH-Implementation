import { gql } from "@apollo/client";

const GET_MY_APPLICATIONS = gql`
  query GetMyApplications {
    getMyApplications {
      _id
      createdAt
      job {
        _id
        company {
          image {
            url
          }
          companyName
          _id
        }
        createdAt
        location {
          district
          province
        }
        position
        salary {
          max
          min
        }
      }
      status
    }
  }
`;

const GET_COMPANY_APPLICATIONS = gql`
  query GetCompanyApplications {
    getCompanyApplications {
      _id
      createdAt
      job {
        _id
        position
      }
      status
    }
  }
`;

const GET_FULL_APPLICATION_INFORMATION = gql`
  query GetFullApplicationInformation($getFullApplicationInformationId: String!) {
    getFullApplicationInformation(id: $getFullApplicationInformationId) {
      _id
      contact {
        email
        tel
      }
      createdAt
      job {
        _id
        company {
          _id
          companyName
          image {
            url
          }
        }
        createdAt
        location {
          province
          district
        }
        position
        salary {
          max
          min
        }
      }
      resume {
        url
      }
      jobSeekerId
      status
    }
  }
`;

const CREATE_NEW_APPLICATION = gql`
  mutation CreateNewApplication($input: CreateApplicationInput!) {
    createNewApplication(input: $input) {
      msg
    }
  }
`;

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($updateApplicationStatusId: String!) {
    updateApplicationStatus(id: $updateApplicationStatusId) {
      msg
    }
  }
`;

export default {
  GET_MY_APPLICATIONS,
  GET_COMPANY_APPLICATIONS,
  GET_FULL_APPLICATION_INFORMATION,
  CREATE_NEW_APPLICATION,
  UPDATE_APPLICATION_STATUS,
};
