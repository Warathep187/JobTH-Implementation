import JobsList from "@/components/Company/JobsList";
import CompanyNotFoundError from "@/components/Error/CompanyNotFoundError";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import profileGql from "@/gql/profile";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Typography } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const RootContainer = styled.div`
  background-color: ${colors.white};
`;

const Container = styled.div`
  width: 70%;
  margin: 0 auto;
  background-color: ${colors.white};
  padding-bottom: 5rem;
  position: relative;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const CoverImage = styled.img`
  width: 100%;
  object-fit: cover;
  height: 22rem;
`;

const CompanyImage = styled.img`
  width: 10rem;
  height: 10rem;
  object-fit: contain;
  position: absolute;
  bottom: -5rem;
  left: 5rem;
  border-radius: 5px;
  border: 5px solid ${colors.lightgrey_2};
  transition: all 0.3s;
`;

const CompanyNameTitle = styled.h1`
  margin-top: 1.5rem;
  margin-left: 16rem;
  font-size: 1.5rem;
`;

const InformationContainer = styled.div`
  margin-top: 5rem;
`;

const Paragraph = styled(Typography.Paragraph)`
  font-size: 1.1rem;
  font-weight: 300;
`;

const TagsContainer = styled.div`
  margin-top: 3rem;
`;

const Title = styled.h1`
  border-bottom: 1px solid ${colors.lightgrey_3};
  padding-bottom: 0.5rem;
`;

const TagsList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  background-color: ${colors.lightgrey_3};
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 5px;

  &:not(:first-child) {
    margin-left: 5px;
  }
`;

const ContactContainer = styled.div`
  margin-top: 3rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
`;

const ContactText = styled.span`
  margin-left: 10px;
  font-size: 1.1rem;
  color: ${colors.black_1};
`;

const JobsContainer = styled.div`
  margin-top: 3rem;
`;

const JobContainerBar = styled.div`
  background-color: ${colors.lightgrey_3};
  height: 4rem;
  border-bottom: 5px solid ${colors.lightgrey_4};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

const PositionNumberTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
`;

const CompanyPage = () => {
  const { companyId } = useRouter().query;
  const { loading, data, error } = useQuery(profileGql.GET_COMPANY_PROFILE, {
    variables: {
      getCompanyId: companyId,
    },
  });
  const { data: tagsData } = useQuery(jobsGql.GET_COMPANY_JOBS, {
    variables: {
      getCompanyJobsId: companyId,
    },
  });

  if (error) {
    return <CompanyNotFoundError msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - {data ? data.getCompany.companyName : "loading.."}</title>
      </Head>
      <RootContainer>
        <Container>
          {loading && <Loading />}
          {data && (
            <>
              <ImageContainer>
                <CoverImage src={data.getCompany.image.url ? data.getCompany.image.url : "/unknown-profile.jpeg"} />
                <CompanyImage src={data.getCompany.image.url ? data.getCompany.image.url : "/unknown-profile.jpeg"} />
              </ImageContainer>
              <CompanyNameTitle>{data.getCompany.companyName}</CompanyNameTitle>
              <InformationContainer>
                <Typography>
                  <Paragraph>{data.getCompany.information}</Paragraph>
                </Typography>
              </InformationContainer>
              <TagsContainer>
                <Title>Tags</Title>
                <TagsList>
                  {data.getCompany.tags.map((tag) => (
                    <TagItem key={tag._id}>{tag.name}</TagItem>
                  ))}
                </TagsList>
              </TagsContainer>
              <ContactContainer>
                <Title>Contact</Title>
                <ContactItem>
                  <MailOutlined style={{ fontSize: "2rem", color: colors.black_1 }} />
                  <ContactText>{data.getCompany.contact.email}</ContactText>
                </ContactItem>
                <ContactItem>
                  <PhoneOutlined style={{ fontSize: "2rem", color: colors.black_1 }} />
                  <ContactText>{data.getCompany.contact.tel}</ContactText>
                </ContactItem>
              </ContactContainer>
              {tagsData && (
                <JobsContainer>
                  <JobContainerBar>
                    <PositionNumberTitle>ตำแหน่งงานที่รับสมัคร</PositionNumberTitle>
                    <PositionNumberTitle>{tagsData.getCompanyJobs.length} ตำแหน่ง</PositionNumberTitle>
                  </JobContainerBar>
                  <JobsList jobs={tagsData.getCompanyJobs} />
                </JobsContainer>
              )}
            </>
          )}
        </Container>
      </RootContainer>
    </>
  );
};

export default CompanyPage;
