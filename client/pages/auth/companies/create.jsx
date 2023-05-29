import colors from "@/constant/colors";
import { HomeOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import authGQL from "@/gql/auth";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Head from "next/head";

const slideUpAnimation = keyframes`
  0% {
    top: 100%;
    opacity: 0;
  }
  80% {
    top: 46%;
    opacity: .8;
  }
  100% {
    top: 50%;
    opacity: 1;
  }
`;

const Container = styled.div`
  height: 85vh;
`;

const RegisterBox = styled.div`
  width: 28rem;
  height: 34rem;
  border-radius: 15px;
  background-color: ${colors.white};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 1rem 1rem 2rem ${colors.lightgrey_3};

  animation: ${slideUpAnimation} 0.5s;
`;

const RegisterForm = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const create = () => {
  const [register, { loading }] = useMutation(authGQL.COMPANY_REGISTER);
  const [enteredData, setEnteredData] = useState({
    email: "",
    password: "",
    confirm: "",
    companyName: "",
    contactEmail: "",
    contactTel: "",
  });
  const { email, password, confirm, companyName, contactEmail, contactTel } = enteredData;

  const dataChangeHandler = (e) => {
    const { name, value } = e.target;

    setEnteredData({
      ...enteredData,
      [name]: value,
    });
  };

  const submitHandler = () => {
    if (password !== confirm) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }

    register({
      variables: {
        input: {
          email,
          password,
          companyName,
          contact: {
            email: contactEmail,
            tel: contactTel,
          },
        },
      },
      onCompleted: (res) => {
        toast(res.companyRegister.msg);
        setEnteredData({
          email: "",
          password: "",
          confirm: "",
          companyName: "",
          contactEmail: "",
          contactTel: "",
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
        <title>JobTH - อัปเดตงานคุณภาพทุกวัน</title>
      </Head>
      <Container>
        <RegisterBox>
          <RegisterForm>
            <Title>สมัครสมาชิกสำหรับบริษัท</Title>
            <InputGroup>
              <InputWrapper>
                <Input
                  size="large"
                  placeholder="อีเมล"
                  prefix={<MailOutlined />}
                  onChange={dataChangeHandler}
                  name="email"
                  value={email}
                />
              </InputWrapper>
              <InputWrapper>
                <Input.Password
                  size="large"
                  placeholder="รหัสผ่าน"
                  prefix={<LockOutlined />}
                  onChange={dataChangeHandler}
                  name="password"
                  value={password}
                />
              </InputWrapper>
              <InputWrapper>
                <Input.Password
                  size="large"
                  placeholder="ยืนยันรหัสผ่าน"
                  prefix={<LockOutlined />}
                  onChange={dataChangeHandler}
                  name="confirm"
                  value={confirm}
                />
              </InputWrapper>
              <Divider>ข้อมูลบริษัท</Divider>
              <InputWrapper>
                <Input
                  size="middle"
                  placeholder="ชื่อบริษัท"
                  prefix={<HomeOutlined />}
                  onChange={dataChangeHandler}
                  name="companyName"
                  value={companyName}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  size="middle"
                  placeholder="อีเมลสำหรับการติดต่อ"
                  prefix={<MailOutlined />}
                  onChange={dataChangeHandler}
                  name="contactEmail"
                  value={contactEmail}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  size="middle"
                  placeholder="xxx-xxx-xxxx"
                  prefix={<PhoneOutlined />}
                  onChange={dataChangeHandler}
                  name="contactTel"
                  value={contactTel}
                />
              </InputWrapper>
            </InputGroup>
            <StyledButton size="large" onClick={submitHandler} disabled={loading}>
              {loading ? "กำลังสมัครสมาชิก.." : "สมัรสมาชิก"}
            </StyledButton>
          </RegisterForm>
        </RegisterBox>
      </Container>
    </>
  );
};

export default create;
