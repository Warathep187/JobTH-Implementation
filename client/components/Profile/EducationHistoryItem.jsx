import colors from "@/constant/colors";
import getEducationLevel from "@/utils/getEducationLevel";
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${colors.lightgrey_3};
  position: relative;
`;

const StudyingStatus = styled.div`
  transform: translate(-50%, -50%);
  position: absolute;
  top: 1.5rem;
  right: 0;
  display: flex;
  align-items: center;
`;

const StatusText = styled.h1`
  font-size: 1rem;
  color: green;
`;

const InformationContainer = styled.div``;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const LeftInformationContainer = styled.div`
  width: 25%;
`;

const RightInformationContainer = styled.div`
  width: 25%;
`;

const BoldText = styled.b`
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const NormalText = styled.span`
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const EducationHistoryItem = ({ education }) => {
  return (
    <Box>
      {education.isStudying && (
        <StudyingStatus>
          <StatusText>กำลังศึกษา</StatusText>
        </StudyingStatus>
      )}
      <InformationContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>ระดับการศึกษา</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <NormalText>{education.level === "EMPTY" ? "-" : getEducationLevel(education.level)}</NormalText>
          </RightInformationContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>{education.isStudying ? "ปีที่คาดว่าจะจบ" : "ปีที่จบการศึกษา"}</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <NormalText>{education.level === "EMPTY" ? "-" : education.year}</NormalText>
          </RightInformationContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>สถานศึกษา</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <NormalText>{education.academy ? education.academy : "-"}</NormalText>
          </RightInformationContainer>
        </PairInformationContainer>
        <PairInformationContainer>
          <LeftInformationContainer>
            <BoldText>สาขา</BoldText>
          </LeftInformationContainer>
          <RightInformationContainer>
            <NormalText>{education.major ? education.major : "-"}</NormalText>
          </RightInformationContainer>
        </PairInformationContainer>
      </InformationContainer>
    </Box>
  );
};

export default EducationHistoryItem;
