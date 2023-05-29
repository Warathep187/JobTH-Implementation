import colors from "@/constant/colors";
import PROVINCES from "@/constant/provinces";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Checkbox, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import jobsGql from "../../gql/jobs";
import { toast } from "react-toastify";

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

const EditJobForm = ({ job }) => {
  const { data: tagsData } = useQuery(jobsGql.GET_TAGS);
  const [updateJob, { loading: updating }] = useMutation(jobsGql.UPDATE_JOB);
  const [data, setData] = useState({
    position: job.position,
    details: job.details,
    qualifications: job.qualifications,
    benefits: job.benefits,
    salary: {
      min: job.salary.min,
      max: job.salary.max,
    },
    location: {
      district: job.location.district,
      province: job.location.province,
    },
    tags: job.tags.map((tag) => tag._id),
  });
  const [isSalaryEqual, setIsSalaryEqual] = useState(false);

  const positionChangeHandler = (e) => {
    setData({
      ...data,
      position: e.target.value,
    });
  };

  const arrayDataChangeHandler = (type, index, value) => {
    const copiedArray = JSON.parse(JSON.stringify(data))[type];
    copiedArray[index] = value;
    setData({
      ...data,
      [type]: copiedArray,
    });
  };

  const addMoreDetailsHandler = () => {
    const pushedDetails = JSON.parse(JSON.stringify(data.details));
    pushedDetails.push("");
    setData({
      ...data,
      details: pushedDetails,
    });
  };

  const addMoreQualificationsHandler = () => {
    const pushedQualification = JSON.parse(JSON.stringify(data.qualifications));
    pushedQualification.push("");
    setData({
      ...data,
      qualifications: pushedQualification,
    });
  };

  const addMoreBenefitsHandler = () => {
    const pushedBenefit = JSON.parse(JSON.stringify(data.benefits));
    pushedBenefit.push("");
    setData({
      ...data,
      benefits: pushedBenefit,
    });
  };

  const changeIsSalaryEqual = () => {
    setIsSalaryEqual(!isSalaryEqual);
    setData({
      ...data,
      salary: {
        ...data.salary,
        max: data.salary.min,
      },
    });
  };

  const salaryChangeHandler = (val) => {
    setData({
      ...data,
      salary: {
        min: val,
        max: val,
      },
    });
  };

  const salariesChangeHandler = (type, val) => {
    if (type === "min") {
      if (val > data.salary.max) {
        return setData({
          ...data,
          salary: {
            max: val,
            [type]: val,
          },
        });
      }
    }
    setData({
      ...data,
      salary: {
        ...data.salary,
        [type]: val,
      },
    });
  };

  const selectProvinceHandler = (val) => {
    setData({
      ...data,
      location: {
        district: "",
        province: val,
      },
    });
  };

  const selectDistrictHandler = (val) => {
    setData({
      ...data,
      location: {
        ...data.location,
        district: val,
      },
    });
  };

  const tagsChangeHandler = (selectedTags) => {
    setData({
      ...data,
      tags: selectedTags,
    });
  };

  const submitHandler = () => {
    updateJob({
      variables: {
        input: {
          ...data,
          _id: job._id,
          details: data.details.filter((detail) => detail !== ""),
          qualifications: data.qualifications.filter((qualification) => qualification !== ""),
          benefits: data.benefits.filter((benefit) => benefit !== ""),
        },
      },
      onCompleted: (res) => {
        toast(res.updateJob.msg);
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
        <Input
          size="large"
          id="position"
          placeholder="ชื่อตำแหน่ง"
          onChange={positionChangeHandler}
          value={data.position}
        />
      </InputGroup>
      <InputGroup>
        <Label>รายละเอียดเพิ่มเติม</Label>
        {data.details.map((detail, index) => (
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
          {data.details.length < 10 && <AddMoreText onClick={addMoreDetailsHandler}>เพิ่ม</AddMoreText>}
        </AddMoreTextContainer>
      </InputGroup>
      <InputGroup>
        <Label>คุณสมบัติ</Label>
        {data.qualifications.map((qualification, index) => (
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
          {data.qualifications.length < 10 && <AddMoreText onClick={addMoreQualificationsHandler}>เพิ่ม</AddMoreText>}
        </AddMoreTextContainer>
      </InputGroup>
      <InputGroup>
        <Label>สวัสดิการ</Label>
        {data.benefits.map((benefit, index) => (
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
          {data.benefits.length < 10 && <AddMoreText onClick={addMoreBenefitsHandler}>เพิ่ม</AddMoreText>}
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
              value={data.salary.min}
            />
          </InputWrapper>
        ) : (
          <SalaryInputContainer>
            <InputNumber
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => salariesChangeHandler("min", val)}
              min={0}
              value={data.salary.min}
            />
            <Label style={{ margin: "0 1rem" }}>{" - "}</Label>
            <InputNumber
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => salariesChangeHandler("max", val)}
              min={data.salary.min}
              value={data.salary.max}
            />
          </SalaryInputContainer>
        )}
        <Checkbox defaultChecked={isSalaryEqual} onChange={changeIsSalaryEqual}>
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
            onChange={selectProvinceHandler}
            value={data.location.province}
          />
        </InputWrapper>
        {data.location.province && (
          <InputWrapper>
            <Select
              placeholder="เลือกอำเภอ"
              style={{ width: "40%" }}
              options={getDistrictOptions(data.location.province)}
              onChange={selectDistrictHandler}
              value={data.location.district}
            />
          </InputWrapper>
        )}
      </InputGroup>
      <InputGroup>
        <Label>Tags</Label>
        {tagsData && (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="เลือกTagที่เกี่ยวข้อง"
            value={data.tags}
            onChange={tagsChangeHandler}
          >
            {tagsData.getTags.map((tag) => (
              <Select.Option key={tag._id} value={tag._id} label={tag.name}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </InputGroup>
      <ButtonContainer>
        <Button size="large" onClick={submitHandler} disabled={updating}>
          {updating ? "กำลังแก้ไข.." : "ยืนยัน"}
        </Button>
      </ButtonContainer>
    </Form>
  );
};

export default EditJobForm;
