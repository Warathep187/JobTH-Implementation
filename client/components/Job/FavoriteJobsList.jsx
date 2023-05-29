import React, { useState } from "react";
import FavoriteJobItem from "./FavoriteJobItem";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import jobsGql from "../../gql/jobs";
import { toast } from "react-toastify";
import { Empty } from "antd";

const Container = styled.div``;

const NotFoundContainer = styled.div`
  height: 25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FavoriteJobsList = ({ jobs }) => {
  const [removeJob] = useMutation(jobsGql.UNLIKE_JOB);
  const [jobsList, setJobsList] = useState(jobs);

  const removeFavoriteJobHandler = (jobId) => {
    removeJob({
      variables: {
        unlikeJobId: jobId,
      },
      onCompleted: (res) => {
        const filtered = jobsList.filter((job) => job.jobId._id !== jobId);
        setJobsList(filtered);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Container>
      {jobs.length === 0 && (
        <NotFoundContainer>
          <Empty description="ไม่พบงานในรายการที่คุณชอบ" />
        </NotFoundContainer>
      )}
      {jobsList.map((job) => (
        <FavoriteJobItem job={job} key={job._id} onRemoveFavoriteJobHandler={removeFavoriteJobHandler} />
      ))}
    </Container>
  );
};

export default FavoriteJobsList;
