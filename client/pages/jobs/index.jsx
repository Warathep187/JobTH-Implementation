import ErrorBox from "@/components/Error/ErrorBox";
import JobsList from "@/components/Job/JobsList";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Tooltip } from "antd";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  width: 60%;
  overflow: visible;
  margin: 0 auto;
  padding: 1.5rem 0 3rem;
  position: relative;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-bottom: 1px solid ${colors.lightgrey_4};
  padding-bottom: 0.2rem;
`;

const AddButton = styled(Link)`
  text-decoration: none;
  color: ${colors.black_0};
  padding: 0.3rem;
  border-radius: 50%;
  border: 1px solid ${colors.lightgrey_4};
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0.1rem 0.1rem 0.3rem ${colors.lightgrey_4};
  }
`;

const PlusIcon = styled(PlusOutlined)`
  font-size: 2rem;
  color: ${colors.black_1};
`;

const Title = styled.span`
  font-size: 1.6rem;
  font-weight: 400;
`;

const TooltipText = styled(Tooltip)`
  font-size: 0.8rem;
  font-weight: 200;
`;

const index = () => {
  const { id } = useSelector((state) => state.loggedInInfo);
  const { loading, data, error } = useQuery(jobsGql.GET_COMPANY_JOBS, {
    variables: {
      getCompanyJobsId: id,
    },
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - งานที่รับสมัคร</title>
      </Head>
      <RootContainer>
        <Container>
          <TitleContainer>
            <Title>งานที่รับสมัครของบริษัทคุณ</Title>
            <Tooltip placement="top" title={<TooltipText>เพิ่มการรับสมัครงาน</TooltipText>}>
              <AddButton href="/jobs/create">
                <PlusIcon />
              </AddButton>
            </Tooltip>
          </TitleContainer>
          {loading && <Loading />}
          {data && <JobsList jobs={data.getCompanyJobs} />}
        </Container>
      </RootContainer>
    </>
  );
};

export default index;
