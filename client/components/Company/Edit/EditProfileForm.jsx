import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import profileGql from "@/gql/profile";
import resizeImage from "@/utils/base64Image";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Divider, Input, Select } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 70%;
  margin: 0 auto;
`;

const ImageContainer = styled.div`
  width: 12rem;
  height: 12rem;
  margin: 0 auto;
  border-radius: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
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

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 0.2rem;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  color: ${colors.black_1};
  font-size: 1rem;

  &:hover {
    color: ${colors.orange};
  }
`;

const CompanyEditProfileForm = ({ company }) => {
  const { loading: tagsLoading, data: tagsData, error } = useQuery(jobsGql.GET_TAGS);
  const [data, setData] = useState({
    companyName: company.companyName,
    contact: {
      email: company.contact.email,
      tel: company.contact.tel,
    },
    image: {
      url: company.image.url,
    },
    information: company.information,
    tags: company.tags.map((tag) => tag._id),
  });
  const [uploadImage, { loading: uploading }] = useMutation(profileGql.COMPANY_UPDATE_PROFILE_IMAGE);
  const [updateProfile, { loading }] = useMutation(profileGql.COMPANY_UPDATE_PROFILE);

  const imageChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    try {
      const base64Image = await resizeImage(file);
      uploadImage({
        variables: {
          input: {
            image: base64Image,
          },
        },
        onCompleted: (res) => {
          toast("อัพโหลดรูปภาพเรียบร้อย");
          setData({
            ...data,
            image: {
              url: res.companyUpdateProfileImage.url,
            },
          });
        },
      });
    } catch (err) {
      toast.error("ผิดพลาด");
    }
  };

  const tagsChangeHandler = (selectedTags) => {
    setData({
      ...data,
      tags: selectedTags,
    });
  };

  const dataChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const contactChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      contact: {
        ...data.contact,
        [name]: value,
      },
    });
  };

  const submitHandler = () => {
    updateProfile({
      variables: {
        input: {
          companyName: data.companyName,
          information: data.information,
          contact: data.contact,
          tags: data.tags,
        },
      },
      onCompleted: (res) => {
        toast(res.companyUpdateProfile.msg);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <FormContainer>
      <ImageContainer>
        <ImageInput type="file" accept="image/*" onChange={imageChangeHandler} />
        {uploading && (
          <ImageUploadingContainer>
            <ImageUploadingIcon />
          </ImageUploadingContainer>
        )}
        <ProfileImage src={data.image.url ? data.image.url : "/unknown-profile.jpeg"} />
        <ImageInputLabel>
          <ImageInputDescription>Upload</ImageInputDescription>
        </ImageInputLabel>
      </ImageContainer>
      <InputGroup>
        <Label>ชื่อบริษัท</Label>
        <Input size="large" name="companyName" onChange={dataChangeHandler} value={data.companyName} />
      </InputGroup>
      <InputGroup>
        <Label>รายละเอียดของบริษัท</Label>
        <Input.TextArea
          size="large"
          name="information"
          onChange={dataChangeHandler}
          rows={8}
          value={data.information}
        />
      </InputGroup>
      <InputGroup>
        <Label htmlFor="interestedTags">Tagsที่สนใจ</Label>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          optionLabelProp="label"
          defaultValue={data.tags}
          onChange={tagsChangeHandler}>
          {tagsData &&
            tagsData.getTags.map((tag) => (
              <Select.Option key={tag._id} value={tag._id} label={tag.name}>
                {tag.name}
              </Select.Option>
            ))}
        </Select>
      </InputGroup>
      <Divider orientation="left">Contact</Divider>
      <InputGroup>
        <Label>อีเมล</Label>
        <Input size="large" name="email" onChange={contactChangeHandler} value={data.contact.email} />
      </InputGroup>
      <InputGroup>
        <Label>เบอร์โทร</Label>
        <Input size="large" name="tel" onChange={contactChangeHandler} value={data.contact.tel} />
      </InputGroup>
      <BottomContainer>
        <StyledLink href="/profile/companies/password">
          <ArrowLeftOutlined /> เปลี่ยนรหัสผ่าน
        </StyledLink>
        <Button size="large" onClick={submitHandler} disabled={loading}>
          {loading ? "กำลังแก้ไข.." : "ยืนยัน"}
        </Button>
      </BottomContainer>
    </FormContainer>
  );
};

export default CompanyEditProfileForm;
