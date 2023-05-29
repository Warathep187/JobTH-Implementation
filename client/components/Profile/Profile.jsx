import colors from "@/constant/colors";
import { Avatar, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import moment from "moment";
import EducationHistoryItem from "./EducationHistoryItem";

const Container = styled.div`
  background-color: ${colors.white};
  padding: 2rem 5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MainInformationContainer = styled.div`
  margin-left: 2rem;
  width: 80%;
`;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: baseline;
`;

const BoldTextContainer = styled.div`
  width: 20%;
`;

const BoldText = styled.b`
  display: block;
  font-weight: 500;
  margin-right: 1.5rem;
  margin-bottom: 0.8rem;
  font-size: 1rem;
`;

const SpanTextContainer = styled.div`
  width: 80%;
`;

const SpanText = styled.span`
  display: block;
  margin-bottom: 0.8rem;
  font-size: 1rem;
`;

const BottomContainer = styled.div`
  margin-top: 1.5rem;
  font-size: 1rem;
`;

const TagList = styled.div`
  display: flex;
  margin-bottom: 0.7rem;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  padding: 0.2rem 0.6rem;
  border: 0.5px solid ${colors.lightgrey_3};
  border-radius: 10px;
  margin-top: 0.3rem;

  &:not(:first-child) {
    margin-left: 0.3rem;
  }
`;

const PositionListContainer = styled.div`
  margin-left: 1rem;
`;

const EducationContainer = styled.div`
  margin-top: 1rem;
`;

const Profile = ({ profile }) => {
  return (
    <Container>
      <Title>โปรไฟล์</Title>
      <TopContainer>
        <Avatar
          shape="square"
          size={150}
          icon={<img src={profile.profileImage.url ? profile.profileImage.url : "/unknown-profile.jpeg"} />}
        />
        <MainInformationContainer>
          <PairInformationContainer>
            <BoldTextContainer>
              <BoldText>ชื่อ</BoldText>
            </BoldTextContainer>
            <SpanTextContainer>
              <SpanText>{profile.firstName ? profile.firstName : "-"}</SpanText>
            </SpanTextContainer>
          </PairInformationContainer>
          <PairInformationContainer>
            <BoldTextContainer>
              <BoldText>นามสกุล</BoldText>
            </BoldTextContainer>
            <SpanTextContainer>
              <SpanText>{profile.lastName ? profile.lastName : "-"}</SpanText>
            </SpanTextContainer>
          </PairInformationContainer>
          <PairInformationContainer>
            <BoldTextContainer>
              <BoldText>เพศ</BoldText>
            </BoldTextContainer>
            <SpanTextContainer>
              <SpanText>{profile.gender ? profile.gender : "-"}</SpanText>
            </SpanTextContainer>
          </PairInformationContainer>
          <PairInformationContainer>
            <BoldTextContainer>
              <BoldText>วันเกิด</BoldText>
            </BoldTextContainer>
            <SpanTextContainer>
              {profile.birthday ? (
                <SpanText>{moment(profile.birthday).format("วันที่ DD เดือน MM ปี YYYY")}</SpanText>
              ) : (
                <SpanText>-</SpanText>
              )}
            </SpanTextContainer>
          </PairInformationContainer>
        </MainInformationContainer>
      </TopContainer>
      <BottomContainer>
        <PairInformationContainer>
          <BoldTextContainer>
            <BoldText>ที่อยู่</BoldText>
          </BoldTextContainer>
          <SpanTextContainer>
            <SpanText>{profile.address ? profile.address : "-"}</SpanText>
          </SpanTextContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <BoldTextContainer>
            <BoldText>Tagsที่สนใจ</BoldText>
          </BoldTextContainer>
          <SpanTextContainer>
            <TagList>
              {profile.interestedTags.length > 0 &&
                profile.interestedTags.map((tag) => <TagItem key={tag._id}>{tag.name}</TagItem>)}
              {profile.interestedTags.length === 0 && <TagItem noborder={true}>-</TagItem>}
            </TagList>
          </SpanTextContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <BoldTextContainer>
            <BoldText>ตำแหน่งที่ต้องการสมัคร</BoldText>
          </BoldTextContainer>
          <PositionListContainer>
            <ul>
              {profile.interestedPositions.map((position, index) => (
                <li key={index}>{position}</li>
              ))}
            </ul>
          </PositionListContainer>
        </PairInformationContainer>
      </BottomContainer>
      <EducationContainer>
        <Typography>
          <BoldText>ประวัติการศึกษา</BoldText>
        </Typography>
        {profile.educations.map((education, index) => (
          <EducationHistoryItem education={education} key={index} />
        ))}
      </EducationContainer>
    </Container>
  );
};

export default Profile;
