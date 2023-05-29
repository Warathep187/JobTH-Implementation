import ApplicationList from "@/components/Application/ApplicationList";
import ErrorBox from "@/components/Error/ErrorBox";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import applicationsGql from "@/gql/applications";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  width: 50%;
  margin: 0 auto;
  padding: 1.9rem 0 3rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 400;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid ${colors.lightgrey_4};
`;

const ApplicationsInboxPage = () => {
  const { loading, data, error } = useQuery(applicationsGql.GET_COMPANY_APPLICATIONS, {
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - Inbox</title>
      </Head>
      <RootContainer>
        <Container>
          <Title>การสมัคร</Title>
          {loading && <Loading />}
          {data && <ApplicationList applications={data.getCompanyApplications} />}
        </Container>
      </RootContainer>
    </>
  );
};

export default ApplicationsInboxPage;
