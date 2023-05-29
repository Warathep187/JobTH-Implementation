import colors from "@/constant/colors";
import authGql from "@/gql/auth";
import { useMutation } from "@apollo/client";
import { Button, Input } from "antd";
import Head from "next/head";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  width: 50%;
  margin: 2rem auto;
  padding: 3rem;
  box-shadow: 1rem 1rem 2rem ${colors.lightgrey_3};
  border-radius: 15px;
  background-color: ${colors.white};
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

const FormContainer = styled.div`
  width: 70%;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  margin-bottom: 1.2rem;
`;

const ButtonContainer = styled.div`
  text-align: end;
`;

const ChangePasswordPage = () => {
  const [changePassword, { loading }] = useMutation(authGql.COMPANY_CHANGE_PASSWORD);
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
        toast(res.companyChangePassword.msg);
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
      <RootContainer>
        <Container>
          <FormContainer>
            <Title>เปลี่ยนรหัสผ่าน</Title>
            <InputWrapper>
              <Input.Password
                size="large"
                name="oldPassword"
                value={enteredPassword.oldPassword}
                onChange={passwordChangeHandler}
                placeholder="รหัสผ่านเดิม"
              />
            </InputWrapper>
            <InputWrapper>
              <Input.Password
                size="large"
                name="newPassword"
                value={enteredPassword.newPassword}
                onChange={passwordChangeHandler}
                placeholder="รหัสผ่านใหม่"
              />
            </InputWrapper>
            <InputWrapper>
              <Input.Password
                size="large"
                name="confirm"
                value={enteredPassword.confirm}
                onChange={passwordChangeHandler}
                placeholder="ยืนยันรหัสผ่าน"
              />
            </InputWrapper>
            <ButtonContainer>
              <Button size="large" disabled={loading} onClick={submitHandler}>
                {loading ? "กำลังเปลี่ยน.." : "ยืนยัน"}
              </Button>
            </ButtonContainer>
          </FormContainer>
        </Container>
      </RootContainer>
    </>
  );
};

export default ChangePasswordPage;
