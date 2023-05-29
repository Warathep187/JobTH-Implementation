import colors from "@/constant/colors";
import getEducationLevel from "@/utils/getEducationLevel";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1rem 0;
`;

const EducationList = styled.div``;

const EducationItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid ${colors.orange};
  margin-bottom: 0.5rem;
`;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const LabelContainer = styled.div`
  width: 40%;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
`;

const InformationContainer = styled.div`
  width: 60%;
`;

const InformationText = styled.span`
  font-size: 1rem;
  font-weight: 300;
`;

const Education = ({ educations }) => {
  return (
    <Container>
      <EducationList>
        {educations.map((education, index) => (
          <EducationItem key={index}>
            <PairInformationContainer>
              <LabelContainer>
                <Label>ระดับการศึกษา</Label>
              </LabelContainer>
              <InformationContainer>
                <InformationText>
                  {education.level === "EMPTY" ? "-" : getEducationLevel(education.level)}
                </InformationText>
              </InformationContainer>
            </PairInformationContainer>
            <PairInformationContainer>
              <LabelContainer>
                <Label>{education.isStudying ? "ปีที่คาดว่าจะจบ" : "ปีที่จบ"}</Label>
              </LabelContainer>
              <InformationContainer>
                <InformationText>{education.level === "EMPTY" ? "-" : education.year}</InformationText>
              </InformationContainer>
            </PairInformationContainer>
            <PairInformationContainer>
              <LabelContainer>
                <Label>สถานศึกษา</Label>
              </LabelContainer>
              <InformationContainer>
                <InformationText>{education.level === "EMPTY" ? "-" : education.academy}</InformationText>
              </InformationContainer>
            </PairInformationContainer>
            <PairInformationContainer>
              <LabelContainer>
                <Label>สาขา</Label>
              </LabelContainer>
              <InformationContainer>
                <InformationText>{education.level === "EMPTY" ? "-" : education.major}</InformationText>
              </InformationContainer>
            </PairInformationContainer>
          </EducationItem>
        ))}
      </EducationList>
    </Container>
  );
};

export default Education;
