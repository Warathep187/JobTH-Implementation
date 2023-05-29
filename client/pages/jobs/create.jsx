import CreateJobForm from "@/components/Job/CreateJobForm";
import colors from "@/constant/colors";
import Head from "next/head";
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

const FormContainer = styled.div``;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  border-bottom: 1px solid ${colors.lightgrey_4};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const CreateJobPage = () => {
  return (
    <>
      <Head>
        <title>JobTH - เพิ่มงาน</title>
      </Head>
      <RootContainer>
        <Container>
          <FormContainer>
            <Title>สร้างการรับสมัครงาน</Title>
            <CreateJobForm />
          </FormContainer>
        </Container>
      </RootContainer>
    </>
  );
};

export default CreateJobPage;
[];
