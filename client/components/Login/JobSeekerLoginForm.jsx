import colors from "@/constant/colors";
import React from "react";
import styled, { keyframes } from "styled-components";
import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";

const Box = styled.div`
  background-color: ${colors.white};
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  box-shadow: 1rem 1rem 2rem ${colors.lightgrey_1};
  height: 25rem;
`;

const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FormContainer = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 1.5rem 0;
  text-align: center;

  animation: ${fadeInAnimation} 0.8s;
`;

const Title = styled.h1`
  font-size: 1.7rem;
`;

const InputGroup = styled.div`
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 2rem;
`;

const ForgotPasswordContainer = styled.div`
  text-align: end;
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${(props) => (props.isforgotpasswordlink ? colors.black_1 : colors.orange)};
  text-decoration: none;
  font-size: 0.8rem;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const UnregisteredContainer = styled.div`
  text-align: center;
`;

const JobSeekerLoginForm = ({ onLoginHandler, enteredData, onSetEnteredData, loading }) => {
  const dataChangeHandler = (e) => {
    const { name, value } = e.target;

    onSetEnteredData({
      ...enteredData,
      [name]: value,
    });
  };

  return (
    <Box>
      <FormContainer>
        <Title>เข้าสู่ระบบสำหรับผู้สมัครงาน</Title>
        <InputGroup>
          <InputWrapper>
            <Input
              size="large"
              placeholder="อีเมล"
              prefix={<UserOutlined />}
              name="email"
              onChange={dataChangeHandler}
              value={enteredData.email}
            />
          </InputWrapper>
          <InputWrapper>
            <Input.Password
              size="large"
              placeholder="รหัสผ่าน"
              prefix={<LockOutlined />}
              name="password"
              onChange={dataChangeHandler}
              value={enteredData.password}
            />
          </InputWrapper>
        </InputGroup>
        <ForgotPasswordContainer>
          <StyledLink href="/auth/resumes/forgot-password" isforgotpasswordlink>
            ลืมรหัสผ่าน?
          </StyledLink>
        </ForgotPasswordContainer>
        <StyledButton onClick={onLoginHandler} size="large" disabled={loading}>
          {loading ? "กำลังลงชื่อเข้าใช้.." : "ลงชื่อเข้าใช้"}
        </StyledButton>
        <UnregisteredContainer>
          <span>ยังไม่ได้เป็นสมาชิก JobTH?</span> <StyledLink href="/auth/resumes/create">สมัครสมาชิก</StyledLink>
        </UnregisteredContainer>
      </FormContainer>
    </Box>
  );
};

export default JobSeekerLoginForm;
