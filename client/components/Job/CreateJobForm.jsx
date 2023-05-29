import colors from "@/constant/colors";
import PROVINCES from "@/constant/provinces";
import jobsGql from "@/gql/jobs";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Checkbox, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const provinces = PROVINCES.map((province) => ({
  value: province.province,
  label: province.province,
}));

const getDistrictOptions = (province) => {
  if (!province) {
    return [];
  }
  const selectedProvince = PROVINCES.find((p) => p.province === province);

  if (!selectedProvince) {
    return [];
  }

  return selectedProvince.districts.map((district) => ({
    value: district.district,
    label: district.district,
  }));
};

const Form = styled.div``;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${colors.black_1};
  margin-bottom: 0.2rem;
`;

const AddMoreTextContainer = styled.div`
  text-align: end;
`;

const AddMoreText = styled.span`
  color: ${colors.primary};
  cursor: pointer;
  font-size: 0.8rem;
`;

const SalaryInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
`;

const ButtonContainer = styled.div`
  text-align: end;
  margin-top: 2rem;
`;

const CreateJobForm = () => {
  const { data } = useQuery(jobsGql.GET_TAGS);
  const [createJob, { loading: creating }] = useMutation(jobsGql.CREATE_JOB);

  const [enteredData, setEnteredData] = useState({
    position: "",
    details: [""],
    qualifications: [""],
    benefits: [""],
    salary: {
      min: 0,
      max: 0,
    },
    location: {
      district: "",
      province: "",
    },
    tags: [],
  });
  const [isSalaryEqual, setIsSalaryEqual] = useState(false);

  const positionChangeHandler = (e) => {
    setEnteredData({
      ...enteredData,
      position: e.target.value
    })
  }

  const arrayDataChangeHandler = (type, index, value) => {
    const copiedArray = JSON.parse(JSON.stringify(enteredData))[type];
    copiedArray[index] = value;
    setEnteredData({
      ...enteredData,
      [type]: copiedArray,
    });
  };

  const addMoreDetailsHandler = () => {
    const pushedDetails = JSON.parse(JSON.stringify(enteredData.details));
    pushedDetails.push("");
    setEnteredData({
      ...enteredData,
      details: pushedDetails,
    });
  };

  const addMoreQualificationsHandler = () => {
    const pushedQualification = JSON.parse(JSON.stringify(enteredData.qualifications));
    pushedQualification.push("");
    setEnteredData({
      ...enteredData,
      qualifications: pushedQualification,
    });
  };

  const addMoreBenefitsHandler = () => {
    const pushedBenefit = JSON.parse(JSON.stringify(enteredData.benefits));
    pushedBenefit.push("");
    setEnteredData({
      ...enteredData,
      benefits: pushedBenefit,
    });
  };

  const changeIsSalaryEqual = () => {
    setIsSalaryEqual(!isSalaryEqual);
    setEnteredData({
      ...enteredData,
      salary: {
        ...enteredData.salary,
        max: enteredData.salary.min,
      },
    });
  };

  const salaryChangeHandler = (val) => {
    setEnteredData({
      ...enteredData,
      salary: {
        min: val,
        max: val,
      },
    });
  };

  const salariesChangeHandler = (type, val) => {
    if(type === "min") {
      if(val > enteredData.salary.max) {
        return setEnteredData({
          ...enteredData,
          salary: {
            max: val,
            [type]: val,
          },
        });
      }
    }
    setEnteredData({
      ...enteredData,
      salary: {
        ...enteredData.salary,
        [type]: val,
      },
    });
  };

  const selectProvinceHandler = (val) => {
    setEnteredData({
      ...enteredData,
      location: {
        district: "",
        province: val,
      },
    });
  };

  const selectDistrictHandler = (val) => {
    setEnteredData({
      ...enteredData,
      location: {
        ...enteredData.location,
        district: val,
      },
    });
  };

  const tagChangeHandler = (selectedTags) => {
    setEnteredData({
      ...enteredData,
      tags: selectedTags,
    });
  };

  const submitHandler = () => {
    createJob({
      variables: {
        input: {
          ...enteredData,
          details: enteredData.details.filter((detail) => detail !== ""),
          qualifications: enteredData.qualifications.filter((qualification) => qualification !== ""),
          benefits: enteredData.benefits.filter((benefit) => benefit !== ""),
        },
      },
      onCompleted: (res) => {
        toast(res.createNewJob.msg);
        setEnteredData({
          position: "",
          details: [""],
          qualifications: [""],
          benefits: [""],
          salary: {
            min: 0,
            max: 0,
          },
          location: {
            district: "",
            province: "",
          },
          tags: [],
        });
        setIsSalaryEqual(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Form>
      <InputGroup>
        <Label>ชื่อตำแหน่ง</Label>
        <Input size="large" id="position" placeholder="ชื่อตำแหน่ง" onChange={positionChangeHandler} value={enteredData.position} />
      </InputGroup>
      <InputGroup>
        <Label>รายละเอียดเพิ่มเติม</Label>
        {enteredData.details.map((detail, index) => (
          <InputWrapper key={index}>
            <Input
              size="large"
              placeholder={`รายละเอียดเพิ่มเติม ${index + 1}`}
              onChange={(e) => arrayDataChangeHandler("details", index, e.target.value)}
              value={detail}
            />
          </InputWrapper>
        ))}
        <AddMoreTextContainer>
          {enteredData.details.length < 10 && <AddMoreText onClick={addMoreDetailsHandler}>เพิ่ม</AddMoreText>}
        </AddMoreTextContainer>
      </InputGroup>
      <InputGroup>
        <Label>คุณสมบัติ</Label>
        {enteredData.qualifications.map((qualification, index) => (
          <InputWrapper key={index}>
            <Input
              size="large"
              placeholder={`คุณสมบัติ ${index + 1}`}
              onChange={(e) => arrayDataChangeHandler("qualifications", index, e.target.value)}
              value={qualification}
            />
          </InputWrapper>
        ))}
        <AddMoreTextContainer>
          {enteredData.qualifications.length < 10 && (
            <AddMoreText onClick={addMoreQualificationsHandler}>เพิ่ม</AddMoreText>
          )}
        </AddMoreTextContainer>
      </InputGroup>
      <InputGroup>
        <Label>สวัสดิการ</Label>
        {enteredData.benefits.map((benefit, index) => (
          <InputWrapper key={index}>
            <Input
              size="large"
              placeholder={`สวัสดิการ ${index + 1}`}
              onChange={(e) => arrayDataChangeHandler("benefits", index, e.target.value)}
              value={benefit}
            />
          </InputWrapper>
        ))}
        <AddMoreTextContainer>
          {enteredData.benefits.length < 10 && <AddMoreText onClick={addMoreBenefitsHandler}>เพิ่ม</AddMoreText>}
        </AddMoreTextContainer>
      </InputGroup>
      <InputGroup>
        <Label>เงินเดือน</Label>
        {isSalaryEqual ? (
          <InputWrapper>
            <InputNumber
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={salaryChangeHandler}
              min={0}
              value={enteredData.salary.min}
            />
          </InputWrapper>
        ) : (
          <SalaryInputContainer>
            <InputNumber
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => salariesChangeHandler("min", val)}
              min={0}
              value={enteredData.salary.min}
            />
            <Label style={{ margin: "0 1rem" }}>{" - "}</Label>
            <InputNumber
              defaultValue={enteredData.salary.max}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => salariesChangeHandler("max", val)}
              min={enteredData.salary.min}
              value={enteredData.salary.max}
            />
          </SalaryInputContainer>
        )}
        <Checkbox checked={isSalaryEqual} onChange={changeIsSalaryEqual}>
          เงินเดือนคงที่
        </Checkbox>
      </InputGroup>
      <InputGroup>
        <Label>สถานที่ทำงาน</Label>
        <InputWrapper>
          <Select
            placeholder="เลือกจังหวัด"
            style={{ width: "40%" }}
            options={provinces}
            value={enteredData.location.province}
            onChange={selectProvinceHandler}
          />
        </InputWrapper>
        {enteredData.location.province && (
          <InputWrapper>
            <Select
              placeholder="เลือกอำเภอ"
              style={{ width: "40%" }}
              options={getDistrictOptions(enteredData.location.province)}
              value={enteredData.location.district}
              onChange={selectDistrictHandler}
            />
          </InputWrapper>
        )}
      </InputGroup>
      <InputGroup>
        <Label>Tags</Label>
        {data && (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="เลือกTagที่เกี่ยวข้อง"
            value={enteredData.tags}
            onChange={tagChangeHandler}>
            {data.getTags.map((tag) => (
              <Select.Option key={tag._id} value={tag._id} label={tag.name}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </InputGroup>
      <ButtonContainer>
        <Button size="large" onClick={submitHandler} disabled={creating}>
          {creating ? "กำลังสร้าง.." : "สร้าง"}
        </Button>
      </ButtonContainer>
    </Form>
  );
};

export default CreateJobForm;
