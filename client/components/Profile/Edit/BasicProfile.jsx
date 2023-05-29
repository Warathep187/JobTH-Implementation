import colors from "@/constant/colors";
import genders from "@/constant/genders";
import { useMutation, useQuery } from "@apollo/client";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import styled from "styled-components";
import profileGql from "../../../gql/profile";
import { toast } from "react-toastify";
import resizeImage from "@/utils/base64Image";
import { LoadingOutlined } from "@ant-design/icons";
import jobsGql from "@/gql/jobs";

const Container = styled.div`
  background-color: ${colors.white};
  padding: 3rem 5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

const ImageContainer = styled.div`
  width: 12rem;
  height: 12rem;
  margin: 0 auto;
  border-radius: 100%;
  position: relative;
  overflow: hidden;
`;

const ImageInput = styled.input`
  opacity: 0;
  height: 12rem;
  width: 12rem;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  z-index: 100;
  cursor: pointer;

  &:hover + img {
    transform: scale(1);
    filter: blur(3px) brightness(80%);
  }
  &:hover ~ div {
    bottom: 0;
  }
`;

const ProfileImage = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 100%;
  border: 0.5px solid ${colors.lightgrey_4};
  object-fit: cover;
  transition: all 0.5s;
`;

const ImageInputLabel = styled.div`
  position: absolute;
  left: 0;
  bottom: -30%;
  width: 100%;
  height: 2.5rem;
  padding-top: 0.5rem;
  text-align: center;
  background-color: ${colors.black_1};
  transition: all 0.5s;
`;

const ImageInputDescription = styled.b`
  font-weight: 900;
  color: white;
  font-size: 1rem;
`;

const ImageUploadingContainer = styled.div`
  position: absolute;
  z-index: 200;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors.black_1};
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110%;
  height: 110%;
`;

const ImageUploadingIcon = styled(LoadingOutlined)`
  font-size: 4rem;
  color: ${colors.lightgrey_2};
`;

const FormContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-top: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: inline-block;
  font-size: 1rem;
  margin-bottom: 0.3rem;
`;

const PositionInput = styled(Input)`
  display: block;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const ButtonContainer = styled.div`
  text-align: end;
`;

const BasicProfile = ({ profile }) => {
  const { loading: tagsLoading, data: tagsData, error } = useQuery(jobsGql.GET_TAGS);
  const [updateBasicProfile, { loading }] = useMutation(profileGql.UPDATE_BASIC_PROFILE);
  const [updateProfileImage, { loading: uploading }] = useMutation(profileGql.JOB_SEEKER_UPDATE_PROFILE_IMAGE);
  const [data, setData] = useState({
    address: profile.address,
    birthday: profile.birthday ? profile.birthday: new Date(),
    firstName: profile.firstName,
    gender: profile.gender,
    interestedPositions: profile.interestedPositions,
    lastName: profile.lastName,
    interestedTags: profile.interestedTags.map((tag) => tag._id),
    profileImage: profile.profileImage,
  });

  const profileImageChangeHandler = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Image = await resizeImage(file);
      updateProfileImage({
        variables: {
          input: {
            image: base64Image,
          },
        },
        onCompleted: (res) => {
          toast("อัพโหลดรูปภาพเรียบร้อย");
          setData({
            ...data,
            profileImage: {
              url: res.jobSeekerUpdateProfileImage.url,
            },
          });
        },
      });
    } catch (err) {
      toast.error("ผิดพลาด");
    }
  };

  // firstName lastName address
  const someDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const genderChangeHandler = (val) => {
    setData({
      ...data,
      gender: val,
    });
  };

  const birthdayChangeHandler = (val) => {
    const date = val.format("YYYY-MM-DD");
    setData({
      ...data,
      birthday: date,
    });
  };

  const tagsChangeHandler = (selectedTags) => {
    setData({
      ...data,
      interestedTags: selectedTags,
    });
  };

  const positionChangeHandler = (index, val) => {
    const copiedInterestedPosition = JSON.parse(JSON.stringify(data.interestedPositions));
    copiedInterestedPosition[index] = val;
    setData({
      ...data,
      interestedPositions: copiedInterestedPosition,
    });
  };

  const submitHandler = () => {
    updateBasicProfile({
      variables: {
        input: {
          address: data.address,
          birthday: data.birthday,
          firstName: data.firstName,
          gender: data.gender,
          interestedPositions: data.interestedPositions,
          lastName: data.lastName,
          interestedTags: data.interestedTags,
        },
      },
      onCompleted: (res) => {
        toast(res.updateBasicProfile.msg);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Container>
      <Title>แก้ไขโปรไฟล์</Title>
      <ImageContainer>
        <ImageInput type="file" accept="image/*" onChange={profileImageChangeHandler} />
        <ProfileImage src={data.profileImage.url ? data.profileImage.url : "/unknown-profile.jpeg"} />
        {uploading && (
          <ImageUploadingContainer>
            <ImageUploadingIcon />
          </ImageUploadingContainer>
        )}
        <ImageInputLabel>
          <ImageInputDescription>Upload</ImageInputDescription>
        </ImageInputLabel>
      </ImageContainer>
      <FormContainer>
        <InputGroup>
          <Label htmlFor="firstName">ชื่อ</Label>
          <Input size="large" name="firstName" placeholder="ชื่อจริง" onChange={someDataChangeHandler} id="firstName" value={data.firstName} />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="lastName">นามสกุล</Label>
          <Input size="large" name="lastName" placeholder="นามสกุล" onChange={someDataChangeHandler} id="lastName" value={data.lastName} />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="gender">เพศ</Label>
          <br />
          <Select
            defaultValue={data.gender}
            style={{ width: 120 }}
            id="gender"
            onChange={genderChangeHandler}
            options={genders}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="birthday">วันเกิด</Label>
          <br />
          <DatePicker
            id="birthday"
            allowClear={false}
            onChange={birthdayChangeHandler}
            value={dayjs(data.birthday.toString(), "YYYY-MM-DD")}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="address">ที่อยู่</Label>
          <Input.TextArea
            id="address"
            name="address"
            onChange={someDataChangeHandler}
            autoSize={{ minRows: 3, maxRows: 4 }}
            value={data.address}
            placeholder="ที่อยู่"
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="interestedTags">Tagsที่สนใจ</Label>
          {tagsData && (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="เลือกTagที่สนใจ"
              onChange={tagsChangeHandler}
              defaultValue={data.interestedTags}>
              {tagsData.getTags.map((tag) => (
                <Select.Option key={tag._id} value={tag._id} label={tag.name}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="interestedTags">ตำแหน่งที่สนใจ</Label>
          <div>
            <PositionInput
              size="large"
              onChange={(e) => positionChangeHandler(0, e.target.value)}
              value={data.interestedPositions[0] || ""}
              placeholder="ตำแหน่งที่สนใจ อันดับ 1"
            />
            <PositionInput
              size="large"
              onChange={(e) => positionChangeHandler(1, e.target.value)}
              value={data.interestedPositions[1] || ""}
              placeholder="ตำแหน่งที่สนใจ อันดับ 2"
            />
            <PositionInput
              size="large"
              onChange={(e) => positionChangeHandler(2, e.target.value)}
              value={data.interestedPositions[2] || ""}
              placeholder="ตำแหน่งที่สนใจ อันดับ 3"
            />
          </div>
        </InputGroup>
        <ButtonContainer>
          <Button size="large" onClick={submitHandler} disabled={loading}>
            {loading ? "กำลังแก้ไข.." : "แก้ไข"}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </Container>
  );
};

export default BasicProfile;
