import colors from "@/constant/colors";
import PROVINCES from "@/constant/provinces";
import jobsGql from "@/gql/jobs";
import { CaretRightOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Collapse, Input, InputNumber, Select } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
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

const Container = styled.div`
  border-radius: 10px;
  border: 1px solid ${colors.lightgrey_4};
  padding: 1.5rem 1rem;
  position: relative;
`;

const InputGroup = styled.div`
  &:not(:first-child) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: inline-block;
  margin-bottom: 0.3rem;
  font-size: 1rem;
  font-weight: 500;
`;

const InputWrapper = styled.div``;

const SalaryInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
`;

const ButtonContainer = styled.div`
  padding-top: 1rem;
`;

const StyledButton = styled(Button)`
  display: block;
  width: 50%;
  margin: 0 auto;
  background-color: ${colors.orange};
  color: white !important;

  &:hover {
    border: none;
    opacity: 0.8;
  }
`;

const SearchBox = ({ router }) => {
  const searchPageRouter = useRouter();
  const { loading, data, error } = useQuery(jobsGql.GET_TAGS);

  const [enteredData, setEnteredData] = useState({
    keyword: router && router.query.keyword ? router.query.keyword : "",
    salary: {
      min: router && router.query.salaryMin ? +router.query.salaryMin : 0,
      max: router && router.query.salaryMax ? +router.query.salaryMax : 100000,
    },
    location: {
      district: router && router.query.district ? router.query.district : "",
      province: router && router.query.province ? router.query.province : "",
    },
    tags: router && router.query.tags ? router.query.tags : [],
  });
  const [isAdvance, setIsAdvance] = useState(router ? !!router.query.isAdvance : false);

  const keywordChangeHandler = (e) => {
    setEnteredData({
      ...enteredData,
      keyword: e.target.value,
    });
  };

  const expandAdvanceOptionsHandler = () => {
    if (isAdvance) {
      setEnteredData({
        ...enteredData,
        salary: {
          min: 0,
          max: 100000,
        },
        location: {
          district: "",
          province: "",
        },
      });
    }
    setIsAdvance(!isAdvance);
  };

  const salariesChangeHandler = (type, val) => {
    if (type === "min") {
      if (val > enteredData.salary.max) {
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

  const searchHandler = () => {
    if (!isAdvance) {
      if (enteredData.keyword.trim() === "" && enteredData.tags.length === 0) {
        return;
      }
    }
    searchPageRouter.push(
      {
        pathname: `/jobs/search`,
        query: {
          keyword: enteredData.keyword.trim(),
          tags: enteredData.tags,
          salaryMin: enteredData.salary.min,
          salaryMax: enteredData.salary.max,
          province: enteredData.location.province,
          district: enteredData.location.district,
          isAdvance: isAdvance,
        },
      },
      `/jobs/search?keyword=${enteredData.keyword}&isAdvance=${isAdvance}`
    );
  };

  return (
    <Container>
      <InputGroup>
        <Label>คำที่ต้องการค้นหา</Label>
        <InputWrapper>
          <Input
            placeholder="ระบุตำแหน่งงาน หรือชื่อบริษัท"
            onChange={keywordChangeHandler}
            value={enteredData.keyword}
          />
        </InputWrapper>
      </InputGroup>
      <Collapse
        bordered={false}
        onChange={expandAdvanceOptionsHandler}
        activeKey={isAdvance ? "advance": "EMPTY"}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        ghost>
        <Collapse.Panel header="ค้นหาอย่างละเอียด" key="advance">
          <InputGroup>
            <Label>ค่าตอบแทน</Label>
            <SalaryInputContainer>
              <InputNumber
                style={{ width: "100%" }}
                value={enteredData.salary.min}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(value) => salariesChangeHandler("min", value)}
              />
              <Label style={{ margin: "0 1rem" }}>{" - "}</Label>
              <InputNumber
                style={{ width: "100%" }}
                value={enteredData.salary.max}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(value) => salariesChangeHandler("max", value)}
              />
            </SalaryInputContainer>
          </InputGroup>
          <InputGroup>
            <Label>สถานที่ทำงาน</Label>
            <InputWrapper>
              <Select
                style={{ width: "100%" }}
                placeholder="เลือกจังหวัด"
                options={provinces}
                value={enteredData.location.province}
                onChange={selectProvinceHandler}
              />
            </InputWrapper>
          </InputGroup>
          {enteredData.location.province && (
            <InputGroup>
              <Label>อำเภอ</Label>
              <InputWrapper>
                <Select
                  style={{ width: "100%" }}
                  placeholder="เลือกอำเภอ"
                  options={getDistrictOptions(enteredData.location.province)}
                  value={enteredData.location.district}
                  onChange={selectDistrictHandler}
                />
              </InputWrapper>
            </InputGroup>
          )}
        </Collapse.Panel>
      </Collapse>
      <InputGroup>
        <Label>Tagsที่เกี่ยวข้อง</Label>
        {data && (
          <InputWrapper>
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
          </InputWrapper>
        )}
      </InputGroup>
      <ButtonContainer>
        <StyledButton onClick={searchHandler}>ค้นหา</StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default SearchBox;
