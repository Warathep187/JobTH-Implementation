import authGql from "@/gql/auth";
import { useMutation } from "@apollo/client";
import { Button, Input } from "antd";
import Head from "next/head";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const Container = styled.div`
  height: 85vh;
  position: relative;
`;

const CenteredContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.h1`
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 2.5rem;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  width: 25%;
  display: inline-block;
  margin-left: 10px;
`;

const ForgotPasswordPage = () => {
  const [sendEmail, { loading }] = useMutation(authGql.COMPANY_SEND_EMAIL);
  const [email, setEmail] = useState("");

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = () => {
    sendEmail({
      variables: {
        input: {
          email,
        },
      },
      onCompleted: (res) => {
        toast(res.companySendEmailForResetPassword.msg);
        setEmail("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <Head>
        <title>JobTH - อัปเดตงานคุณภาพทุกวัน</title>
      </Head>
      <Container>
        <CenteredContainer>
          <Title>กรุณากรอกอีเมลที่คุณลงทะเบียนไว้ ระบบจะส่งชื่อผู้ใช้ และรหัสผ่านไปยังอีเมลดังกล่าว</Title>
          <FormContainer>
            <Input size="large" placeholder="อีเมล" onChange={emailChangeHandler} value={email} />
            <StyledButton size="large" onClick={submitHandler} disabled={loading}>
              {loading ? "กำลังส่ง.." : "ส่ง"}
            </StyledButton>
          </FormContainer>
        </CenteredContainer>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
