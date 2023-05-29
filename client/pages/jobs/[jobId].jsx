import ApplyApplicationModal from "@/components/Application/ApplyApplicationModal";
import ErrorBox from "@/components/Error/ErrorBox";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import roles from "@/constant/roles";
import jobsGql from "@/gql/jobs";
import { DollarOutlined, EnvironmentOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Tooltip } from "antd";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";

const RootContainer = styled.div`
  background-color: ${colors.white};
  padding-bottom: 3rem;
`;

const Container = styled.div`
  width: 70%;
  margin: 0 auto;
  padding-top: 3rem;
  position: relative;
`;

const TopCompanyContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const TopLeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TopRightContainer = styled.div``;

const HeartOutlinedIcon = styled(HeartOutlined)`
  font-size: 2.5rem;
  color: ${colors.orange};
  cursor: pointer;
`;

const HeartFilledIcon = styled(HeartFilled)`
  font-size: 2.5rem;
  color: ${colors.orange};
  cursor: pointer;
`;

const CompanyImageContainer = styled.div`
  width: 9rem;
  height: 9rem;
  border: 0.5px solid ${colors.lightgrey_4};
  border-radius: 10px;
  overflow: hidden;
`;

const CompanyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BasicCompanyInformationContainer = styled.div`
  margin-left: 2rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 400;
`;

const ViewCompanyDetailLink = styled(Link)`
  font-size: 1.1rem;
  font-weight: 100;
  text-decoration: none;
  color: ${colors.orange};
`;

const BasicJobInformationBox = styled.div`
  padding: 1rem 1rem;
  background-color: ${colors.lightgrey_2};
  border-radius: 10px;
  margin-bottom: 3rem;
`;

const CreatedAtContainer = styled.div`
  text-align: end;
`;

const CreatedAtText = styled.span`
  font-size: 0.8rem;
  font-weight: 200;
  color: ${colors.black_1};
`;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
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

const ButtonContainer = styled.div`
  text-align: end;
`;

const StyledButton = styled(Button)`
  background-color: ${colors.orange};
  color: white !important;
  width: 30%;
  border: none;

  &:hover {
    outline: none;
    border: none;
  }
`;

const JobInformationContainer = styled.div`
  margin-bottom: 3rem;
`;

const List = styled.ul`
  list-style: circle;
  margin-left: 2rem;
`;

const ListItem = styled.li`
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  font-weight: 100;
`;

const TagsList = styled.div`
  display: flex;
  align-items: center;
`;

const TagItem = styled.div`
  background-color: ${colors.lightgrey_3};
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  font-weight: 300;

  &:not(:first-child) {
    margin-left: 5px;
  }
`;

const JobPage = () => {
  const router = useRouter();
  const { id, role, isSignedIn } = useSelector((state) => state.loggedInInfo);
  const { loading, data, error } = useQuery(jobsGql.GET_JOB, {
    variables: {
      getJobId: router.query.jobId,
    },
    fetchPolicy: "no-cache",
    onCompleted: (res) => {
      setIsLiked(!!res.getJob.favorites.find((fav) => fav.jobSeekerId === id));
    },
  });
  const [likeJob] = useMutation(jobsGql.LIKE_JOB);
  const [unlikeJob] = useMutation(jobsGql.UNLIKE_JOB);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const displayHearthIcon = () => {
    if (role === roles.JOB_SEEKER) {
      if (isLiked) {
        return <HeartFilledIcon onClick={unlikeHandler} />;
      } else {
        return <HeartOutlinedIcon onClick={likeHandler} />;
      }
    } else {
      return <></>;
    }
  };

  const openApplicationModalHandler = () => {
    if (isSignedIn) {
      if (role === roles.COMPANY) {
        toast.error("บริษัทไม่สามารถสมัครงานได้");
      } else {
        setModalOpen(true);
      }
    } else {
      router.push("/auth/resumes/login");
    }
  };

  const likeHandler = () => {
    likeJob({
      variables: {
        likeJobId: router.query.jobId,
      },
      onCompleted: () => {
        toast("เพิ่มไปยังรายการที่ชอบ");
        setIsLiked(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const unlikeHandler = () => {
    unlikeJob({
      variables: {
        unlikeJobId: router.query.jobId,
      },
      onCompleted: () => {
        toast("ลบออกจากรายการที่ชอบแล้ว");
        setIsLiked(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <Head>
        <title>JobTH - {data ? data.getJob.position: "loading.."}</title>
      </Head>
      <RootContainer>
        {router.query.jobId && (
          <ApplyApplicationModal jobId={router.query.jobId} modalOpen={modalOpen} onSetModalOpen={setModalOpen} />
        )}
        <Container>
          {loading && <Loading />}
          {data && (
            <>
              <TopCompanyContainer>
                <TopLeftContainer>
                  <CompanyImageContainer>
                    <CompanyImage
                      src={data.getJob.company.image.url ? data.getJob.company.image.url : "/unknown-profile.jpeg"}
                    />
                  </CompanyImageContainer>
                  <BasicCompanyInformationContainer>
                    <Title>{data.getJob.company.companyName}</Title>
                    <ViewCompanyDetailLink href={`/companies/${data.getJob.company._id}`}>
                      ดูรายละเอียดบริษัท
                    </ViewCompanyDetailLink>
                  </BasicCompanyInformationContainer>
                </TopLeftContainer>
                <TopRightContainer>
                  <Tooltip placement="top" title="บันทึกไปยังงานที่สนใจ">
                    {displayHearthIcon()}
                  </Tooltip>
                </TopRightContainer>
              </TopCompanyContainer>
              <BasicJobInformationBox>
                <CreatedAtContainer>
                  <CreatedAtText>{moment(data.getJob.createdAt).format("DD MMM yyyy")}</CreatedAtText>
                </CreatedAtContainer>
                <Title>{data.getJob.position}</Title>
                <PairInformationContainer>
                  <SalaryIcon />
                  {displaySalary(data.getJob.salary.min, data.getJob.salary.max)}
                </PairInformationContainer>
                <PairInformationContainer>
                  <LocationIcon />
                  <InformationText>
                    {data.getJob.location.district}
                    {", "}
                    {data.getJob.location.province}
                  </InformationText>
                </PairInformationContainer>
                <ButtonContainer>
                  <StyledButton onClick={openApplicationModalHandler}>สมัครงาน</StyledButton>
                </ButtonContainer>
              </BasicJobInformationBox>
              <JobInformationContainer>
                <Title>รายละเอียดงาน</Title>
                <List>
                  {data.getJob.details.map((detail, index) => (
                    <ListItem key={index}>{detail}</ListItem>
                  ))}
                </List>
              </JobInformationContainer>
              <JobInformationContainer>
                <Title>คุณสมบัติ</Title>
                <List>
                  {data.getJob.qualifications.map((qualification, index) => (
                    <ListItem key={index}>{qualification}</ListItem>
                  ))}
                </List>
              </JobInformationContainer>
              <JobInformationContainer>
                <Title>สวัสดิการ</Title>
                <List>
                  {data.getJob.benefits.map((benefit, index) => (
                    <ListItem key={index}>{benefit}</ListItem>
                  ))}
                </List>
              </JobInformationContainer>
              <JobInformationContainer>
                <Title>Tags</Title>
                <TagsList>
                  {data.getJob.tags.map((tag) => (
                    <TagItem key={tag._id}>{tag.name}</TagItem>
                  ))}
                </TagsList>
              </JobInformationContainer>
            </>
          )}
        </Container>
      </RootContainer>
    </>
  );
};

export default JobPage;
