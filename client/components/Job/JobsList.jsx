import React, { useState } from "react";
import styled from "styled-components";
import JobItem from "./JobItem";
import { useMutation } from "@apollo/client";
import jobsGql from "../../gql/jobs";
import { toast } from "react-toastify";

const Container = styled.div`
  margin-top: 0.6rem;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const JobsList = ({ jobs }) => {
  const [deleteJob] = useMutation(jobsGql.DELETE_JOB);

  const [jobsLst, setJobsList] = useState(jobs);

  const deleteJobHandler = (jobId) => {
    deleteJob({
      variables: {
        deleteJobId: jobId,
      },
      onCompleted: (res) => {
        toast(res.deleteJob.msg);
        const filtered = jobsLst.filter((job) => job._id !== jobId);
        setJobsList(filtered);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Container>
      {jobsLst.map((job) => (
        <JobItem key={job._id} job={job} onDeleteJobHandler={deleteJobHandler} />
      ))}
    </Container>
  );
};

export default JobsList;
