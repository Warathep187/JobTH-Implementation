import colors from "@/constant/colors";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Input } from "antd";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import authGQL from "../../../gql/auth";
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
  width: 30rem;
  height: 25rem;
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
  padding: 3rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
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
  const [register, { loading }] = useMutation(authGQL.JOB_SEEKER_REGISTER);
  const [enteredData, setEnteredData] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const { email, password, confirm } = enteredData;

  const dataChangeHandler = (e) => {
    const { name, value } = e.target;

    setEnteredData({
      ...enteredData,
      [name]: value,
    });
  };

  const submitHandler = async () => {
    if (password !== confirm) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }

    register({
      variables: {
        input: {
          email,
          password,
        },
      },
      onCompleted: (res) => {
        toast(res.jobSeekerRegister.msg);
        setEnteredData({
          email: "",
          password: "",
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
        <title>JobTH - อัปเดตงานคุณภาพทุกวัน</title>
      </Head>
      <Container>
        <RegisterBox>
          <RegisterForm>
            <Title>สมัครสมาชิกสำหรับผู้สมัครงาน</Title>
            <InputGroup>
              <InputWrapper>
                <Input
                  size="large"
                  placeholder="อีเมล"
                  prefix={<UserOutlined />}
                  name="email"
                  onChange={dataChangeHandler}
                  value={email}
                />
              </InputWrapper>
              <InputWrapper>
                <Input.Password
                  size="large"
                  placeholder="รหัสผ่าน"
                  prefix={<LockOutlined />}
                  name="password"
                  onChange={dataChangeHandler}
                  value={password}
                />
              </InputWrapper>
              <InputWrapper>
                <Input.Password
                  size="large"
                  placeholder="ยืนยันรหัสผ่าน"
                  prefix={<LockOutlined />}
                  name="confirm"
                  onChange={dataChangeHandler}
                  value={confirm}
                />
              </InputWrapper>
            </InputGroup>
            <StyledButton size="large" onClick={submitHandler} disabled={loading}>
              {loading ? "กำลังสมัครสมาชิก.." : "สมัครสมาชิก"}
            </StyledButton>
          </RegisterForm>
        </RegisterBox>
      </Container>
    </>
  );
};

export default create;
