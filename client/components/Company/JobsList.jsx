import React from "react";
import styled from "styled-components";
import JobItem from "./JobItem";

const Container = styled.div``;

const JobsList = ({ jobs }) => {
  return (
    <Container>
      {jobs.map((job, index) => (
        <JobItem key={job._id} job={job} index={index} />
      ))}
    </Container>
  );
};

export default JobsList;
