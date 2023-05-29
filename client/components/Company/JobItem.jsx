import colors from "@/constant/colors";
import { DollarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1.5rem;
  cursor: pointer;
  background-color: ${colors.white};
  border-bottom: 3px solid ${colors.lightgrey_3};

  &:hover {
    background-color: ${colors.lightgrey_3};
  }
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MiddleContainer = styled.div`
  margin: 0.8rem 0 2rem 0;
`;

const PositionTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 400;
`;

const BottomContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

const BottomInformationPair = styled.div`
  display: flex;
  align-items: center;
  width: 35%;
`;

const Span = styled.span`
  font-size: 1rem;
  font-weight: 200;
`

const JobItem = ({ job, index }) => {
  const router = useRouter()

  const redirectHandler = () => {
    router.push(`/jobs/${job._id}`)
  }

  const displaySalary = (min, max) => {
    if (min === max) {
      return <Span>{min} THB</Span>;
    }

    return (
      <Span>
        {min} - {max} THB
      </Span>
    );
  };

  return (
    <Container onClick={redirectHandler}>
      <TopContainer>
        <Span>{index + 1}.</Span>
        <Span>{moment(job.createdAt).format("DD MMM YY")}</Span>
      </TopContainer>
      <MiddleContainer>
        <PositionTitle>{job.position}</PositionTitle>
      </MiddleContainer>
      <BottomContainer>
        <BottomInformationPair>
          <EnvironmentOutlined style={{fontSize: "20px", color: colors.orange, marginRight: "8px"}} />
          <Span>{job.location.district + ", " + job.location.province}</Span>
        </BottomInformationPair>
        <BottomInformationPair>
          <DollarOutlined style={{fontSize: "20px", color: colors.orange, marginRight: "8px"}} />
          <Span>{displaySalary(job.salary.min, job.salary.max)}</Span>
        </BottomInformationPair>
      </BottomContainer>
    </Container>
  );
};

export default JobItem;
