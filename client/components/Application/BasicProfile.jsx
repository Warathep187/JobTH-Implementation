import colors from "@/constant/colors";
import { Avatar, Typography } from "antd";
import moment from "moment";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem 0;
`;

const TopContainer = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
`;

const MainInformationContainer = styled.div`
  padding-top: 0.8rem;
  margin-left: 1rem;
  width: 60%;
`;

const PairInformationContainer = styled.div`
  display: flex;
  margin-bottom: 0.6rem;
`;

const LeftInformationContainer = styled.div`
  width: 30%;
`;

const BoldText = styled.b`
  display: block;
  font-weight: 500;
  font-size: 1rem;
`;

const RightInformationContainer = styled.div`
  width: 70%;
  margin-left: 0.5rem;
`;

const SpanText = styled.span`
  margin-bottom: 0.8rem;
  font-size: 1rem;
`;

const BottomContainer = styled.div``;

const TagList = styled.div`
  display: flex;
  margin-bottom: 0.7rem;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  padding: 0.2rem 0.5rem;
  border: 0.5px solid ${colors.lightgrey_3};
  border-radius: 10px;
  margin-top: 3px;
  margin-bottom: 3px;

  &:not(:first-child) {
    margin-left: 0.3rem;
  }
`;

const UnorderedList = styled.ul`
  margin-left: 1rem;
`;

const BasicProfile = ({ profile }) => {
  return (
    <Container>
      <TopContainer>
        <Avatar
          shape="square"
          size={150}
          icon={<img src={profile.profileImage.url ? profile.profileImage.url : "/unknown-profile.jpeg"} />}
        />
        <MainInformationContainer>
          <PairInformationContainer>
            <LeftInformationContainer>
              <BoldText>ชื่อ</BoldText>
            </LeftInformationContainer>
            <RightInformationContainer>
              <SpanText>{profile.firstName ? profile.firstName : "-"}</SpanText>
            </RightInformationContainer>
          </PairInformationContainer>
          <PairInformationContainer>
            <LeftInformationContainer>
              <BoldText>นามสกุล</BoldText>
            </LeftInformationContainer>
            <RightInformationContainer>
              <SpanText>{profile.lastName ? profile.lastName : "-"}</SpanText>
            </RightInformationContainer>
          </PairInformationContainer>
          <PairInformationContainer>
            <LeftInformationContainer>
              <BoldText>เพศ</BoldText>
            </LeftInformationContainer>
            <RightInformationContainer>
              <SpanText>{profile.gender ? profile.gender : "-"}</SpanText>
            </RightInformationContainer>
          </PairInformationContainer>
          <PairInformationContainer>
            <LeftInformationContainer>
              <BoldText>วันเกิด</BoldText>
            </LeftInformationContainer>
            <RightInformationContainer>
              {profile.birthday ? (
                <SpanText>{moment(profile.birthday).format("DD-MM-YYYY")}</SpanText>
              ) : (
                <SpanText>-</SpanText>
              )}
            </RightInformationContainer>
          </PairInformationContainer>
        </MainInformationContainer>
      </TopContainer>
      <BottomContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>ที่อยู่</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <SpanText>{profile.address ? profile.address : "-"}</SpanText>
          </RightInformationContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>Tagsที่สนใจ</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <TagList>
              {profile.interestedTags.length > 0 &&
                profile.interestedTags.map((tag) => <TagItem key={tag._id}>{tag.name}</TagItem>)}
              {profile.interestedTags.length === 0 && <TagItem noborder={true}>-</TagItem>}
            </TagList>
          </RightInformationContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>ตำแหน่งที่ต้องการสมัคร</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <UnorderedList>
              {profile.interestedPositions.map((position, index) => (
                <li key={index}>{position}</li>
              ))}
            </UnorderedList>
          </RightInformationContainer>
        </PairInformationContainer>
      </BottomContainer>
    </Container>
  );
};

export default BasicProfile;
