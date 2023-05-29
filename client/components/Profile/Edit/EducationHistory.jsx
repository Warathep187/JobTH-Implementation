import colors from "@/constant/colors";
import { educationLevels, getEducationLevel } from "@/constant/educationLevel";
import { Select, Typography, Input, Checkbox, Button } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { getNext10Years, get50YearsAgo } from "../../../utils/displayYearList";
import { useMutation } from "@apollo/client";
import profileGql from "@/gql/profile";
import { toast } from "react-toastify";

const Container = styled.div`
  background-color: ${colors.white};
  padding: 3rem 4rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

const HistoryContainer = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const HistoryBox = styled.div`
  border-bottom: 1px solid ${colors.lightgrey_3};
  display: flex;
  align-items: start;
  margin-bottom: 1rem;
`;

const BoldText = styled.b`
  display: block;
  font-weight: 500;
  margin-right: 1.5rem;
  margin-bottom: 1.4rem;
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 0.8rem;
`;

const ButtonContainer = styled.div`
  text-align: end;
`;

const EducationHistory = ({ educations }) => {
  const [updateEducation, { loading }] = useMutation(profileGql.UPDATE_EDUCATION_HISTORY);
  const [myEducations, setMyEducations] = useState(
    educations.map((education) => ({
      level: education.level,
      isStudying: education.isStudying,
      year: education.year,
      academy: education.academy,
      major: education.major,
    }))
  );

  const levelChangeHandler = (index, value) => {
    const copiedEducations = JSON.parse(JSON.stringify(myEducations));
    copiedEducations[index].level = value;
    setMyEducations(copiedEducations);
  };

  const yearChangeHandler = (index, value) => {
    const copiedEducations = JSON.parse(JSON.stringify(myEducations));
    copiedEducations[index].year = +value;
    setMyEducations(copiedEducations);
  };

  const isStudyingChangeHandler = () => {
    const copiedEducations = JSON.parse(JSON.stringify(myEducations));
    copiedEducations[0].isStudying = !copiedEducations[0].isStudying;
    setMyEducations(copiedEducations);
  };

  const academyChangeHandler = (index, value) => {
    const copiedEducations = JSON.parse(JSON.stringify(myEducations));
    copiedEducations[index].academy = value;
    setMyEducations(copiedEducations);
  };

  const majorChangeHandler = (index, value) => {
    const copiedEducations = JSON.parse(JSON.stringify(myEducations));
    copiedEducations[index].major = value;
    setMyEducations(copiedEducations);
  };

  const submitHandler = () => {
    updateEducation({
      variables: {
        input: myEducations,
      },
      onCompleted: (res) => {
        toast(res.updateEducationHistory.msg);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Container>
      <Title>ประวัติการศึกษา</Title>
      <HistoryContainer>
        <HistoryBox>
          <Typography>
            <BoldText>ระดับการศึกษา</BoldText>
            <BoldText>{myEducations[0].isStudying ? "ปีที่คาดว่าจะจบ" : "ปีที่จบ"}</BoldText>
            <br />
            <BoldText>สถานศึกษา</BoldText>
            <BoldText>สาขา</BoldText>
          </Typography>
          <div>
            <InputWrapper>
              <Select
                defaultValue={getEducationLevel(myEducations[0].level)}
                style={{ width: 150 }}
                options={educationLevels}
                onChange={(value) => levelChangeHandler(0, value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Select
                defaultValue={myEducations[0].year}
                style={{ width: 150 }}
                options={myEducations[0].isStudying ? getNext10Years() : get50YearsAgo()}
                onChange={(value) => yearChangeHandler(0, value)}
              />
              <br />
              <Checkbox defaultChecked={myEducations[0].isStudying} onChange={isStudyingChangeHandler}>
                กำลังศึกษาอยู่
              </Checkbox>
            </InputWrapper>
            <InputWrapper>
              <Input
                size="large"
                value={myEducations[0].academy}
                onChange={(e) => academyChangeHandler(0, e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                size="large"
                value={myEducations[0].major}
                onChange={(e) => majorChangeHandler(0, e.target.value)}
              />
            </InputWrapper>
          </div>
        </HistoryBox>
        <HistoryBox>
          <Typography>
            <BoldText>ระดับการศึกษา</BoldText>
            <BoldText>ปีที่จบ</BoldText>
            <BoldText>สถานศึกษา</BoldText>
            <BoldText>สาขา</BoldText>
          </Typography>
          <div>
            <InputWrapper>
              <Select
                defaultValue={getEducationLevel(myEducations[1].level)}
                style={{ width: 150 }}
                options={educationLevels}
                onChange={(value) => levelChangeHandler(1, value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Select
                defaultValue={myEducations[1].year}
                style={{ width: 150 }}
                options={get50YearsAgo()}
                onChange={(value) => yearChangeHandler(1, value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                size="large"
                value={myEducations[1].academy}
                onChange={(e) => academyChangeHandler(1, e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                size="large"
                value={myEducations[1].major}
                onChange={(e) => majorChangeHandler(1, e.target.value)}
              />
            </InputWrapper>
          </div>
        </HistoryBox>
        <HistoryBox>
          <Typography>
            <BoldText>ระดับการศึกษา</BoldText>
            <BoldText>ปีที่จบ</BoldText>
            <BoldText>สถานศึกษา</BoldText>
            <BoldText>สาขา</BoldText>
          </Typography>
          <div>
            <InputWrapper>
              <Select
                defaultValue={getEducationLevel(myEducations[2].level)}
                style={{ width: 150 }}
                options={educationLevels}
                onChange={(value) => levelChangeHandler(2, value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Select
                defaultValue={myEducations[2].year}
                style={{ width: 150 }}
                options={get50YearsAgo()}
                onChange={(value) => yearChangeHandler(2, value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                size="large"
                value={myEducations[2].academy}
                onChange={(e) => academyChangeHandler(2, e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                size="large"
                value={myEducations[2].major}
                onChange={(e) => majorChangeHandler(2, e.target.value)}
              />
            </InputWrapper>
          </div>
        </HistoryBox>
        <ButtonContainer>
          <Button size="large" onClick={submitHandler} disabled={loading}>
            {loading ? "กำลังอัพเดท" : "ยืนยัน"}
          </Button>
        </ButtonContainer>
      </HistoryContainer>
    </Container>
  );
};

export default EducationHistory;
