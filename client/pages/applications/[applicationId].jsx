import ErrorBox from "@/components/Error/ErrorBox";
import colors from "@/constant/colors";
import {
  DollarOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import { Button, Divider, Tooltip } from "antd";
import Link from "next/link";
import { saveAs } from "file-saver";
import JobSeekerProfileModal from "@/components/Application/JobSeekerProfileModal";
import { useQuery } from "@apollo/client";
import applicationsGql from "@/gql/applications";
import { useRouter } from "next/router";
import Loading from "@/components/Loading/Loading";
import Head from "next/head";

const RootContainer = styled.div`
  padding-top: 2rem;
`;

const Container = styled.div`
  background-color: ${colors.white};
  padding: 1.5rem 2rem 3rem;
  width: 50%;
  margin: 0 auto;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0.3rem 0 1rem ${colors.lightgrey_4};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
`;

const StatusText = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(props) => (props.status === "WAITING" ? colors.warning : colors.success)};
`;

const InformationBox = styled.div`
  padding: 0 1rem;
  border: 0.5px solid ${colors.lightgrey_4};
  border-radius: 10px;
`;

const TopContainer = styled.div`
  margin: 1rem 0 2rem;
`;

const BasicJobInformationBox = styled.div`
  padding: 1rem 1rem;
  background-color: ${colors.lightgrey_2};
  border-radius: 10px;
`;

const CreatedAtContainer = styled.div`
  text-align: end;
`;

const CreatedAtText = styled.span`
  font-size: 0.8rem;
  font-weight: 200;
  color: ${colors.black_1};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.black_1};

  &:hover {
    text-decoration: underline;
    color: ${colors.orange};
  }
`;

const JobTitle = styled.h1`
  font-size: 1.7rem;
  font-weight: 400;
`;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SalaryIcon = styled(DollarOutlined)`
  font-size: 1.6rem;
  color: ${colors.orange};
`;

const LocationIcon = styled(EnvironmentOutlined)`
  font-size: 1.6rem;
  color: ${colors.orange};
`;

const InformationText = styled.span`
  font-size: 1rem;
  font-weight: 300;
  margin-left: 10px;
`;

const MiddleContainer = styled.div`
  padding: 0 1rem;
`;

const UserIcon = styled(UserOutlined)`
  font-size: 1.6rem;
  color: ${colors.orange};
`;

const MailIcon = styled(MailOutlined)`
  font-size: 1.6rem;
  color: ${colors.orange};
`;

const PhoneIcon = styled(PhoneOutlined)`
  font-size: 1.6rem;
  color: ${colors.orange};
`;

const BottomContainer = styled.div`
  padding: 0 1rem;
`;

const ResumeContainer = styled.div`
  margin-bottom: 2rem;
`;

const DownloadIconContainer = styled.div`
  text-align: end;
`;

const DownloadIcon = styled(DownloadOutlined)`
  font-size: 2rem;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

const ResumeImage = styled.img`
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div`
  padding-bottom: 2rem;
  text-align: center;
`;

const StyledButton = styled(Button)`
  background-color: ${colors.orange};
  color: white !important;
  width: 30%;
  border: none;

  &:hover {
    outline: none;
    border: none;
    opacity: 0.8;
  }
`;

const ApplicationPage = () => {
  const applicationId = useRouter().query.applicationId;
  const { loading, data, error } = useQuery(applicationsGql.GET_FULL_APPLICATION_INFORMATION, {
    variables: {
      getFullApplicationInformationId: applicationId,
    },
  });
  const [modalOpen, setModalOpen] = useState(false);

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

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

  const getStatusText = (status) => {
    if (status === "WAITING") {
      return "กำลังรอดำเนินการ";
    } else if (status === "RECEIVED") {
      return "ได้รับแล้ว";
    } else {
      return "";
    }
  };

  const downloadImage = () => {
    saveAs(data.getFullApplicationInformation.resume.url, "resume");
  };

  return (
    <>
      <Head>
        <title>JobTH - รายละเอียดการสมัครงาน</title>
      </Head>
      <RootContainer>
        {data && (
          <JobSeekerProfileModal
            modalOpen={modalOpen}
            onSetModalOpen={setModalOpen}
            jobSeekerId={data.getFullApplicationInformation.jobSeekerId}
          />
        )}
        <Container>
          {loading && <Loading />}
          {data && (
            <>
              <TitleContainer>
                <Title>รายละเอียดของการสมัครงาน</Title>
                <StatusText status={data.getFullApplicationInformation.status}>
                  {getStatusText(data.getFullApplicationInformation.status)}
                </StatusText>
              </TitleContainer>
              <InformationBox>
                <TopContainer>
                  <BasicJobInformationBox>
                    <CreatedAtContainer>
                      <CreatedAtText>
                        {moment(data.getFullApplicationInformation.createdAt).format("DD MMM yyyy")}
                      </CreatedAtText>
                    </CreatedAtContainer>
                    <StyledLink href={`/jobs/${data.getFullApplicationInformation.job._id}`}>
                      <JobTitle>{data.getFullApplicationInformation.job.position}</JobTitle>
                    </StyledLink>
                    <PairInformationContainer>
                      <SalaryIcon />
                      {displaySalary(
                        data.getFullApplicationInformation.job.salary.min,
                        data.getFullApplicationInformation.job.salary.max
                      )}
                    </PairInformationContainer>
                    <PairInformationContainer>
                      <LocationIcon />
                      <InformationText>
                        {data.getFullApplicationInformation.job.location.district}
                        {", "}
                        {data.getFullApplicationInformation.job.location.province}
                      </InformationText>
                    </PairInformationContainer>
                  </BasicJobInformationBox>
                </TopContainer>
                <MiddleContainer>
                  <Divider orientation="left">Contact</Divider>
                  <PairInformationContainer>
                    <MailIcon />
                    <InformationText>{data.getFullApplicationInformation.contact.email}</InformationText>
                  </PairInformationContainer>
                  <PairInformationContainer>
                    <PhoneIcon />
                    <InformationText>{data.getFullApplicationInformation.contact.tel}</InformationText>
                  </PairInformationContainer>
                </MiddleContainer>
                <BottomContainer>
                  <Divider orientation="left">Resume</Divider>
                  <ResumeContainer>
                    <ResumeImage src={data.getFullApplicationInformation.resume.url} />
                    <DownloadIconContainer>
                      <Tooltip placement="top" title="ดาวน์โหลดไฟล์รูปภาพนี้">
                        <DownloadIcon onClick={downloadImage} />
                      </Tooltip>
                    </DownloadIconContainer>
                  </ResumeContainer>
                  <ButtonContainer>
                    <StyledButton onClick={() => setModalOpen(true)}>ดูโปรไฟล์ผู้สมัครงาน</StyledButton>
                  </ButtonContainer>
                </BottomContainer>
              </InformationBox>
            </>
          )}
        </Container>
      </RootContainer>
    </>
  );
};

export default ApplicationPage;
