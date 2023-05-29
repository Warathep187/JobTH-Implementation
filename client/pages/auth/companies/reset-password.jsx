import authGql from "@/gql/auth";
import { useMutation } from "@apollo/client";
import { Button, Input } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
  margin-bottom: 1rem;
`;

const FormContainer = styled.div`
  width: 25%;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1.5rem;
  width: 100%;
`;

const ResetPasswordPage = () => {
  const [resetPassword, { loading }] = useMutation(authGql.COMPANY_RESET_PASSWORD);
  const router = useRouter();

  const [enteredData, setEnteredData] = useState({
    password: "",
    confirm: "",
  });
  const [token, setToken] = useState(null);
  const { password, confirm } = enteredData;

  useEffect(() => {
    if (router.query.resetPasswordId) {
      setToken(router.query.resetPasswordId);
    }
  }, [router.query]);

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

    resetPassword({
      variables: {
        input: {
          token,
          password,
        },
      },
      onCompleted: (res) => {
        toast(res.companyResetPassword.msg);
        setEnteredData({
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
        <CenteredContainer>
          <Title>ตั้งรหัสผ่านใหม่</Title>
          <FormContainer>
            <InputGroup>
              <InputWrapper>
                <Input.Password
                  placeholder="รหัสผ่าน"
                  size="large"
                  name="password"
                  onChange={dataChangeHandler}
                  value={password}
                />
              </InputWrapper>
              <InputWrapper>
                <Input.Password
                  placeholder="ยืนยันรหัสผ่าน"
                  size="large"
                  name="confirm"
                  onChange={dataChangeHandler}
                  value={confirm}
                />
              </InputWrapper>
            </InputGroup>
            <StyledButton size="large" onClick={submitHandler} disabled={loading}>
              {loading ? "กำลังบันทึก.." : "บันทึกรหัสผ่านใหม่"}
            </StyledButton>
          </FormContainer>
        </CenteredContainer>
      </Container>
    </>
  );
};

export default ResetPasswordPage;
