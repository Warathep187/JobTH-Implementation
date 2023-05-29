import ErrorBox from "@/components/Error/ErrorBox";
import FavoriteJobsList from "@/components/Job/FavoriteJobsList";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  width: 50%;
  padding: 1.5rem 0rem 3rem;
  position: relative;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.lightgrey_4};
`;

const favorites = () => {
  const { loading, data, error } = useQuery(jobsGql.GET_FAVORITE_JOBS, {
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - งานที่ชื่นชอบ</title>
      </Head>
      <RootContainer>
        <Container>
          {loading && <Loading />}
          <Title>รายการงานที่คุณชื่นชอบ</Title>
          {data && <FavoriteJobsList jobs={data.getFavoriteJobs} />}
        </Container>
      </RootContainer>
    </>
  );
};

export default favorites;
