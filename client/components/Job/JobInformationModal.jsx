import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { DollarOutlined, EnvironmentOutlined, HeartFilled } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Modal, Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import ErrorBox from "../Error/ErrorBox";
import Loading from "../Loading/Loading";

const InformationContainer = styled.div`
  padding: 1rem;
`;

const Title = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
`;

const SubTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 400;
  border-bottom: 1px solid ${colors.lightgrey_4};
  padding-bottom: 0.2rem;
`;

const SectionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  margin-left: 2rem;
`;

const Item = styled.li`
  font-size: 1rem;
  font-weight: 300;
`;

const PairInformation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
`;

const SalaryIcon = styled(DollarOutlined)`
  font-size: 1.4rem;
  color: ${colors.orange};
`;

const LocationIcon = styled(EnvironmentOutlined)`
  font-size: 1.4rem;
  color: ${colors.orange};
`;

const InformationText = styled.span`
  font-size: 1rem;
  font-weight: 300;
  margin-left: 5px;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  padding: 0.3rem 0.5rem;
  border: 0.5px solid ${colors.lightgrey_4};
  border-radius: 5px;
  margin-top: 5px;

  &:not(:first-child) {
    margin-left: 5px;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const LikeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HeartFilledIcon = styled(HeartFilled)`
  font-size: 1.8rem;
  color: ${colors.orange};
`;

const CreatedAtText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.lightgrey_4};
`;

const LinkContainer = styled.div`
  text-align: end;
`;

const JobInformationModal = ({ job, modalOpen, onSetModalOpen }) => {
  const { loading, data, error } = useQuery(jobsGql.GET_JOB, {
    variables: {
      getJobId: job._id
    },
    fetchPolicy: "no-cache"
  });

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

  return (
    <Modal
      title={data ? <Title>{data.getJob.position}</Title>: <Title>Loading..</Title>}
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      open={modalOpen}
      onCancel={() => onSetModalOpen(false)}>
      {loading && <Loading />}
      {data && (
        <InformationContainer>
          <SectionContainer>
            <SubTitle>รายละเอียด</SubTitle>
            <List>
              {data.getJob.details.map((detail, index) => (
                <Item key={index}>{detail}</Item>
              ))}
            </List>
          </SectionContainer>
          <SectionContainer>
            <SubTitle>คุณสมบัติ</SubTitle>
            <List>
              {data.getJob.qualifications.map((qualification, index) => (
                <Item key={index}>{qualification}</Item>
              ))}
            </List>
          </SectionContainer>
          <SectionContainer>
            <SubTitle>สวัสดิการ</SubTitle>
            <List>
              {data.getJob.benefits.map((benefit, index) => (
                <Item key={index}>{benefit}</Item>
              ))}
            </List>
          </SectionContainer>
          <SectionContainer>
            <PairInformation>
              <SalaryIcon />
              {displaySalary(data.getJob.salary.min, data.getJob.salary.max)}
            </PairInformation>
            <PairInformation>
              <LocationIcon />
              <InformationText>
                {data.getJob.location.district}
                {", "}
                {data.getJob.location.province}
              </InformationText>
            </PairInformation>
          </SectionContainer>
          <SectionContainer>
            <SubTitle>Tags</SubTitle>
            <TagsList>
              {data.getJob.tags.map((tag) => (
                <TagItem key={tag._id}>{tag.name}</TagItem>
              ))}
            </TagsList>
          </SectionContainer>
          <BottomContainer>
            <Tooltip placement="top" title={`มีคนกดไลค์${data.getJob.favorites.length}คน`}>
              <LikeContainer>
                <HeartFilledIcon />
                <InformationText>{data.getJob.favorites.length}</InformationText>{" "}
              </LikeContainer>
            </Tooltip>
            <CreatedAtText>{moment(data.getJob.createdAt).format("DD-MMM-yyyy")}</CreatedAtText>
          </BottomContainer>
          <LinkContainer>
            <Link href={`/jobs/${data.getJob._id}`}>ไปยังเพจหลัก&#8677;</Link>
          </LinkContainer>
        </InformationContainer>
      )}
    </Modal>
  );
};

export default JobInformationModal;
