import colors from "@/constant/colors";
import { Button, Input } from "antd";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${colors.white};
  padding: 3rem 4rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

const FormContainer = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  margin-bottom: 1.2rem;
`;

const ButtonContainer = styled.div`
  text-align: end;
`;

const ChangePassword = ({ enteredPassword, onPasswordChangeHandler, loading, onSubmitHandler }) => {
  return (
    <Container>
      <Title>เปลี่ยนรหัสผ่าน</Title>
      <FormContainer>
        <InputWrapper>
          <Input.Password
            size="large"
            name="oldPassword"
            placeholder="รหัสผ่านเดิม"
            value={enteredPassword.oldPassword}
            onChange={onPasswordChangeHandler}
          />
        </InputWrapper>
        <InputWrapper>
          <Input.Password
            size="large"
            name="newPassword"
            placeholder="รหัสผ่านใหม่"
            value={enteredPassword.newPassword}
            onChange={onPasswordChangeHandler}
          />
        </InputWrapper>
        <InputWrapper>
          <Input.Password
            size="large"
            name="confirm"
            placeholder="ยืนยันรหัสผ่าน"
            value={enteredPassword.confirm}
            onChange={onPasswordChangeHandler}
          />
        </InputWrapper>
        <ButtonContainer>
          <Button size="large" disabled={loading} onClick={onSubmitHandler}>
            {loading ? "กำลังเปลี่ยน.." : "ยืนยัน"}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </Container>
  );
};

export default ChangePassword;
