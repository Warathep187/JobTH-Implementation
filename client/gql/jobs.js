import { gql } from "@apollo/client";

const GET_TAGS = gql`
  query Query {
    getTags {
      _id
      name
    }
  }
`;

const GET_COMPANY_JOBS = gql`
  query GetCompanyJobs($getCompanyJobsId: String!) {
    getCompanyJobs(id: $getCompanyJobsId) {
      _id
      createdAt
      position
      location {
        district
        province
      }
      salary {
        max
        min
      }
    }
  }
`;

const GET_JOB = gql`
  query GetJob($getJobId: String!) {
    getJob(id: $getJobId) {
      _id
      benefits
      company {
        _id
        companyName
        image {
          url
        }
      }
      createdAt
      details
      favorites {
        jobSeekerId
      }
      location {
        province
        district
      }
      position
      qualifications
      salary {
        max
        min
      }
      tags {
        _id
        name
      }
    }
  }
`;

const CREATE_JOB = gql`
  mutation CreateNewJob($input: CreateJobInput!) {
    createNewJob(input: $input) {
      msg
    }
  }
`;

const UPDATE_JOB = gql`
  mutation UpdateJob($input: UpdateJobInput!) {
    updateJob(input: $input) {
      msg
    }
  }
`;

const DELETE_JOB = gql`
  mutation DeleteJob($deleteJobId: String!) {
    deleteJob(id: $deleteJobId) {
      msg
    }
  }
`;

const LIKE_JOB = gql`
  mutation LikeJob($likeJobId: String!) {
    likeJob(id: $likeJobId) {
      msg
    }
  }
`;

const UNLIKE_JOB = gql`
  mutation UnlikeJob($unlikeJobId: String!) {
    unlikeJob(id: $unlikeJobId) {
      msg
    }
  }
`;

const GET_FAVORITE_JOBS = gql`
  query Query {
    getFavoriteJobs {
      _id
      jobId {
        company {
          _id
          companyName
          image {
            url
          }
        }
        _id
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
      jobSeekerId
    }
  }
`;

const GET_JOBS_AMOUNT = gql`
  query GetJobsAmount {
    getJobsAmount {
      amount
    }
  }
`;

const GET_POPULAR_TAGS = gql`
  query GetPopularTags {
    getPopularTags {
      _id
      count
      name
    }
  }
`;

const GET_TOP_COMPANIES = gql`
  query GetTopCompanies {
    getTopCompanies {
      _id
      companyName
      image {
        url
      }
      count
    }
  }
`;

export default {
  GET_TAGS,
  GET_COMPANY_JOBS,
  GET_JOB,
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  LIKE_JOB,
  UNLIKE_JOB,
  GET_FAVORITE_JOBS,
  GET_JOBS_AMOUNT,
  GET_POPULAR_TAGS,
  GET_TOP_COMPANIES,
};
