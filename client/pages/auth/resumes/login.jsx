import JobSeekerLoginForm from "@/components/Login/JobSeekerLoginForm";
import colors from "@/constant/colors";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { AlertOutlined, FileOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import authGql from "@/gql/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setInitialLoggedInInfo } from "@/store/reducers/loggedInInfoSlice";
import { setNewCookie } from "@/utils/manageCookie";
import Head from "next/head";

const RootContainer = styled.div``;

const Container = styled.div`
  height: 85vh;
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 7rem;
`;

const LeftContainer = styled.div`
  width: 50%;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
`;

const RightContainer = styled.div`
  width: 50%;
  margin-left: 3rem;
`;

const LinkBoxGroup = styled.div`
  display: flex;
  align-items: center;
`;

const LinkBox = styled.div`
  padding: 1rem 2rem;
  background-color: ${colors.white};
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  border-right: 1px solid ${colors.lightgrey_3};
  display: flex;
  align-items: center;
`;

const StyledAlertOutlined = styled(AlertOutlined)`
  color: ${(props) => (props.isjobseeker ? colors.orange : colors.lightgrey_3)};
  font-size: 1.2rem;
  margin-right: 5px;
`;

const StyledFileOutlined = styled(FileOutlined)`
  color: ${(props) => (props.isjobseeker ? colors.orange : colors.lightgrey_3)};
  font-size: 1.2rem;
  margin-right: 5px;
`;

const LinkItem = styled(Link)`
  font-size: 1.4rem;
  text-decoration: none;
  color: ${(props) => (props.isjobseeker ? colors.orange : colors.lightgrey_3)};
  font-weight: 500;
`;

const login = () => {
  const [jobSeekerLogin, { loading }] = useMutation(authGql.JOB_SEEKER_LOGIN);
  const router = useRouter();
  const dispatch = useDispatch();

  const [enteredData, setEnteredData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = enteredData;

  const loginHandler = async () => {
    jobSeekerLogin({
      variables: {
        input: {
          email,
          password,
        },
      },
      onCompleted: (res) => {
        router.replace("/");
        dispatch(
          setInitialLoggedInInfo({
            id: res.jobSeekerLogin.id,
            role: res.jobSeekerLogin.role,
          })
        );
        setNewCookie("token", res.jobSeekerLogin.token);
        setNewCookie("userId", res.jobSeekerLogin.id);
        setEnteredData({
          email: "",
          password: "",
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
      <RootContainer>
        <Container>
          <LeftContainer>
            <Image src="/auth-resume.svg" alt="auth-resume" />
          </LeftContainer>
          <RightContainer>
            <LinkBoxGroup>
              <LinkBox>
                <StyledFileOutlined isjobseeker={true} />
                <LinkItem href="/auth/resume/login" isjobseeker={true}>
                  หางาน
                </LinkItem>
              </LinkBox>
              <LinkBox>
                <StyledAlertOutlined />
                <LinkItem href="/auth/companies/login">หาคน</LinkItem>
              </LinkBox>
            </LinkBoxGroup>
            <JobSeekerLoginForm
              onLoginHandler={loginHandler}
              enteredData={enteredData}
              onSetEnteredData={setEnteredData}
              loading={loading}
            />
          </RightContainer>
        </Container>
      </RootContainer>
    </>
  );
};

export default login;
