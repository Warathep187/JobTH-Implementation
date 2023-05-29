import ErrorBox from "@/components/Error/ErrorBox";
import EditJobForm from "@/components/Job/EditJobForm";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  width: 40%;
  margin: 0 auto;
  background-color: ${colors.white};
  padding: 3rem 4rem 4rem 5rem;
  position: relative;
`;

const FormContainer = styled.div`
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  border-bottom: 1px solid ${colors.lightgrey_4};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const EditJobPage = () => {
  const { jobId } = useRouter().query;
  const { loading, data, error } = useQuery(jobsGql.GET_JOB, {
    variables: {
      getJobId: jobId,
    },
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - แก้ไขงาน</title>
      </Head>
      <RootContainer>
        <Container>
          <FormContainer>
            <Title>แก้ไขการรับสมัครงาน</Title>
            {loading && <Loading />}
            {data && <EditJobForm job={data.getJob} />}
          </FormContainer>
        </Container>
      </RootContainer>
    </>
  );
};

export default EditJobPage;
[];
