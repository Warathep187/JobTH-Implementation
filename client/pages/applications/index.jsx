import ErrorBox from "@/components/Error/ErrorBox";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import applicationsGql from "@/gql/applications";
import { DollarCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Empty } from "antd";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  width: 50%;
  margin: 0 auto;
  padding: 1.5rem 0 3rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.lightgrey_4};
`;

const ApplicationsList = styled.div`
  position: relative;
`;

const ApplicationItemBox = styled.div`
  padding: 0.5rem 0.8rem 0.8rem;
  border-bottom: 1px solid ${colors.orange};
  display: flex;
  align-items: end;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: ${colors.lightgrey_3};
  }
`;

const LeftContainer = styled.div`
  width: 70%;
`;

const JobTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
`;

const CompanyNameTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 1rem;
`;

const InformationContainer = styled.div``;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;

  &:first-child {
    margin-bottom: 0.3rem;
  }
`;

const InformationText = styled.span`
  font-size: 1rem;
  font-weight: 300;
  margin-left: 8px;
`;

const SalaryIcon = styled(DollarCircleOutlined)`
  font-size: 1.4rem;
  color: ${colors.orange};
`;

const LocationIcon = styled(EnvironmentOutlined)`
  font-size: 1.4rem;
  color: ${colors.orange};
`;

const RightContainer = styled.div`
  width: 30%;
  text-align: end;
`;

const ImageBox = styled.div`
  display: inline-block;
  width: 78px;
  height: 78px;
  margin-bottom: 1rem;
  border: 3px solid ${colors.lightgrey_3};
  border-radius: 5px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusText = styled.h1`
  color: ${(props) => props.color};
  font-size: 1rem;
  font-weight: 600;
`;

const AppliedAtText = styled.span`
  font-size: 1rem;
  font-weight: 400;
  color: ${colors.black_1};
`;

const NotFoundContainer = styled.div`
  height: 25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ApplicationsPage = () => {
  const { loading, data, error } = useQuery(applicationsGql.GET_MY_APPLICATIONS, {
    fetchPolicy: "no-cache",
  });
  const router = useRouter();

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  const getStatusText = (status) => {
    if (status === "WAITING") {
      return "กำลังรอดำเนินการ";
    } else if (status === "RECEIVED") {
      return "ได้รับแล้ว";
    } else {
      return "";
    }
  };

  const displaySalary = (min, max) => {
    if (min === max) {
      return <InformationText>{min} THB</InformationText>;
    }

    return (
      <InformationText>
        {min} - {max} THB
      </InformationText>
    );
  };

  const redirectHandler = (id) => {
    router.push(`/jobs/${id}`);
  };

  return (
    <>
      <Head>
        <title>JobTH - ประวัติการสมัครงาน</title>
      </Head>
      <RootContainer>
        <Container>
          <Title>งานที่คุณสมัคร</Title>
          <ApplicationsList>
            {loading && <Loading />}
            {data && data.getMyApplications.length === 0 && (
              <NotFoundContainer>
                <Empty description="ไม่พบการสมัครงานของคุณ" />
              </NotFoundContainer>
            )}
            {data &&
              data.getMyApplications.map((application) => (
                <ApplicationItemBox key={application._id} onClick={() => redirectHandler(application.job._id)}>
                  <LeftContainer>
                    <JobTitle>{application.job.position}</JobTitle>
                    <CompanyNameTitle>{application.job.company.companyName}</CompanyNameTitle>
                    <InformationContainer>
                      <PairInformationContainer>
                        <SalaryIcon />
                        {displaySalary(application.job.salary.min, application.job.salary.max)}
                      </PairInformationContainer>
                      <PairInformationContainer>
                        <LocationIcon />
                        <InformationText>
                          {application.job.location.district}
                          {", "}
                          {application.job.location.province}
                        </InformationText>
                      </PairInformationContainer>
                    </InformationContainer>
                  </LeftContainer>
                  <RightContainer>
                    <ImageBox>
                      <Image
                        src={
                          application.job.company.image.url
                            ? application.job.company.image.url
                            : "/unknown-profile.jpeg"
                        }
                      />
                    </ImageBox>
                    <StatusText color={application.status === "WAITING" ? colors.warning : colors.success}>
                      {getStatusText(application.status)}
                    </StatusText>
                    <AppliedAtText>สมัครเมื่อ {moment(application.createdAt).format("DD MMM yyyy")}</AppliedAtText>
                  </RightContainer>
                </ApplicationItemBox>
              ))}
          </ApplicationsList>
        </Container>
      </RootContainer>
    </>
  );
};

export default ApplicationsPage;
