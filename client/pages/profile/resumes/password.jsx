import ChangePassword from "@/components/Profile/Edit/ChangePassword";
import colors from "@/constant/colors";
import menuItems from "@/constant/profileMenuItems";
import authGql from "@/gql/auth";
import { useMutation } from "@apollo/client";
import { Menu } from "antd";
import Head from "next/head";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const Container = styled.div`
  width: 70%;
  margin: 2rem auto;
  display: flex;
  align-items: start;
`;

const LeftSideContainer = styled.div`
  width: 30%;
  border: 0.5px solid ${colors.lightgrey_3};
  border-radius: 15px;
  background-color: ${colors.white};
  overflow: hidden;
  padding: 0.5rem 0;
`;

const RightSideContainer = styled.div`
  width: 70%;
  border: 0.5px solid ${colors.lightgrey_3};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: 5px solid ${colors.orange};
  margin-left: 2rem;
  overflow: hidden;
`;

const ChangePasswordPage = () => {
  const [changePassword, { loading }] = useMutation(authGql.JOB_SEEKER_CHANGE_PASSWORD);
  const [enteredPassword, setEnteredPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });

  const passwordChangeHandler = (e) => {
    const { name, value } = e.target;
    setEnteredPassword({
      ...enteredPassword,
      [name]: value,
    });
  };

  const submitHandler = () => {
    changePassword({
      variables: {
        input: {
          oldPassword: enteredPassword.oldPassword,
          newPassword: enteredPassword.newPassword,
        },
      },
      onCompleted: (res) => {
        toast(res.jobSeekerChangePassword.msg);
        setEnteredPassword({
          oldPassword: "",
          newPassword: "",
          confirm: "",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <Head>
        <title>JobTH - เปลี่ยนรหัสผ่าน</title>
      </Head>
      <Container>
        <LeftSideContainer>
          <Menu selectedKeys={["password"]} mode="vertical" items={menuItems} style={{ fontSize: "1rem" }} />
        </LeftSideContainer>
        <RightSideContainer>
          <ChangePassword
            enteredPassword={enteredPassword}
            onPasswordChangeHandler={passwordChangeHandler}
            loading={loading}
            onSubmitHandler={submitHandler}
          />
        </RightSideContainer>
      </Container>
    </>
  );
};

export default ChangePasswordPage;
