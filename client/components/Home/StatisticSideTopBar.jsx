import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import Loading from "../Loading/Loading";

const TopBar = styled.div`
  background-image: url("/home-img.svg");
  background-repeat: no-repeat;
  background-position: right bottom -1px;
  background-size: 65%;
  border-bottom: 1px solid ${colors.orange};
  height: 5rem;
  margin-bottom: 2rem;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TopTitleText = styled.h1`
  font-size: 1.2rem;
  font-weight: 300;
`;

const TopTitleTextBolded = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${colors.orange};
`;

const BottomText = styled.p`
  font-size: 0.8rem;
  font-weight: 300;
  color: ${colors.orange};
`;

const StatisticSideTopBar = () => {
  const { loading, data, error } = useQuery(jobsGql.GET_JOBS_AMOUNT);

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopBar>
      {loading && <Loading />}
      {data && (
        <TopTitleText>
          งานทั้งหมด <TopTitleTextBolded>{data.getJobsAmount.amount}</TopTitleTextBolded> อัตรา
        </TopTitleText>
      )}
      <BottomText>อัปเดตงานใหม่ทุกวันกว่า 200 อาชีพ</BottomText>
    </TopBar>
  );
};

export default StatisticSideTopBar;
