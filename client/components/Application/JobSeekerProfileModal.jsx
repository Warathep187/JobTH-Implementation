import { IdcardOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, Modal } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import BasicProfile from "./BasicProfile";
import Education from "./Education";
import { useQuery } from "@apollo/client";
import profileGql from "@/gql/profile";
import ErrorBox from "../Error/ErrorBox";
import Loading from "../Loading/Loading";

const PROFILE = {
  _id: 0,
  firstName: "xxxxxxxxx",
  lastName: "yyyyyyy",
  birthday: new Date(),
  gender: "MALE",
  address: "xxx xxx xxxx 23/4",
  profileImage: {
    url: "/unknown-profile.jpeg",
  },
  interestedTags: [
    { _id: 0, name: "xxx" },
    { _id: 0, name: "yyyy" },
  ],
  interestedPositions: ["adasdasdas", "asasdasdad", "asdasdasd"],
  settings: {
    canViewEducation: true,
  },
  educations: [
    {
      level: "FIRST",
      year: 2023,
      isStudying: true,
      academy: "CMU",
      major: "Com sci",
    },
    {
      level: "FIRST",
      year: 2023,
      isStudying: false,
      academy: "CMU",
      major: "Com sci",
    },
    {
      level: "FIRST",
      year: 2023,
      isStudying: false,
      academy: "CMU",
      major: "Com sci",
    },
  ],
};

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Container = styled.div`
  padding: 0 1rem;
`;

const JobSeekerProfileModal = ({ jobSeekerId, modalOpen, onSetModalOpen }) => {
  const { loading, data, error } = useQuery(profileGql.GET_APPLICATION_OWNER_PROFILE, {
    variables: {
      getApplicationOwnerProfileId: jobSeekerId,
    },
  });
  const [current, setCurrent] = useState("general");

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  const MENU_ITEMS = [
    {
      label: "ทั่วไป",
      key: "general",
      icon: <UserOutlined />,
    },
    {
      label: "ประวัติการศึกษา",
      key: "education",
      icon: <IdcardOutlined />,
      disabled: data ? !data.getApplicationOwnerProfile.settings.canViewEducation : false,
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Modal
      title={<Title>โปรไฟล์ของผู้สมัคร</Title>}
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      open={modalOpen}
      onCancel={() => onSetModalOpen(false)}>
      {loading && <Loading />}
      {data && (
        <Container>
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={MENU_ITEMS} />
          {current === "general" ? <BasicProfile profile={data.getApplicationOwnerProfile} /> : null}
          {current === "education" ? <Education educations={data.getApplicationOwnerProfile.educations} /> : null}
        </Container>
      )}
    </Modal>
  );
};

export default JobSeekerProfileModal;
